import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Check,
  Loader2,
  LockKeyhole,
  Trash2,
  Video,
} from "lucide-react";

import {
  getFirmByUserId,
  saveFirmProfile,
} from "@/services/firmService";

import {
  deleteLogo,
  uploadLogo,
} from "@/services/storageService";

import { categories } from "@/data/categories";
import {
  getPlanRules,
  type PlanKey,
} from "@/config/planRules";

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
  video_url: string;
  office_hours: string;
  languages: string;
  awards: string;
  linkedin_url: string;
  facebook_url: string;
  instagram_url: string;
  google_maps_url: string;
  gallery_urls: string;
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
  practiceAreas: [],
  years_experience: "",
  team_size: "",
  consultation_fee: "",
  logo_url: "",
  video_url: "",
  office_hours: "",
  languages: "",
  awards: "",
  linkedin_url: "",
  facebook_url: "",
  instagram_url: "",
  google_maps_url: "",
  gallery_urls: "",
};

const text = (value: unknown): string =>
  value === null || value === undefined
    ? ""
    : String(value);

const integerInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  return digits
    ? digits.replace(/^0+(?=\d)/, "")
    : "";
};

const moneyInput = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");

  if (dot < 0) {
    return cleaned.replace(/^0+(?=\d)/, "");
  }

  const whole =
    cleaned
      .slice(0, dot)
      .replace(/^0+(?=\d)/, "") || "0";

  const decimals = cleaned
    .slice(dot + 1)
    .replace(/\./g, "")
    .slice(0, 2);

  return `${whole}.${decimals}`;
};

const websiteValue = (
  value: string
): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};

const optionalNumber = (
  value: string
): number | null => {
  if (!value.trim()) return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
};

const normalizePlanKey = (value: unknown): PlanKey => {
  const normalized = text(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (
    normalized === "category_exclusive" ||
    normalized === "exclusive"
  ) {
    return "category_exclusive";
  }

  if (
    normalized === "category_featured" ||
    normalized === "featured"
  ) {
    return "category_featured";
  }

  // Preserve older Pro records by treating them as Expert.
  if (
    normalized === "expert" ||
    normalized === "pro"
  ) {
    return "expert";
  }

  return "free";
};

const linesToArray = (value: string): string[] =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const arrayToLines = (value: unknown): string =>
  Array.isArray(value)
    ? value.map(String).filter(Boolean).join("\n")
    : "";

const optionalUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};

const videoValue = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};

/**
 * Converts existing stored values into official category slugs.
 *
 * This supports older records that may contain:
 * - category slugs
 * - category titles
 * - comma-separated strings
 */
const normalizePracticeAreas = (
  value: unknown
): string[] => {
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

  const normalized = storedValues.map(
    (storedValue) => {
      const matchingCategory = categories.find(
        (category) =>
          category.slug.toLowerCase() ===
            storedValue.toLowerCase() ||
          category.title.toLowerCase() ===
            storedValue.toLowerCase()
      );

      return matchingCategory?.slug || storedValue;
    }
  );

  return Array.from(new Set(normalized));
};

export const ProfileEditor = () => {
  const { user } = useAuth();

  const [form, setForm] =
    useState<FormState>(EMPTY);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error" | "">("");

  const [planKey, setPlanKey] =
    useState<PlanKey>("free");

  const planRules = getPlanRules(planKey);

  const hasVideoAccess =
    planRules.video;

  const practiceAreaLimit =
    planRules.practiceAreas;

  const setField = (
    field: keyof Omit<
      FormState,
      "practiceAreas"
    >,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } =
        await getFirmByUserId(user.id);

      if (!active) return;

      if (error) {
        setMessage(
          error.message ||
            "Could not load the profile."
        );
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (data) {
        setPlanKey(
          normalizePlanKey(
            data.plan_key ?? data.plan
          )
        );

        const storedPracticeAreas =
          data.specialties ??
          data.categories ??
          [];

        setForm({
          name: text(data.name),
          description: text(data.description),
          address: text(data.address),
          city: text(data.city) || "El Paso",
          state: text(data.state) || "TX",
          zip_code: text(data.zip_code),
          phone: text(data.phone),
          email:
            text(data.email) ||
            user.email ||
            "",
          website: text(data.website),
          practiceAreas:
            normalizePracticeAreas(
              storedPracticeAreas
            ),
          years_experience: text(
            data.years_experience
          ),
          team_size: text(data.team_size),
          consultation_fee: text(
            data.consultation_fee
          ),
          logo_url: text(data.logo_url),
          video_url: text(data.video_url),
          office_hours: text(data.office_hours),
          languages: arrayToLines(data.languages),
          awards: arrayToLines(data.awards),
          linkedin_url: text(data.linkedin_url),
          facebook_url: text(data.facebook_url),
          instagram_url: text(data.instagram_url),
          google_maps_url: text(data.google_maps_url),
          gallery_urls: arrayToLines(data.gallery_urls),
        });
      } else {
        setForm({
          ...EMPTY,
          email: user.email || "",
        });
      }

      setLoading(false);
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  const togglePracticeArea = (
    categorySlug: string
  ) => {
    setMessage("");
    setMessageType("");

    setForm((current) => {
      const alreadySelected =
        current.practiceAreas.includes(
          categorySlug
        );

      if (alreadySelected) {
        return {
          ...current,
          practiceAreas:
            current.practiceAreas.filter(
              (slug) =>
                slug !== categorySlug
            ),
        };
      }

      if (
        current.practiceAreas.length >=
        practiceAreaLimit
      ) {
        setMessage(
          `${planRules.displayName} allows up to ${practiceAreaLimit} practice area${
            practiceAreaLimit === 1 ? "" : "s"
          }. Upgrade your plan to add more.`
        );
        setMessageType("error");
        return current;
      }

      return {
        ...current,
        practiceAreas: [
          ...current.practiceAreas,
          categorySlug,
        ],
      };
    });
  };

  const selectedCategoryTitles =
    useMemo(() => {
      return form.practiceAreas.map(
        (selectedValue) => {
          const category = categories.find(
            (item) =>
              item.slug === selectedValue
          );

          return {
            value: selectedValue,
            title:
              category?.title ||
              selectedValue,
          };
        }
      );
    }, [form.practiceAreas]);

  const save = async () => {
    setMessage("");
    setMessageType("");

    if (!user) {
      setMessage(
        "You must be signed in before saving."
      );
      setMessageType("error");
      return;
    }

    if (form.name.trim().length < 3) {
      setMessage(
        "Firm name must be at least 3 characters."
      );
      setMessageType("error");
      return;
    }

    if (form.practiceAreas.length === 0) {
      setMessage(
        "Select at least one practice area."
      );
      setMessageType("error");
      return;
    }

    if (
      form.practiceAreas.length >
      practiceAreaLimit
    ) {
      setMessage(
        `${planRules.displayName} allows up to ${practiceAreaLimit} practice area${
          practiceAreaLimit === 1 ? "" : "s"
        }. Remove extra selections before saving.`
      );
      setMessageType("error");
      return;
    }

    if (
      hasVideoAccess &&
      form.video_url.trim() &&
      !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i.test(
        form.video_url.trim()
      )
    ) {
      setMessage(
        "Enter a valid YouTube or Vimeo video URL."
      );
      setMessageType("error");
      return;
    }

    setSaving(true);

    const { data, error } =
      await saveFirmProfile(user.id, {
        name: form.name.trim(),
        description:
          form.description.trim() || null,
        address:
          form.address.trim() || null,
        city:
          form.city.trim() || "El Paso",
        state:
          form.state
            .trim()
            .toUpperCase() || "TX",
        zip_code:
          form.zip_code.trim() || null,
        phone:
          form.phone.trim() || null,
        email:
          form.email.trim() || null,
        website: websiteValue(
          form.website
        ),

        // The database already expects this array.
        specialties:
          form.practiceAreas.slice(
            0,
            practiceAreaLimit
          ),

        years_experience:
          optionalNumber(
            form.years_experience
          ),
        team_size: optionalNumber(
          form.team_size
        ),
        consultation_fee:
          optionalNumber(
            form.consultation_fee
          ),
        logo_url:
          form.logo_url || null,

        // Video is a premium benefit. The plan itself is
        // controlled by billing/admin logic, not by this form.
        video_url: hasVideoAccess
          ? videoValue(form.video_url)
          : null,

        office_hours:
          form.office_hours.trim() || null,
        languages:
          linesToArray(form.languages),
        awards:
          linesToArray(form.awards),
        linkedin_url:
          optionalUrl(form.linkedin_url),
        facebook_url:
          optionalUrl(form.facebook_url),
        instagram_url:
          optionalUrl(form.instagram_url),
        google_maps_url:
          optionalUrl(form.google_maps_url),
        gallery_urls:
          linesToArray(form.gallery_urls).map(
            (url) => optionalUrl(url)
          ).filter(Boolean),
      });

    setSaving(false);

    if (error) {
      setMessage(
        [
          error.message,
          error.details,
          error.hint,
          error.code,
        ]
          .filter(Boolean)
          .join(" — ") ||
          "The profile could not be saved."
      );

      setMessageType("error");
      return;
    }

    if (!data) {
      setMessage(
        "The database did not return the saved profile."
      );
      setMessageType("error");
      return;
    }

    setForm((current) => ({
      ...current,
      website: text(data.website),
      practiceAreas:
        normalizePracticeAreas(
          data.specialties ??
            current.practiceAreas
        ),
      years_experience: text(
        data.years_experience
      ),
      team_size: text(data.team_size),
      consultation_fee: text(
        data.consultation_fee
      ),
      video_url: text(data.video_url),
    }));

    setMessage(
      "Profile saved successfully."
    );
    setMessageType("success");
  };

  const upload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file || !user) return;

    setUploading(true);

    const { url, error } =
      await uploadLogo(file, user.id);

    setUploading(false);
    event.target.value = "";

    if (error || !url) {
      setMessage(
        error?.message ||
          "Logo upload failed."
      );
      setMessageType("error");
      return;
    }

    setField("logo_url", url);

    setMessage(
      "Logo uploaded. Click Save Profile to keep it."
    );
    setMessageType("success");
  };

  const removeLogo = async () => {
    if (!form.logo_url) return;

    setUploading(true);

    const { error } =
      await deleteLogo(form.logo_url);

    setUploading(false);

    if (error) {
      setMessage(
        error.message ||
          "Logo deletion failed."
      );
      setMessageType("error");
      return;
    }

    setField("logo_url", "");

    setMessage(
      "Logo removed. Click Save Profile to keep the change."
    );
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
        <CardTitle>
          Edit Firm Profile
        </CardTitle>
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

          {/* Firm logo */}
          <section className="space-y-3">
            <Label htmlFor="firm-logo">
              Firm Logo
            </Label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {form.logo_url ? (
                <div className="relative w-fit">
                  <img
                    src={form.logo_url}
                    alt="Firm logo"
                    className="h-28 w-28 rounded-xl border bg-white object-cover shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={removeLogo}
                    disabled={uploading}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1.5 text-white shadow"
                    aria-label="Remove logo"
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
                  onChange={upload}
                  disabled={uploading}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Upload a PNG, JPG, or WebP
                  logo.
                </p>
              </div>
            </div>
          </section>

          {/* Main firm fields */}
          <section className="grid gap-5 md:grid-cols-2">
            <Field
              label="Firm Name *"
              id="name"
              value={form.name}
              onChange={(value) =>
                setField("name", value)
              }
              wide
            />

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">
                About Your Firm
              </Label>

              <Textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setField(
                    "description",
                    event.target.value
                  )
                }
                rows={6}
                placeholder="Describe your firm, experience, clients served, and approach to representation."
              />
            </div>

            <Field
              label="Street Address"
              id="address"
              value={form.address}
              onChange={(value) =>
                setField("address", value)
              }
              wide
            />

            <Field
              label="City"
              id="city"
              value={form.city}
              onChange={(value) =>
                setField("city", value)
              }
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
                  value
                    .replace(/\D/g, "")
                    .slice(0, 5)
                )
              }
              inputMode="numeric"
            />

            <Field
              label="Phone"
              id="phone"
              value={form.phone}
              onChange={(value) =>
                setField("phone", value)
              }
            />

            <Field
              label="Email"
              id="email"
              value={form.email}
              onChange={(value) =>
                setField("email", value)
              }
              type="email"
            />

            <Field
              label="Website"
              id="website"
              value={form.website}
              onChange={(value) =>
                setField("website", value)
              }
              wide
            />
          </section>

          {/* Current plan limits */}
          <section className="rounded-xl border border-[#0F2A43]/10 bg-[#0F2A43] p-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                  Current Subscription
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {planRules.displayName}
                </h3>

                <p className="mt-2 text-sm text-white/75">
                  Up to {planRules.practiceAreas} practice area{planRules.practiceAreas === 1 ? "" : "s"} ·
                  {" "}{planRules.attorneyLimit} attorney profile{planRules.attorneyLimit === 1 ? "" : "s"} ·
                  {" "}{planRules.video ? "Video enabled" : "Video locked"}
                </p>
              </div>

              <Badge className="w-fit bg-white text-[#0F2A43] hover:bg-white">
                Plan rules active
              </Badge>
            </div>
          </section>

          {/* Practice areas */}
          <section className="rounded-xl border bg-gray-50 p-5">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Practice Areas *
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Select up to {practiceAreaLimit} practice area{practiceAreaLimit === 1 ? "" : "s"} with your {planRules.displayName} plan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const isSelected =
                  form.practiceAreas.includes(
                    category.slug
                  );

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      togglePracticeArea(
                        category.slug
                      )
                    }
                    disabled={
                      !isSelected &&
                      form.practiceAreas.length >=
                        practiceAreaLimit
                    }
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? "border-[#1FA8A1] bg-[#1FA8A1]/10 text-[#0F2A43]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#1FA8A1]/60"
                    }`}
                  >
                    <span>
                      {category.title}
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
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

            {selectedCategoryTitles.length >
              0 && (
              <div className="mt-5 border-t pt-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Selected practice areas:
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedCategoryTitles.map(
                    (practiceArea) => (
                      <Badge
                        key={
                          practiceArea.value
                        }
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        {practiceArea.title}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Premium introduction video */}
          <section className="rounded-xl border bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#06224A] text-[#D4A62A]">
                  <Video className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Firm Introduction Video
                    </h3>

                    <Badge
                      variant={
                        hasVideoAccess
                          ? "default"
                          : "secondary"
                      }
                    >
                      {planRules.displayName}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Embed a YouTube or Vimeo introduction video
                    on your public firm profile.
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Current plan: {planRules.displayName} ·
                    {planRules.video
                      ? " Video enabled"
                      : " Video locked"}
                  </p>
                </div>
              </div>

              {!hasVideoAccess && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                  <LockKeyhole className="h-4 w-4" />
                  Category Featured or Exclusive required
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor="video_url">
                YouTube or Vimeo URL
              </Label>

              <Input
                id="video_url"
                type="url"
                value={form.video_url}
                onChange={(event) =>
                  setField(
                    "video_url",
                    event.target.value
                  )
                }
                disabled={!hasVideoAccess}
                placeholder="https://www.youtube.com/watch?v=..."
              />

              <p className="text-xs leading-5 text-gray-500">
                Category Featured and Category Exclusive firms
                may display one introduction video. Video files
                remain hosted by YouTube or Vimeo so profiles stay
                fast.
              </p>
            </div>
          </section>

          {/* Expanded public profile details */}
          <section className="rounded-xl border bg-white p-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Public Profile Details
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Add office information, languages, recognitions,
                social links, map details, and gallery images.
              </p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="office_hours">Office Hours</Label>
                <Textarea
                  id="office_hours"
                  value={form.office_hours}
                  onChange={(event) =>
                    setField("office_hours", event.target.value)
                  }
                  rows={5}
                  placeholder={"Monday-Friday: 8:30 AM-5:30 PM\nSaturday: By appointment"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Textarea
                  id="languages"
                  value={form.languages}
                  onChange={(event) =>
                    setField("languages", event.target.value)
                  }
                  rows={5}
                  placeholder={"English\nSpanish"}
                />
                <p className="text-xs text-gray-500">
                  Enter one language per line.
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="awards">
                  Awards, Memberships & Recognitions
                </Label>
                <Textarea
                  id="awards"
                  value={form.awards}
                  onChange={(event) =>
                    setField("awards", event.target.value)
                  }
                  rows={5}
                  placeholder={"Texas Bar College\nEl Paso Bar Association\nSuper Lawyers selection"}
                />
                <p className="text-xs text-gray-500">
                  Enter one item per line.
                </p>
              </div>

              <Field
                label="Google Maps URL"
                id="google_maps_url"
                value={form.google_maps_url}
                onChange={(value) =>
                  setField("google_maps_url", value)
                }
                type="url"
              />

              <Field
                label="LinkedIn URL"
                id="linkedin_url"
                value={form.linkedin_url}
                onChange={(value) =>
                  setField("linkedin_url", value)
                }
                type="url"
              />

              <Field
                label="Facebook URL"
                id="facebook_url"
                value={form.facebook_url}
                onChange={(value) =>
                  setField("facebook_url", value)
                }
                type="url"
              />

              <Field
                label="Instagram URL"
                id="instagram_url"
                value={form.instagram_url}
                onChange={(value) =>
                  setField("instagram_url", value)
                }
                type="url"
              />

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="gallery_urls">
                  Firm Gallery Image URLs
                </Label>
                <Textarea
                  id="gallery_urls"
                  value={form.gallery_urls}
                  onChange={(event) =>
                    setField("gallery_urls", event.target.value)
                  }
                  rows={5}
                  placeholder={"https://example.com/office-1.jpg\nhttps://example.com/team.jpg"}
                />
                <p className="text-xs text-gray-500">
                  Enter one publicly accessible image URL per line.
                </p>
              </div>
            </div>
          </section>

          {/* Firm statistics */}
          <section className="grid gap-5 md:grid-cols-3">
            <Field
              label="Years of Experience"
              id="years_experience"
              value={
                form.years_experience
              }
              onChange={(value) =>
                setField(
                  "years_experience",
                  integerInput(value)
                )
              }
              inputMode="numeric"
            />

            <Field
              label="Team Size"
              id="team_size"
              value={form.team_size}
              onChange={(value) =>
                setField(
                  "team_size",
                  integerInput(value)
                )
              }
              inputMode="numeric"
            />

            <Field
              label="Consultation Fee ($)"
              id="consultation_fee"
              value={
                form.consultation_fee
              }
              onChange={(value) =>
                setField(
                  "consultation_fee",
                  moneyInput(value)
                )
              }
              inputMode="decimal"
            />
          </section>

          <Button
            type="button"
            onClick={save}
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
  <div
    className={`space-y-2 ${
      wide ? "md:col-span-2" : ""
    }`}
  >
    <Label htmlFor={id}>{label}</Label>

    <Input
      id={id}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    />
  </div>
);