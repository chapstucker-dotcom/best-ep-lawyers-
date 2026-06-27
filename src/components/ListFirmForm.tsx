import { useState } from "react";
import { createFirm } from "@/services/firmService";

export default function ListFirmForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    bio: "",
    plan: "Free",
    agreed: false,
  });

  const [status, setStatus] = useState("");

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    if (!formData.agreed) {
      setStatus("Please agree to the attorney advertising notice.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setStatus("Please fill out all required fields.");
      return;
    }

    const website =
      formData.website && !formData.website.startsWith("http")
        ? `https://${formData.website}`
        : formData.website;

    const { error } = await createFirm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website,
      address: formData.address,
      bio: formData.bio,
      category: "Pending Review",
      plan: formData.plan,
      is_featured: false,
      is_exclusive: false,
      is_verified: false,
    });

    if (error) {
      console.error(error);
      setStatus("Submission received, but there was a database issue. Check Supabase.");
      return;
    }

    try {
      await fetch("/api/send-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firmName: formData.name,
          contactName: formData.name,
          email: formData.email,
          phone: formData.phone,
          website,
          address: formData.address,
          city: "El Paso",
          state: "TX",
          plan: formData.plan,
        }),
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    setStatus("Success! Your listing was submitted for review.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      bio: "",
      plan: "Free",
      agreed: false,
    });
  };

  return (
    <section id="list-form" className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border rounded-xl p-8 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-[#021B45] mb-8">
            List Your Law Firm
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Firm Name *</label>
              <input
                className="w-full border rounded-lg p-3"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Email *</label>
              <input
                type="email"
                className="w-full border rounded-lg p-3"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Phone *</label>
              <input
                className="w-full border rounded-lg p-3"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Website</label>
              <input
                className="w-full border rounded-lg p-3"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Address *</label>
            <input
              className="w-full border rounded-lg p-3"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">About Your Firm</label>
            <textarea
              className="w-full border rounded-lg p-3 min-h-[120px]"
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Select Plan</label>
            <select
              className="w-full border rounded-lg p-3"
              value={formData.plan}
              onChange={(e) => updateField("plan", e.target.value)}
            >
              <option value="Free">Free</option>
              <option value="Expert">Expert — $299/mo</option>
              <option value="Category Featured">Category Featured — $2,000/mo</option>
              <option value="Category Exclusive">Category Exclusive — $5,000/mo</option>
            </select>
          </div>

          <label className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              checked={formData.agreed}
              onChange={(e) => updateField("agreed", e.target.checked)}
            />
            <span>I agree this is attorney advertising. *</span>
          </label>

          {status && (
            <p className="mt-4 font-semibold text-[#021B45]">
              {status}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-[#1FA8A1] text-white py-4 rounded-lg font-bold hover:opacity-90"
          >
            Submit Listing
          </button>
        </form>
      </div>
    </section>
  );
}