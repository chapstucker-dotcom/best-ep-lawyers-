"use client";
import React from "react";
import { z } from "zod";
import { hasSupabase, supabase } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().min(3),
  categories: z.string().min(2),
  plan: z.enum(["Free", "Basic", "Professional", "Expert"]).default("Free"),
  photo: z.string().url().optional().or(z.literal("")),
  about: z.string().max(1000).optional().or(z.literal("")),
  adminKey: z.string().optional(),
});

export default function AdminPage() {
  const [status, setStatus] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus("");
    try {
      const data = schema.parse({
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        website: formData.get("website")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        categories: formData.get("categories")?.toString() || "",
        plan: (formData.get("plan")?.toString() || "Free") as any,
        photo: formData.get("photo")?.toString() || "",
        about: formData.get("about")?.toString() || "",
        adminKey: formData.get("adminkey")?.toString() || "",
      });

      const categories = data.categories.split(",").map((s) => s.trim()).filter(Boolean);

      if (hasSupabase) {
        const { error } = await supabase.from("firms").insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website || null,
          address: data.address,
          categories,
          plan: data.plan,
          photo: data.photo || null,
          about: data.about || null,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
        if (error) throw error;
        setStatus("Submitted! Your firm will appear after review.");
      } else {
        // Fallback: require admin key to write to localStorage
        const requiredKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "change-me-admin-key";
        if (data.plan !== "Free" && data.adminKey !== requiredKey) {
          setStatus("In demo mode. To assign paid plans without Supabase, provide the correct Admin Key.");
        }
        const current = JSON.parse(localStorage.getItem("firms_demo") || "[]");
        current.push({
          ...data,
          categories,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("firms_demo", JSON.stringify(current));
        setStatus("Saved locally (demo mode). Add Supabase env vars to persist to a database.");
      }
    } catch (e: any) {
      setStatus(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">List Your Firm</h1>
      <p className="mt-2 text-gray-600">Start free. Upgrade later for more exposure and features.</p>
      <form
        className="mt-6 space-y-4 rounded-2xl border bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Firm Name</label>
            <input name="name" required className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Contact Email</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input name="phone" required className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Website</label>
            <input name="website" placeholder="https://…" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <input name="address" required className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Categories (comma-separated)</label>
            <input name="categories" placeholder="Personal Injury, Immigration" required className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Plan</label>
            <select name="plan" className="mt-1 w-full rounded-xl border px-3 py-2">
              <option>Free</option>
              <option>Basic</option>
              <option>Professional</option>
              <option>Expert</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Photo URL</label>
            <input name="photo" placeholder="https://…" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">About (optional)</label>
            <textarea name="about" rows={4} className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Admin Key (demo mode only)</label>
            <input name="adminkey" placeholder="Only needed without Supabase to set paid plans" className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
        </div>
        <button disabled={loading} className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50">
          {loading ? "Submitting…" : "Submit"}
        </button>
        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>
    </main>
  );
}
