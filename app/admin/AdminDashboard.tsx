"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { money } from "@/lib/pricing";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
const tabs = [
  "Overview",
  "Leads",
  "Schedules",
  "Pricing",
  "Payments",
  "Certificates",
  "Staff",
  "Analytics",
];
export function AdminDashboard(props: {
  profile: Row;
  leads: Row[];
  visits: Row[];
  slots: Row[];
  staff: Row[];
  prices: Row[];
  payments: Row[];
  receipts: Row[];
  certificates: Row[];
  notifications: Row[];
  notes: Row[];
  tutorPayments: Row[];
  audit: Row[];
}) {
  const {
    profile,
    leads,
    visits,
    slots,
    staff,
    prices,
    payments,
    receipts,
    certificates,
    notifications,
    tutorPayments,
    audit,
  } = props;
  const router = useRouter(),
    search = useSearchParams(),
    [tab, setTabState] = useState(search.get("tab") || "Overview"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const db = createClient();
  const analytics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10),
      uniqueDays: Record<string, number> = {},
      devices: Record<string, number> = {},
      pages: Record<string, number> = {},
      browsers: Record<string, number> = {};
    visits.forEach((v) => {
      const d = v.visited_at.slice(0, 10);
      uniqueDays[d] = (uniqueDays[d] || 0) + 1;
      devices[v.device_type] = (devices[v.device_type] || 0) + 1;
      pages[v.path] = (pages[v.path] || 0) + 1;
      browsers[v.browser] = (browsers[v.browser] || 0) + 1;
    });
    return {
      today: uniqueDays[today] || 0,
      devices,
      pages,
      browsers,
      days: Object.entries(uniqueDays).slice(0, 14),
    };
  }, [visits]);
  function setTab(x: string) {
    setTabState(x);
    history.replaceState(null, "", `/admin?tab=${x}`);
  }
  async function action(name: string, payload: Row) {
    if (!db) return;
    setBusy(true);
    setMessage("");
    const { data, error } = await db.rpc("admin_dashboard_action", {
      p_action: name,
      p_payload: payload,
    });
    setBusy(false);
    setMessage(error ? error.message : "Saved");
    if (!error) {
      router.refresh();
      return data;
    }
  }
  async function signOut() {
    if (!db) return;
    await db.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  async function recordTutorPayment(form: HTMLFormElement) {
    if (!db) return;
    setBusy(true);
    const values = Object.fromEntries(new FormData(form));
    const { error } = await db.from("tutor_payments").insert({ tutor_id: values.tutor_id, enrollment_id: values.enrollment_id || null, amount: Number(values.amount), status: values.status, reference: values.reference || null, paid_at: values.status === "paid" ? new Date().toISOString() : null });
    setBusy(false);
    setMessage(error ? error.message : "Tutor payment saved");
    if (!error) router.refresh();
  }
  function exportCsv() {
    const headers = [
      "reference",
      "name",
      "phone",
      "whatsapp",
      "location",
      "age_range",
      "course",
      "package_type",
      "quoted_amount",
      "status",
      "created_at",
    ];
    const csv = [
      headers.join(","),
      ...leads.map((l) =>
        headers
          .map((h) => `"${String(l[h] ?? "").replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `arcane-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }
  return (
    <main className="crm">
      <aside>
        <div className="portal-brand">
          ARCANE <span>ACADEMY</span>
        </div>
        <small>CRM WORKSPACE</small>
        {tabs.map((x) => (
          <button
            key={x}
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
        <Link href="/">View public site ↗</Link>
      </aside>
      <section className="crm-main">
        <header>
          <div>
            <span className="flow-kicker">{tab.toUpperCase()}</span>
            <h1>{tab}</h1>
          </div>
          <div className="staff-chip">
            <span>{profile.name || profile.email}</span>
            <small>{profile.email} · {profile.role}</small>
            <button onClick={signOut}>Sign out</button>
          </div>
        </header>
        {message && (
          <p className="crm-message" role="status">
            {message}
          </p>
        )}
        {tab === "Overview" && (
          <>
            <div className="metric-grid">
              <Metric label="Applications" value={leads.length} />
              <Metric label="Visits today" value={analytics.today} />
              <Metric
                label="Fully paid"
                value={payments.filter((p) => p.status === "fully_paid").length}
              />
              <Metric
                label="Unread alerts"
                value={notifications.filter((n) => !n.read_at).length}
              />
            </div>
            <div className="crm-grid">
              <Panel title="Recent applications">
                <LeadTable leads={leads.slice(0, 6)} />
              </Panel>
              <Panel title="Notifications">
                {notifications.length ? (
                  notifications.slice(0, 8).map((n) => (
                    <div className="notice" key={n.id}>
                      <b>{n.title}</b>
                      <span>{n.body}</span>
                    </div>
                  ))
                ) : (
                  <Empty text="No alerts yet." />
                )}
                <PushButton />
              </Panel>
              <Panel title="Recent audit activity">{audit.length ? audit.slice(0, 8).map((item) => <div className="notice" key={item.id}><b>{item.action}</b><span>{item.entity_type} · {new Date(item.created_at).toLocaleString()}</span></div>) : <Empty text="No recorded changes yet." />}</Panel>
            </div>
          </>
        )}
        {tab === "Leads" && (
          <Panel title="Enrollment pipeline">
            <div className="panel-actions">
              <button onClick={exportCsv}>Export CSV</button>
            </div>
            {leads.length ? (
              leads.map((l) => (
                <article className="lead-card" key={l.id}>
                  <div>
                    <b>{l.name}</b>
                    <small>
                      {l.reference} · Phone: {l.phone} · WhatsApp: {l.whatsapp} · {l.location}
                    </small>
                    <span>
                      {l.course} · {l.package_type} ·{" "}
                      {l.quoted_amount
                        ? money.format(l.quoted_amount)
                        : "Quote"}
                    </span>
                  </div>
                  <label>
                    Status
                    <select
                      defaultValue={l.status}
                      onChange={(e) =>
                        action("update_lead", {
                          id: l.id,
                          status: e.target.value,
                        })
                      }
                    >
                      {[
                        "new",
                        "assigned",
                        "contacted",
                        "schedule_review",
                        "awaiting_payment",
                        "paid",
                        "learning",
                        "project_submitted",
                        "completed",
                        "archived",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Assign
                    <select
                      defaultValue={l.assigned_to || ""}
                      onChange={(e) =>
                        action("update_lead", {
                          id: l.id,
                          assigned_to: e.target.value,
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {staff
                        .filter((s) => s.status === "approved")
                        .map((s) => (
                          <option value={s.user_id} key={s.user_id}>
                            {s.name || s.email}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Follow up
                    <input
                      type="datetime-local"
                      onChange={(e) =>
                        action("update_lead", {
                          id: l.id,
                          follow_up_at: e.target.value,
                        })
                      }
                    />
                  </label>
                  <button
                    onClick={() => {
                      const body = prompt("Add an internal note");
                      if (body) action("note", { enrollment_id: l.id, body });
                    }}
                  >
                    Add note
                  </button>
                </article>
              ))
            ) : (
              <Empty text="No leads yet." />
            )}
          </Panel>
        )}
        {tab === "Schedules" && (
          <>
            <Panel title="Create availability">
              <form
                className="inline-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action("add_slot", Object.fromEntries(f));
                }}
              >
                <select name="course">
                  <option value="web">Web</option>
                  <option value="android">Android</option>
                </select>
                <select name="package_type">
                  <option value="group">Group</option>
                  <option value="personal">Personal</option>
                  <option value="physical">Physical</option>
                </select>
                <input name="starts_at" type="datetime-local" required />
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue="20"
                />
                <input name="cohort_name" placeholder="Cohort name" required />
                <button disabled={busy}>Create</button>
              </form>
            </Panel>
            <Panel title="Published availability">
              {slots.map((s) => (
                <div className="admin-row" key={s.id}>
                  <b>{s.cohort_name}</b>
                  <span>
                    {s.course} · {s.package_type} ·{" "}
                    {new Date(s.starts_at).toLocaleString()} ·{" "}
                    {s.enrolled_count}/{s.capacity}
                  </span>
                  <button onClick={() => action("toggle_slot", { id: s.id })}>
                    {s.is_active ? "Disable" : "Enable"}
                  </button>
                </div>
              ))}
            </Panel>
          </>
        )}
        {tab === "Pricing" && (
          <Panel title="Course pricing">
            {prices.map((p) => (
              <form
                className="admin-row"
                key={p.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action("update_price", {
                    course: p.course,
                    package_type: p.package_type,
                    amount: f.get("amount"),
                    available: f.get("available") === "on",
                  });
                }}
              >
                <b>
                  {p.course} · {p.package_type}
                </b>
                <input
                  name="amount"
                  type="number"
                  min="5000"
                  step="500"
                  defaultValue={p.amount || 15000}
                />
                <label>
                  <input
                    name="available"
                    type="checkbox"
                    defaultChecked={p.available}
                  />{" "}
                  Available
                </label>
                <button>Save</button>
              </form>
            ))}
          </Panel>
        )}
        {tab === "Payments" && (<>
          <Panel title="Manual payment verification">
            <form
              className="inline-form"
              onSubmit={(e) => {
                e.preventDefault();
                action(
                  "payment",
                  Object.fromEntries(new FormData(e.currentTarget)),
                );
              }}
            >
              <select name="enrollment_id" required>
                <option value="">Choose applicant</option>
                {leads.map((l) => (
                  <option value={l.id} key={l.id}>
                    {l.reference} · {l.name}
                  </option>
                ))}
              </select>
              <input
                name="expected_amount"
                type="number"
                placeholder="Expected"
                required
              />
              <input
                name="received_amount"
                type="number"
                placeholder="Received"
                required
              />
              <input
                name="reference"
                placeholder="Transfer reference"
                required
              />
              <select name="status">
                <option>fully_paid</option>
                <option>unpaid</option>
                <option>waived</option>
                <option>refunded</option>
              </select>
              <input name="notes" placeholder="Notes" />
              <button>Verify payment</button>
            </form>
            {payments.map((p) => (
              <div className="admin-row" key={p.id}>
                <b>{p.status}</b>
                <span>
                  {money.format(p.received_amount || 0)} ·{" "}
                  {p.transfer_reference}
                </span>
                {receipts.find((r) => r.payment_id === p.id) && (
                  <Link
                    href={`/receipt/${receipts.find((r) => r.payment_id === p.id)!.receipt_number}`}
                  >
                    Receipt
                  </Link>
                )}
              </div>
            ))}
          </Panel>
          <Panel title="Tutor course payments">
            <form className="inline-form" onSubmit={(event) => { event.preventDefault(); recordTutorPayment(event.currentTarget); }}>
              <select name="tutor_id" required><option value="">Choose tutor</option>{staff.filter((person) => person.role === "tutor" && person.status === "approved").map((person) => <option key={person.user_id} value={person.user_id}>{person.name || person.email}</option>)}</select>
              <select name="enrollment_id"><option value="">No linked enrollment</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.reference} · {lead.name}</option>)}</select>
              <input name="amount" type="number" min="0" placeholder="Amount" required />
              <select name="status"><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="waived">Waived</option></select>
              <input name="reference" placeholder="Payment reference" />
              <button disabled={busy}>Save tutor payment</button>
            </form>
            {tutorPayments.map((payment) => <div className="admin-row" key={payment.id}><b>{payment.status}</b><span>{money.format(payment.amount)} · {payment.reference || "No reference"}</span></div>)}
          </Panel>
        </>)}
        {tab === "Certificates" && (
          <Panel title="Projects and certificates">
            {leads
              .filter(
                (l) =>
                  l.status === "project_submitted" ||
                  l.project_status === "submitted",
              )
              .map((l) => (
                <div className="admin-row" key={l.id}>
                  <b>{l.name}</b>
                  <a href={l.project_url || "#"}>View project</a>
                  <button
                    onClick={() =>
                      action("certificate", { enrollment_id: l.id })
                    }
                  >
                    Approve & issue
                  </button>
                </div>
              ))}
            {certificates.map((c) => (
              <div className="admin-row" key={c.id}>
                <b>{c.learner_name}</b>
                <span>{c.verification_number}</span>
                <Link href={`/certificate/${c.verification_number}`}>
                  Verify
                </Link>
              </div>
            ))}
          </Panel>
        )}
        {tab === "Staff" && (
          <Panel title="Team access">
            {staff.map((s) => (
              <form
                className="admin-row"
                key={s.user_id}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action("staff", {
                    user_id: s.user_id,
                    role: f.get("role"),
                    status: f.get("status"),
                  });
                }}
              >
                <b>
                  {s.name || s.email}
                  <small>{s.email}</small>
                </b>
                <select name="role" defaultValue={s.role}>
                  <option value="admin">Admin</option>
                  <option value="enrollment">Enrollment staff</option>
                  <option value="tutor">Tutor</option>
                  <option value="owner">Owner</option>
                </select>
                <select name="status" defaultValue={s.status}>
                  <option>pending</option>
                  <option>approved</option>
                  <option>rejected</option>
                  <option>expired</option>
                </select>
                <button>Save</button>
              </form>
            ))}
          </Panel>
        )}
        {tab === "Analytics" && (
          <div className="crm-grid">
            <Panel title="Daily visits">
              <Bars data={analytics.days} />
            </Panel>
            <Panel title="Devices">
              <KeyValues data={analytics.devices} />
            </Panel>
            <Panel title="Browsers">
              <KeyValues data={analytics.browsers} />
            </Panel>
            <Panel title="Top pages">
              <KeyValues data={analytics.pages} />
            </Panel>
          </div>
        )}
      </section>
    </main>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="empty">{text}</div>;
}
function LeadTable({ leads }: { leads: Row[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Plan</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>
                <b>{l.name}</b>
                <small>{l.reference}</small>
              </td>
              <td>
                {l.course} · {l.package_type}
              </td>
              <td>
                {l.quoted_amount ? money.format(l.quoted_amount) : "Quote"}
              </td>
              <td>
                <span className="status-pill">{l.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function KeyValues({ data }: { data: Record<string, number> }) {
  return (
    <div className="device-list">
      {Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
    </div>
  );
}
function Bars({ data }: { data: [string, number][] }) {
  const max = Math.max(1, ...data.map((x) => x[1]));
  return (
    <div className="bars">
      {data.map(([d, v]) => (
        <div key={d}>
          <span>{d.slice(5)}</span>
          <i style={{ height: `${Math.max(8, (v / max) * 120)}px` }} />
          <b>{v}</b>
        </div>
      ))}
    </div>
  );
}
function PushButton() {
  async function enable() {
    if (!("Notification" in window) || !("serviceWorker" in navigator))
      return alert("Push notifications are not supported on this device.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const registration = await navigator.serviceWorker.register("/sw.js");
    const existing = await registration.pushManager.getSubscription();
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key) return alert("Push is still being configured.");
    const bytes = Uint8Array.from(
      atob(key.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(key.length / 4) * 4, "=")),
      (char) => char.charCodeAt(0),
    );
    const subscription = existing || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes });
    const response = await fetch("/api/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(subscription) });
    if (response.ok) new Notification("Arcane alerts enabled", { body: "Important CRM notifications will arrive on this device." });
    else alert("Could not enable notifications.");
  }
  return (
    <button className="panel-button" onClick={enable}>
      Enable web notifications
    </button>
  );
}
