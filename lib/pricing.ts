export type Course = "web" | "android";
export type Package = "group" | "personal" | "self_paced" | "physical";
export type AgeRange = "18-24" | "25-34" | "35-45" | "46+";

export const courses = {
  web: { name: "AI Web Development", description: "Build and publish a database-powered website." },
  android: { name: "AI Android App Development", description: "Build an Android app and test it on your phone." },
} as const;

export const packages = {
  group: { name: "Group live class", detail: "14 live, one-hour classes · up to 20 learners" },
  personal: { name: "Personal live class", detail: "14 private, one-hour classes with your tutor" },
  self_paced: { name: "Self-paced", detail: "Lifetime access · certificate · one month WhatsApp support" },
  physical: { name: "Physical class", detail: "One-to-one at your home · currently Lagos only" },
} as const;

const bases: Record<Course, Record<Exclude<Package, "physical">, number | null>> = {
  web: { group: 45000, personal: 105000, self_paced: 15000 },
  android: { group: 60000, personal: 135000, self_paced: null },
};

const moderate = ["lagos mainland", "port harcourt", "ibadan"];
const higher = ["owerri", "enugu", "aba", "onitsha", "asaba", "warri", "benin", "kano", "other nigeria"];

export function calculatePrice(course: Course, packageType: Package, age: AgeRange, location: string) {
  if (packageType === "physical" || location === "outside nigeria") return { kind: "quote" as const };
  const base = bases[course][packageType];
  if (base === null) return { kind: "unavailable" as const };
  if (packageType === "self_paced") return { kind: "price" as const, base, amount: 15000, discount: 0 };
  const ageDiscount = age === "18-24" ? 0.1 : 0;
  const regionDiscount = moderate.includes(location) ? 0.075 : higher.includes(location) ? 0.15 : 0;
  const discount = Math.min(0.25, ageDiscount + regionDiscount);
  const amount = Math.max(5000, Math.round((base * (1 - discount)) / 500) * 500);
  return { kind: "price" as const, base, amount, discount };
}

export const locations = ["lagos island", "lagos mainland", "port harcourt", "abuja", "owerri", "enugu", "aba", "onitsha", "asaba", "warri", "benin", "ibadan", "kano", "other nigeria", "outside nigeria"];
export const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
