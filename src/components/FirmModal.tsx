import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Check, Loader2, Trash2 } from "lucide-react";

import {
  getFirmByUserId,
  saveFirmProfile,
} from "@/services/firmService";
import {
  deleteLogo,
  uploadLogo,
} from "@/services/storageService";
import { categories } from "@/data/categories";

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
  practiceAreas: string[];
  years_experience: string;
  team_size: string;
  consultation_fee: string;
  logo_url: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  address: "",
  city: "El Paso",
  state: "TX",
  zip_code: "",
  phone: "",
  email: "",
  website: "",
  practiceAreas: [],
  years_experience: "",
  team_size: "",
  consultation_fee: "",
  logo_url: "",
};

const toText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const normalizePracticeAreas = (value: unknown): string[] => {
  let storedValues: string[] = [];

  if (Array.isArray(value)) {
    storedValues = value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  } else if (typeof value === "string") {
    storedValues = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const normalized = storedValues.map((storedValue) => {
    const match = categories.find(
      (category) =>
        category.slug.toLowerCase() === storedValue.toLowerCase() ||
        category.title.toLowerCase() === storedValue.toLowerCase()
    );

    return match?.slug || storedValue;
  });

  return Array.from(new Set(normalized));
};

const cleanInteger = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return digits ? digits.replace(/^0+(?=\d)/, "") : "";
};

const cleanMoney = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const decimalPosition = cleaned.indexOf(".");

  if (decimalPosition < 0) {
    return cleaned.replace(/^0+(?=\d)/, "");
  }

  const wholeNumber =
    cleaned
      .slice(0, decimalPosition)
      .replace(/^0+(?=\d)/, "") || "0";

  const decimals = cleaned
    .slice(decimalPosition + 1)
    .replace(/\./g, "")
    .slice(0, 2);

  return `${wholeNumber}.${decimals}`;
};

const normalizeWebsite = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};

const optionalNumber = (value: string): number | null => {
  if (!value.trim()) return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
};

export const ProfileEditor = () => {
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const setField = (
    field: Exclude<keyof FormState, "practiceAreas">,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    let isActive = true;

    const loadFirmProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await getFirmByUserId(user.id);

      if (!isActive) return;

      if (error) {
        setMessage(error.message || "Could not load the firm profile.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (data) {
        setForm({
          name: toText(data.name),
          description: toText(data.description),
          address: toText(data.address),
          city: toText(data.city) || "El Paso",
          state: toText(data.state) || "TX",
          zip_code: toText(data.zip_code),
          phone: toText(data.phone),
          email: toText(data.email) || user.email || "",
          website: toText(data.website),
          practiceAreas: normalizePracticeAreas(data.specialties),
          years_experience: toText(data.years_experience),
          team_size: toText(data.team_size),
          consultation_fee: toText(data.consultation_fee),
          logo_url: toText(data.logo_url),
        });
      } else {
        setForm({
          ...EMPTY_FORM,
          email: user.email || "",
        });
      }

      setLoading(false);
    };

    void loadFirmProfile();

    return () => {
      isActive = false;
    };
  }, [user]);

  const togglePracticeArea = (slug: string) => {
    setForm((current) => {
      const isSelected = current.practiceAreas.includes(slug);

      return {
        ...current,
        practiceAreas: isSelected
          ? current.practiceAreas.filter((item) => item !== slug)
          : [...current.practiceAreas, slug],
      };
    });
  };

  const selectedPracticeAreas = useMemo(() => {
    return form.practiceAreas.map((slug) => {
      const category = categories.find((item) => item.slug === slug);

      return {
        slug,
        title: category?.title || slug,
      };
    });
  }, [form.practiceAreas]);

  const saveProfile = async () => {
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

    if (form.practiceAreas.length === 0) {
      setMessage("Select at least one practice area.");
      setMessageType("error");
      return;
    }

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
      website: normalizeWebsite(form.website),

      // Public profile and search should use this array.
      specialties: form.practiceAreas,

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
      name: toText(data.name) || current.name,
      description: toText(data.description),
      address: toText(data.address),
      city: toText(data.city) || "El Paso",
      state: toText(data.state) || "TX",
      zip_code: toText(data.zip_code),
      phone: toText(data.phone),
      email: toText(data.email),
      website: toText(data.website),
      practiceAreas: normalizePracticeAreas(data.specialties),
      years_experience: toText(data.years_experience),
      team_size: toText(data.team_size),
      consultation_fee: toText(data.consultation_fee),
      logo_url: toText(data.logo_url),
    }));

    setMessage("Profile saved successfully.");
    setMessageType("success");
  };

  const uploadFirmLogo = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const removeFirmLogo = async () => {
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
      <CardHeader>
        <CardTitle>Edit Firm Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {message && (
            <div
              className={`rounded-md border p-3 text-sm ${
                messageType === "error"
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-green-300 bg-green-50 text-green-800"
              }`}
            >
              {message}
            </div>
          )}

          <section className="space-y-3">
            <Label htmlFor="firm-logo">Firm Logo</Label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {form.logo_url ? (
                <div className="relative w-fit">
                  <img
                    src={form.logo_url}
                    alt="Firm logo preview"
                    className="h-28 w-28 rounded-xl border bg-white object-cover shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={removeFirmLogo}
                    disabled={uploading}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1.5 text-white shadow"
                    aria-label="Remove firm logo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed bg-gray-50 text-center text-xs text-gray-500">
                  No logo
                  <br />
                  uploaded
                </div>
              )}

              <div className="flex-1">
                <Input
                  id="firm-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadFirmLogo}
                  disabled={uploading}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Upload a PNG, JPG, or WebP logo.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <Field
              label="Firm Name *"
              id="name"
              value={form.name}
              onChange={(value) => setField("name", value)}
              wide
            />

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">About Your Firm</Label>

              <Textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                rows={6}
                placeholder="Describe your firm, experience, clients served, and approach to representation."
              />
            </div>

            <Field
              label="Street Address"
              id="address"
              value={form.address}
              onChange={(value) => setField("address", value)}
              wide
            />

            <Field
              label="City"
              id="city"
              value={form.city}
              onChange={(value) => setField("city", value)}
            />

            <Field
              label="State"
              id="state"
              value={form.state}
              onChange={(value) =>
                setField(
                  "state",
                  value
                    .replace(/[^a-z]/gi, "")
                    .slice(0, 2)
                    .toUpperCase()
                )
              }
            />

            <Field
              label="ZIP Code"
              id="zip_code"
              value={form.zip_code}
              onChange={(value) =>
                setField(
                  "zip_code",
                  value.replace(/\D/g, "").slice(0, 5)
                )
              }
              inputMode="numeric"
            />

            <Field
              label="Phone"
              id="phone"
              value={form.phone}
              onChange={(value) => setField("phone", value)}
            />

            <Field
              label="Email"
              id="email"
              value={form.email}
              onChange={(value) => setField("email", value)}
              type="email"
            />

            <Field
              label="Website"
              id="website"
              value={form.website}
              onChange={(value) => setField("website", value)}
              wide
            />
          </section>

          <section className="rounded-xl border bg-gray-50 p-5">
            <h3 className="text-lg font-bold text-gray-900">
              Practice Areas *
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Select every practice area offered by your firm.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const isSelected = form.practiceAreas.includes(
                  category.slug
                );

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      togglePracticeArea(category.slug)
                    }
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                      isSelected
                        ? "border-[#1FA8A1] bg-[#1FA8A1]/10 text-[#0F2A43]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#1FA8A1]/60"
                    }`}
                  >
                    <span>{category.title}</span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        isSelected
                          ? "border-[#1FA8A1] bg-[#1FA8A1] text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedPracticeAreas.length > 0 && (
              <div className="mt-5 border-t pt-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Selected practice areas:
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedPracticeAreas.map((practiceArea) => (
                    <Badge
                      key={practiceArea.slug}
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {practiceArea.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <Field
              label="Years of Experience"
              id="years_experience"
              value={form.years_experience}
              onChange={(value) =>
                setField("years_experience", cleanInteger(value))
              }
              inputMode="numeric"
            />

            <Field
              label="Team Size"
              id="team_size"
              value={form.team_size}
              onChange={(value) =>
                setField("team_size", cleanInteger(value))
              }
              inputMode="numeric"
            />

            <Field
              label="Consultation Fee ($)"
              id="consultation_fee"
              value={form.consultation_fee}
              onChange={(value) =>
                setField("consultation_fee", cleanMoney(value))
              }
              inputMode="decimal"
            />
          </section>

          <Button
            type="button"
            onClick={saveProfile}
            disabled={saving || uploading}
            className="h-12 w-full bg-[#1FA8A1] text-base font-semibold hover:bg-[#178D87]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Profile...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
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

const Field = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  inputMode,
  wide,
}: FieldProps) => (
  <div className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}>
    <Label htmlFor={id}>{label}</Label>

    <Input
      id={id}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);export default FirmModal;