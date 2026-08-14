"use client";
import { useMemo, useState } from "react";
import {
  AgeRange,
  calculatePrice,
  Course,
  courses,
  locations,
  money,
  Package,
  packages,
} from "@/lib/pricing";
import { formatWAT } from "@/lib/time";

type PriceRow = {
  course: Course;
  packageType: Exclude<Package, "physical">;
  amount: number | null;
  available: boolean;
};
type Slot = {
  id: string;
  course: Course;
  packageType: Package;
  startsAt: string;
  status: string;
  capacity: number;
  cohortName: string | null;
};
const ages: AgeRange[] = ["18-24", "25-34", "35-45", "46+"];

export function EnrollmentFlow({
  catalog,
}: {
  catalog: { prices: PriceRow[]; slots: Slot[] };
}) {
  const [step, setStep] = useState(1),
    [course, setCourse] = useState<Course>(),
    [pack, setPack] = useState<Package>(),
    [age, setAge] = useState<AgeRange>("18-24"),
    [location, setLocation] = useState("lagos island"),
    [slotIds, setSlotIds] = useState<string[]>([]),
    [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
      "idle",
    ),
    [reference, setReference] = useState("");
  const priceRow = catalog.prices.find(
    (p) => p.course === course && p.packageType === pack,
  );
  const price = useMemo(
    () =>
      course && pack
        ? calculatePrice(
            course,
            pack,
            age,
            location,
            pack === "physical" ? undefined : priceRow?.amount,
          )
        : null,
    [course, pack, age, location, priceRow],
  );
  const needsSchedule =
    pack === "group" || pack === "personal" || pack === "physical";
  const relevant = catalog.slots.filter(
    (s) => s.course === course && s.packageType === pack,
  );
  const chosen = relevant.filter((s) => slotIds.includes(s.id));
  function toggle(id: string) {
    setSlotIds((v) =>
      v.includes(id)
        ? v.filter((x) => x !== id)
        : [...v, id].slice(-(pack === "group" ? 1 : 3)),
    );
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        course,
        packageType: pack,
        ageRange: age,
        location,
        name: f.get("name"),
        phone: f.get("phone"),
        whatsapp: f.get("whatsapp"),
        preferredSlots: chosen.map(
          (s) =>
            `${s.cohortName || "Class"} · ${formatWAT(s.startsAt)}`,
        ),
        slotId: slotIds[0] || null,
        consent: f.get("consent") === "on",
      }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      setReference(d.reference);
      setStatus("done");
    } else setStatus("error");
  }
  if (status === "done")
    return (
      <section className="flow-shell success-card">
        <span className="flow-kicker">APPLICATION RECEIVED</span>
        <h1>We’ll contact you on WhatsApp.</h1>
        <p>
          Your reference is <strong>{reference}</strong>. Track the request at{" "}
          <a href={`/status/${reference}`}>your application status page</a>.
        </p>
        <a
          className="flow-primary"
          href={`https://wa.me/2349029840305?text=${encodeURIComponent(`Hello Arcane Academy, I just applied. My reference is ${reference}.`)}`}
        >
          Message Arcane on WhatsApp
        </a>
      </section>
    );
  const canContinue =
    (step === 1 && !!course) ||
    (step === 2 && !!pack) ||
    (step === 3 && (!needsSchedule || slotIds.length > 0));
  return (
    <section className="flow-shell">
      <div className="flow-heading">
        <span className="flow-kicker">ENROLLMENT · STEP {step} OF 4</span>
        <h1>Build your learning plan.</h1>
        <p>
          Choose what you want to build, how you want to learn, and a time that
          works for you.
        </p>
      </div>
      <div className="progress">
        <i style={{ width: `${step * 25}%` }} />
      </div>
      {step === 1 && (
        <div className="choice-grid">
          {(Object.keys(courses) as Course[]).map((k) => (
            <button
              className={`choice ${course === k ? "selected" : ""}`}
              key={k}
              onClick={() => {
                setCourse(k);
                setPack(undefined);
                setSlotIds([]);
              }}
            >
              <small>COURSE</small>
              <h2>{courses[k].name}</h2>
              <p>{courses[k].description}</p>
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="choice-grid package-grid">
          {(Object.keys(packages) as Package[]).map((k) => {
            const row = catalog.prices.find(
                (p) => p.course === course && p.packageType === k,
              ),
              unavailable = k === "self_paced" && (!row || !row.available);
            return (
              <button
                disabled={unavailable}
                className={`choice ${pack === k ? "selected" : ""}`}
                key={k}
                onClick={() => {
                  setPack(k);
                  setSlotIds([]);
                }}
              >
                <small>
                  {unavailable ? "COMING SOON" : "LEARNING PACKAGE"}
                </small>
                <h2>{packages[k].name}</h2>
                <p>{packages[k].detail}</p>
              </button>
            );
          })}
        </div>
      )}
      {step === 3 && (
        <div className="details-panel">
          <div className="form-grid">
            <label>
              Age range
              <select
                value={age}
                onChange={(e) => setAge(e.target.value as AgeRange)}
              >
                {ages.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Location
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((x) => (
                  <option value={x} key={x}>
                    {x.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {needsSchedule && (
            <>
              <h3>Preferred {pack === "physical" ? "dates" : "class time"}</h3>
              <p className="muted">
                This is a request, not a reservation. Choose up to{" "}
                {pack === "group" ? 1 : 3} options.
              </p>
              <div className="slots">
                {relevant.length ? (
                  relevant.map((s) => {
                    const unavailable = s.status !== "available";
                    return (
                      <button
                        key={s.id}
                        disabled={unavailable}
                        className={slotIds.includes(s.id) ? "selected" : ""}
                        onClick={() => toggle(s.id)}
                      >
                        {s.cohortName || "Class"}
                        <span>
                          {formatWAT(s.startsAt)}
                        </span>
                        <small>
                          {unavailable ? "Unavailable" : "Available"}
                        </small>
                      </button>
                    );
                  })
                ) : (
                  <div className="empty">
                    No schedule is currently open for this option. Choose
                    another package or check back soon.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {step === 4 && (
        <form className="details-panel" onSubmit={submit}>
          <div className="price-summary">
            <small>YOUR {price?.kind === "quote" ? "QUOTE" : "PRICE"}</small>
            <strong>
              {price?.kind === "price"
                ? money.format(price.amount)
                : "We’ll prepare a bespoke quote"}
            </strong>
            {price?.kind === "price" && price.discount > 0 && (
              <span>Arcane Access Discount applied</span>
            )}
            <p>
              Payment details are provided only after an Arcane representative
              calls you.
            </p>
          </div>
          <div className="form-grid">
            <label>
              Full name
              <input name="name" required minLength={2} />
            </label>
            <label>
              Phone number
              <input name="phone" type="tel" required pattern="[+0-9 ()-]{7,}" placeholder="+234…" />
            </label>
            <label>
              WhatsApp phone number
              <input
                name="whatsapp"
                type="tel"
                required
                pattern="[+0-9 ()-]{7,}"
                placeholder="+234…"
              />
            </label>
          </div>
          <label className="consent">
            <input name="consent" type="checkbox" required /> I agree that
            Arcane Academy may contact me and process my information under its{" "}
            <a href="/privacy" target="_blank">
              privacy notice
            </a>
            .
          </label>
          {status === "error" && (
            <p className="form-error" role="alert">
              We couldn’t save your application. Please try again.
            </p>
          )}
          <button className="flow-primary" disabled={status === "sending"}>
            {status === "sending" ? "Submitting…" : "Submit application"}
          </button>
        </form>
      )}
      <div className="flow-actions">
        {step > 1 && (
          <button onClick={() => setStep((s) => s - 1)}>Back</button>
        )}
        {step < 4 && (
          <button
            className="flow-primary"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
          >
            Continue
          </button>
        )}
      </div>
    </section>
  );
}
