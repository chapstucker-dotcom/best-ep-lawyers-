import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { createFirm, getFirmByUserId, updateFirm } from "@/services/firmService";
import { deleteLogo, uploadLogo } from "@/services/storageService";
import { validateFirmProfile } from "@/utils/validation";

interface ProfileFormState {
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
}

const EMPTY_PROFILE: ProfileFormState = {
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

const asText = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

const readPracticeAreas = (firm: Record<string, unknown>): string => {
  const candidates = [firm.specialties, firm.practice_areas];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const values = candidate.map(String).map((value) => value.trim()).filter(Boolean);
      if (values.length > 0) return values.join(", ");
    }

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .join(", ");
    }
  }

  return "";
};

const normalizeIntegerInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/^0+(?=\d)/, "");
};

const normalizeMoneyInput = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [rawWhole = "", ...decimalParts] = cleaned.split(".");
  const whole = rawWhole.replace(/^0+(?=\d)/, "");

  if (decimalParts.length === 0) return whole;

  const decimals = decimalParts.join("").slice(0, 2);
  return `${whole || "0"}.${decimals}`;
};

const normalizeWebsite = (value: string): string => {
  const website = value.trim();
  if (!website) return "";
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
};

const toNonNegativeNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileFormState>(EMPTY_PROFILE);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);

      try {
        const { data, error } = await getFirmByUserId(user.id);
        if (error) throw error;
        if (cancelled) return;

        if (!data) {
          setProfile({ ...EMPTY_PROFILE, email: user.email ?? "" });
          setFirmId(null);
          return;
        }

        const firm = data as unknown as Record<string, unknown>;
        setFirmId(data.id);
        setProfile({
          name: asText(firm.name),
          description: asText(firm.description),
          address: asText(firm.address),
          city: asText(firm.city) || "El Paso",
          state: asText(firm.state) || "TX",
          zip_code: asText(firm.zip_code),
          phone: asText(firm.phone),
          email: asText(firm.email) || user.email || "",
          website: asText(firm.website),
          practiceAreas: readPracticeAreas(firm),
          years_experience: asText(firm.years_experience),
          team_size: asText(firm.team_size),
          consultation_fee: asText(firm.consultation_fee),
          logo_url: asText(firm.logo_url),
        });
      } catch (error: unknown) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Unable to load the firm profile.";
        console.error("Profile load error:", error);
        toast({ title: "Profile load failed", description: message, variant: "destructive" });
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [toast, user]);

  const setField = (field: keyof ProfileFormState, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast({ title: "Sign-in required", description: "Please sign in before saving.", variant: "destructive" });
      return;
    }

    const specialties = profile.practiceAreas
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = {
      user_id: user.id,
      name: profile.name.trim(),
      description: profile.description.trim() || null,
      address: profile.address.trim() || null,
      city: profile.city.trim() || "El Paso",
      state: profile.state.trim().toUpperCase() || "TX",
      zip_code: profile.zip_code.trim() || null,
      phone: profile.phone.trim() || null,
      email: profile.email.trim() || null,
      website: normalizeWebsite(profile.website) || null,
      specialties,
      years_experience: toNonNegativeNumber(profile.years_experience),
      team_size: toNonNegativeNumber(profile.team_size),
      consultation_fee: toNonNegativeNumber(profile.consultation_fee),
      logo_url: profile.logo_url || null,
    };

    const validationErrors = validateFirmProfile(payload);
    if (validationErrors.length > 0) {
      toast({ title: "Check this field", description: validationErrors[0].message, variant: "destructive" });
      return;
    }

    setSaving(true);

    try {
      const result = firmId
        ? await updateFirm(firmId, payload)
        : await createFirm(payload);

      if (result.error) throw result.error;
      if (!result.data) throw new Error("The database did not return the saved firm profile.");

      setFirmId(result.data.id);
      setProfile((current) => ({
        ...current,
        website: asText(result.data?.website),
        practiceAreas: Array.isArray(result.data?.specialties)
          ? result.data.specialties.join(", ")
          : current.practiceAreas,
        years_experience: asText(result.data?.years_experience),
        team_size: asText(result.data?.team_size),
        consultation_fee: asText(result.data?.consultation_fee),
      }));

      toast({ title: "Profile saved", description: "Your firm profile has been saved." });
    } catch (error: unknown) {
      const details = error as { message?: string; details?: string; hint?: string };
      const message = [details?.message, details?.details, details?.hint].filter(Boolean).join(" — ") || "Unable to save the profile.";
      console.error("Profile save error:", error);
      toast({ title: "Save failed", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const { url, error } = await uploadLogo(file, user.id);
      if (error) throw error;
      if (!url) throw new Error("No logo URL was returned.");

      setField("logo_url", url);
      toast({ title: "Logo uploaded", description: "Click Save Profile to keep this logo." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to upload the logo.";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteLogo = async () => {
    if (!profile.logo_url) return;

    setUploading(true);
    try {
      const { error } = await deleteLogo(profile.logo_url);
      if (error) throw error;
      setField("logo_url", "");
      toast({ title: "Logo removed", description: "Click Save Profile to keep this change." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to remove the logo.";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loadingProfile) {
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
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="firm-logo">Firm Logo</Label>
            <div className="flex items-center gap-4">
              {profile.logo_url && (
                <div className="relative">
                  <img src={profile.logo_url} alt="Firm logo" className="h-24 w-24 rounded-lg border object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute -right-2 -top-2 h-7 w-7" onClick={handleDeleteLogo} disabled={uploading} aria-label="Remove logo">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input id="firm-logo" type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/*" onChange={handleFileUpload} disabled={uploading} />
                <p className="mt-1 text-xs text-muted-foreground">Maximum 5 MB. JPG, PNG, WebP, or SVG.</p>
                {uploading && <p className="mt-1 text-sm">Uploading…</p>}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Firm Name *</Label>
              <Input id="name" value={profile.name} onChange={(event) => setField("name", event.target.value)} required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={profile.description} onChange={(event) => setField("description", event.target.value)} rows={4} placeholder="Tell potential clients about your firm…" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" value={profile.address} onChange={(event) => setField("address", event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={profile.city} onChange={(event) => setField("city", event.target.value)} placeholder="El Paso" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={profile.state} maxLength={2} onChange={(event) => setField("state", event.target.value.replace(/[^a-z]/gi, "").toUpperCase())} placeholder="TX" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input id="zip_code" type="text" inputMode="numeric" value={profile.zip_code} onChange={(event) => setField("zip_code", event.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="79901" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={profile.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="(915) 555-1234" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(event) => setField("email", event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="text" value={profile.website} onChange={(event) => setField("website", event.target.value)} placeholder="example.com" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="practiceAreas">Practice Areas (comma separated)</Label>
              <Input id="practiceAreas" type="text" value={profile.practiceAreas} onChange={(event) => setField("practiceAreas", event.target.value)} placeholder="Personal Injury, Criminal Defense, Family Law" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input id="years_experience" type="text" inputMode="numeric" value={profile.years_experience} onChange={(event) => setField("years_experience", normalizeIntegerInput(event.target.value))} placeholder="10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_size">Team Size</Label>
              <Input id="team_size" type="text" inputMode="numeric" value={profile.team_size} onChange={(event) => setField("team_size", normalizeIntegerInput(event.target.value))} placeholder="5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
              <Input id="consultation_fee" type="text" inputMode="decimal" value={profile.consultation_fee} onChange={(event) => setField("consultation_fee", normalizeMoneyInput(event.target.value))} placeholder="100.00" />
            </div>
          </div>

          <Button type="submit" disabled={saving || uploading} className="w-full">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
