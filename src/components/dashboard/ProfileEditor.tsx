import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { getFirmByUserId, saveFirmProfile } from "@/services/firmService";
import { deleteLogo, uploadLogo } from "@/services/storageService";

type FormState = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  practiceAreas: string;
  years_experience: string;
  team_size: string;
  consultation_fee: string;
  logo_url: string;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  address: "",
  city: "El Paso",
  state: "TX",
  zip_code: "",
  phone: "",
  email: "",
  website: "",
  practiceAreas: "",
  years_experience: "",
  team_size: "",
  consultation_fee: "",
  logo_url: "",
};

const text = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const areasText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean).join(", ");
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean).join(", ");
  }
  return "";
};

const integerInput = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits ? digits.replace(/^0+(?=\d)/, "") : "";
};

const moneyInput = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot < 0) return cleaned.replace(/^0+(?=\d)/, "");
  const whole = cleaned.slice(0, dot).replace(/^0+(?=\d)/, "") || "0";
  const decimals = cleaned.slice(dot + 1).replace(/\./g, "").slice(0, 2);
  return `${whole}.${decimals}`;
};

const websiteValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const optionalNumber = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const ProfileEditor = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const setField = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await getFirmByUserId(user.id);
      if (!active) return;

      if (error) {
        setMessage(error.message || "Could not load the profile.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (data) {
        setForm({
          name: text(data.name),
          description: text(data.description),
          address: text(data.address),
          city: text(data.city) || "El Paso",
          state: text(data.state) || "TX",
          zip_code: text(data.zip_code),
          phone: text(data.phone),
          email: text(data.email) || user.email || "",
          website: text(data.website),
          practiceAreas: areasText(data.specialties),
          years_experience: text(data.years_experience),
          team_size: text(data.team_size),
          consultation_fee: text(data.consultation_fee),
          logo_url: text(data.logo_url),
        });
      } else {
        setForm({ ...EMPTY, email: user.email || "" });
      }

      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [user]);

  const save = async () => {
    setMessage("");
    setMessageType("");

    if (!user) {
      setMessage("You must be signed in before saving.");
      setMessageType("error");
      return;
    }

    if (form.name.trim().length < 3) {
      setMessage("Firm name must be at least 3 characters.");
      setMessageType("error");
      return;
    }

    const specialties = form.practiceAreas
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    setSaving(true);
    const { data, error } = await saveFirmProfile(user.id, {
      name: form.name.trim(),
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || "El Paso",
      state: form.state.trim().toUpperCase() || "TX",
      zip_code: form.zip_code.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      website: websiteValue(form.website),
      specialties,
      years_experience: optionalNumber(form.years_experience),
      team_size: optionalNumber(form.team_size),
      consultation_fee: optionalNumber(form.consultation_fee),
      logo_url: form.logo_url || null,
    });
    setSaving(false);

    if (error) {
      setMessage(
        [error.message, error.details, error.hint, error.code]
          .filter(Boolean)
          .join(" — ") || "The profile could not be saved."
      );
      setMessageType("error");
      return;
    }

    if (!data) {
      setMessage("The database did not return the saved profile.");
      setMessageType("error");
      return;
    }

    setForm((current) => ({
      ...current,
      website: text(data.website),
      practiceAreas: areasText(data.specialties),
      years_experience: text(data.years_experience),
      team_size: text(data.team_size),
      consultation_fee: text(data.consultation_fee),
    }));
    setMessage("Profile saved successfully.");
    setMessageType("success");
  };

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const { url, error } = await uploadLogo(file, user.id);
    setUploading(false);
    event.target.value = "";

    if (error || !url) {
      setMessage(error?.message || "Logo upload failed.");
      setMessageType("error");
      return;
    }

    setField("logo_url", url);
    setMessage("Logo uploaded. Click Save Profile to keep it.");
    setMessageType("success");
  };

  const removeLogo = async () => {
    if (!form.logo_url) return;
    setUploading(true);
    const { error } = await deleteLogo(form.logo_url);
    setUploading(false);

    if (error) {
      setMessage(error.message || "Logo deletion failed.");
      setMessageType("error");
      return;
    }

    setField("logo_url", "");
    setMessage("Logo removed. Click Save Profile to keep the change.");
    setMessageType("success");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Edit Firm Profile</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-6">
          {message && (
            <div className={`rounded-md border p-3 text-sm ${messageType === "error" ? "border-red-300 bg-red-50 text-red-800" : "border-green-300 bg-green-50 text-green-800"}`}>
              {message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="firm-logo">Firm Logo</Label>
            <div className="flex items-center gap-4">
              {form.logo_url && (
                <div className="relative">
                  <img src={form.logo_url} alt="Firm logo" className="h-24 w-24 rounded-lg border object-cover" />
                  <button type="button" onClick={removeLogo} disabled={uploading} className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white" aria-label="Remove logo">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              <Input id="firm-logo" type="file" accept="image/*" onChange={upload} disabled={uploading} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Firm Name *" id="name" value={form.name} onChange={(v) => setField("name", v)} wide />
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setField("description", e.target.value)} rows={4} />
            </div>
            <Field label="Street Address" id="address" value={form.address} onChange={(v) => setField("address", v)} wide />
            <Field label="City" id="city" value={form.city} onChange={(v) => setField("city", v)} />
            <Field label="State" id="state" value={form.state} onChange={(v) => setField("state", v.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase())} />
            <Field label="ZIP Code" id="zip_code" value={form.zip_code} onChange={(v) => setField("zip_code", v.replace(/\D/g, "").slice(0, 5))} inputMode="numeric" />
            <Field label="Phone" id="phone" value={form.phone} onChange={(v) => setField("phone", v)} />
            <Field label="Email" id="email" value={form.email} onChange={(v) => setField("email", v)} type="email" />
            <Field label="Website" id="website" value={form.website} onChange={(v) => setField("website", v)} />
            <Field label="Practice Areas (comma separated)" id="practiceAreas" value={form.practiceAreas} onChange={(v) => setField("practiceAreas", v)} wide />
            <Field label="Years of Experience" id="years_experience" value={form.years_experience} onChange={(v) => setField("years_experience", integerInput(v))} inputMode="numeric" />
            <Field label="Team Size" id="team_size" value={form.team_size} onChange={(v) => setField("team_size", integerInput(v))} inputMode="numeric" />
            <Field label="Consultation Fee ($)" id="consultation_fee" value={form.consultation_fee} onChange={(v) => setField("consultation_fee", moneyInput(v))} inputMode="decimal" />
          </div>

          <button type="button" onClick={save} disabled={saving || uploading} className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  wide?: boolean;
};

const Field = ({ label, id, value, onChange, type = "text", inputMode, wide }: FieldProps) => (
  <div className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} inputMode={inputMode} value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);
