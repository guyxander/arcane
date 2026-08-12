"use client";
import { useMemo, useState } from "react";
import { money } from "@/lib/pricing";
import Link from "next/link";

// Database rows are narrowed by the queries that feed this internal dashboard.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export function AdminDashboard({ profile, leads, visits, slots, staff }: { profile: Row; leads: Row[]; visits: Row[]; slots: Row[]; staff: Row[] }) {
  const [tab, setTab] = useState("Overview");
  const analytics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const byDevice = visits.reduce((acc: Record<string, number>, visit) => ({ ...acc, [visit.device_type]: (acc[visit.device_type] || 0) + 1 }), {});
    return { today: visits.filter((visit) => visit.visited_at.startsWith(today)).length, total: visits.length, byDevice };
  }, [visits]);
  return <main className="crm">
    <aside><div className="portal-brand">ARCANE <span>ACADEMY</span></div><small>CRM WORKSPACE</small>{["Overview", "Leads", "Schedules", "Payments", "Certificates", "Staff"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}<Link href="/">View public site ↗</Link></aside>
    <section className="crm-main"><header><div><span className="flow-kicker">{tab.toUpperCase()}</span><h1>{tab}</h1></div><div className="staff-chip">{profile.name}<small>{profile.role}</small></div></header>
      {tab === "Overview" && <><div className="metric-grid"><Metric label="New leads" value={leads.length}/><Metric label="Visits today" value={analytics.today}/><Metric label="Recorded visits" value={analytics.total}/><Metric label="Awaiting payment" value={leads.filter((lead) => lead.status === "awaiting_payment").length}/></div><div className="crm-grid"><Panel title="Recent applications"><LeadTable leads={leads.slice(0, 6)}/></Panel><Panel title="Device mix"><div className="device-list">{Object.entries(analytics.byDevice).map(([key, value]) => <div key={key}><span>{key}</span><strong>{Number(value)}</strong></div>)}</div><p className="muted">Aggregate analytics only. Raw IP addresses and fingerprint identifiers are not stored.</p></Panel></div></>}
      {tab === "Leads" && <Panel title="Enrollment pipeline"><LeadTable leads={leads}/></Panel>}
      {tab === "Schedules" && <Panel title="Availability"><p>Create group and personal class availability. Existing slots:</p>{slots.length ? slots.map((slot) => <div className="admin-row" key={slot.id}><b>{slot.package_type}</b><span>{new Date(slot.starts_at).toLocaleString()}</span><small>{slot.status}</small></div>) : <Empty text="No availability has been published yet."/>}</Panel>}
      {tab === "Payments" && <Panel title="Manual payments"><p>Record expected and received amounts and the transfer reference after verification. Schedule priority lasts 48 hours after approval.</p><Empty text="Payment verification begins when an applicant is moved to awaiting payment."/></Panel>}
      {tab === "Certificates" && <Panel title="Certificates"><p>Tutors approve completed final projects. Arcane Academy Management certificates receive a unique public verification number.</p><Empty text="No certificates have been issued yet."/></Panel>}
      {tab === "Staff" && <Panel title="Team access">{staff.map((member) => <div className="admin-row" key={member.user_id}><b>{member.name || member.email}</b><span>{member.role}</span><small className={member.status}>{member.status}</small></div>)}</Panel>}
    </section>
  </main>;
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="metric"><small>{label}</small><strong>{value}</strong></div>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="admin-panel"><h2>{title}</h2>{children}</section>; }
function Empty({ text }: { text: string }) { return <div className="empty">{text}</div>; }
function LeadTable({ leads }: { leads: Row[] }) { if (!leads.length) return <Empty text="New applications will appear here."/>; return <div className="table-wrap"><table><thead><tr><th>Applicant</th><th>Plan</th><th>Price</th><th>Status</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><b>{lead.name}</b><small>{lead.reference}</small></td><td>{lead.course} · {lead.package_type}</td><td>{lead.quoted_amount ? money.format(lead.quoted_amount) : "Quote"}</td><td><span className="status-pill">{lead.status}</span></td></tr>)}</tbody></table></div>; }
