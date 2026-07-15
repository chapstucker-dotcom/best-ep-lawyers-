import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import {
  createFirm,
  getFirmByUserId,
  updateFirm,
} from "@/services/firmService";
import { deleteLogo, uploadLogo } from "@/services/storageService";
import { validateFirmProfile } from "@/utils/validation";

type ProfileForm = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  specialties: string[];
  years_experience: string;
  team_size: string;
  consultation_fee: string;
  logo_url: string;
};

const emptyProfile: ProfileForm = {
  name: "",
  description: "",
  address: "",
  city: "El Paso",
  state: "TX",
  zip_code: "",
  phone: "",
  email: "",
  website: "",
  specialties: [],
  years_experience: "",
  team_size: "",
  consultation_fee: "",
  logo_url: "",
};

const parsePracticeAreas = (data: any): string[] => {
  const specialties = Array.isArray(data?.specialties)
    ? data.specialties
        .map((item: unknown) => String(item).trim())
        .filter(Boolean)
    : typeof data?.specialties === "string"
      ? data.specialties
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

  if (specialties.length > 0) {
    return specialties;
  }

  const practiceAreas = Array.isArray(data?.practice_areas)
    ? data.practice_areas
        .map((item: unknown) => String(item).trim())
        .filter(Boolean)
    : typeof data?.practice_areas === "string"
      ? data.practice_areas
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

  return practiceAreas;
};
  if (Array.isArray(data?.specialties)) {
    return data.specialties
      .map((item: unknown) => String(item).trim())
      .filter(Boolean);
  }

  if (Array.isArray(data?.practice_areas)) {
    return data.practice_areas
      .map((item: unknown) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof data?.practice_areas === "string") {
    return data.practice_areas
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
  }

  if (typeof data?.specialties === "string") {
    return data.specialties
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await getFirmByUserId(user.id);

        if (error) {
          console.error("Profile load error:", error);

          toast({
            title: "Profile could not load",
            description:
              error.message || "There was a problem loading the firm profile.",
            variant: "destructive",
          });

          return;
        }

        if (data) {
          setFirmId(data.id);

          setProfile({
            name: data.name || "",
            description: data.description || "",
            address: data.address || "",
            city: data.city || "El Paso",
            state: data.state || "TX",
            zip_code: data.zip_code || data.zip || "",
            phone: data.phone || "",
            email: data.email || user.email || "",
            website: data.website || "",
            specialties: parsePracticeAreas(data),
            years_experience:
              data.years_experience === null ||
              data.years_experience === undefined
                ? ""
                : String(data.years_experience),
            team_size:
              data.team_size === null || data.team_size === undefined
                ? ""
                : String(data.team_size),
            consultation_fee:
              data.consultation_fee === null ||
              data.consultation_fee === undefined
                ? ""
                : String(data.consultation_fee),
            logo_url: data.logo_url || "",
          });
        } else {
          setProfile((current) => ({
            ...current,
            email: user.email || "",
          }));
        }
      } catch (error: unknown) {
        console.error("Unexpected profile load error:", error);

        const message =
          error instanceof Error
            ? error.message
            : "There was a problem loading the profile.";

        toast({
          title: "Profile could not load",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [toast, user]);

  const updateProfile = (
    field: keyof ProfileForm,
    value: string | string[]
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const normalizeWebsite = (website: string) => {
    const cleanedWebsite = website.trim();

    if (!cleanedWebsite) {
      return "";
    }

    if (
      cleanedWebsite.startsWith("http://") ||
      cleanedWebsite.startsWith("https://")
    ) {
      return cleanedWebsite;
    }

    return `https://${cleanedWebsite}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast({
        title: "Sign-in required",
        description: "Please sign in before saving your profile.",
        variant: "destructive",
      });

      return;
    }

    const firmProfile = {
      name: profile.name.trim(),
      description: profile.description.trim(),
      address: profile.address.trim(),
      city: profile.city.trim() || "El Paso",
      state: profile.state.trim().toUpperCase() || "TX",
      zip_code: profile.zip_code.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      website: normalizeWebsite(profile.website),

      // Save both column names so old and new parts of the site can use them.
      specialties: profile.specialties,
      practice_areas: profile.specialties,

      years_experience:
        profile.years_experience === ""
          ? 0
          : Number(profile.years_experience),

      team_size:
        profile.team_size === ""
          ? 0
          : Number(profile.team_size),

      consultation_fee:
        profile.consultation_fee === ""
          ? 0
          : Number(profile.consultation_fee),

      logo_url: profile.logo_url,
      user_id: user.id,
    };

    const errors = validateFirmProfile(firmProfile);

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0].message,
        variant: "destructive",
      });

      return;
    }

    setLoading(true);

    try {
      const result = firmId
        ? await updateFirm(firmId, firmProfile)
        : await createFirm(firmProfile);

      if (result.error) {
        toast({
          title: "Save failed",
          description:
            result.error.message || "The firm profile could not be saved.",
          variant: "destructive",
        });

        return;
      }

      if (!firmId && result.data?.id) {
        setFirmId(result.data.id);
      }

      setProfile((current) => ({
        ...current,
        city: firmProfile.city,
        state: firmProfile.state,
        website: firmProfile.website,
        specialties: firmProfile.specialties,
      }));

      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "The firm profile could not be saved.";

      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!user) {
      toast({
        title: "Sign-in required",
        description: "Please sign in before uploading a logo.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose an image smaller than 5 MB.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const { url, error } = await uploadLogo(file, user.id);

      if (error) {
        toast({
          title: "Upload failed",
          description: error.message || "The logo could not be uploaded.",
          variant: "destructive",
        });

        return;
      }

      if (!url) {
        toast({
          title: "Upload failed",
          description: "Supabase did not return a logo URL.",
          variant: "destructive",
        });

        return;
      }

      updateProfile("logo_url", url);

      toast({
        title: "Logo uploaded",
        description:
          "The logo was uploaded. Click Save Profile to save it to the firm.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "The logo could not be uploaded.";

      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteLogo = async () => {
    if (!profile.logo_url) {
      return;
    }

    setUploading(true);

    try {
      const { error } = await deleteLogo(profile.logo_url);

      if (error) {
        toast({
          title: "Delete failed",
          description: error.message || "The logo could not be deleted.",
          variant: "destructive",
        });

        return;
      }

      updateProfile("logo_url", "");

      toast({
        title: "Logo removed",
        description:
          "The logo was removed. Click Save Profile to save the change.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "The logo could not be deleted.";

      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive",
      });
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firm-logo">Firm Logo</Label>

            <div className="flex items-center gap-4">
              {profile.logo_url && (
                <div className="relative">
                  <img
                    src={profile.logo_url}
                    alt={`${profile.name || "Firm"} logo`}
                    className="h-24 w-24 rounded-lg border object-cover"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-7 w-7"
                    onClick={handleDeleteLogo}
                    disabled={uploading}
                    aria-label="Delete logo"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="flex-1">
                <Input
                  id="firm-logo"
                  name="firm-logo"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum 5 MB. JPG, PNG, WebP, or SVG.
                </p>

                {uploading && (
                  <div className="mt-2 flex items-center text-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading logo...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Firm Name *</Label>

              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={(event) =>
                  updateProfile("name", event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={(event) =>
                  updateProfile("description", event.target.value)
                }
                rows={4}
                placeholder="Tell potential clients about your firm..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Street Address</Label>

              <Input
                id="address"
                name="address"
                value={profile.address}
                onChange={(event) =>
                  updateProfile("address", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>

              <Input
                id="city"
                name="city"
                value={profile.city}
                onChange={(event) =>
                  updateProfile("city", event.target.value)
                }
                placeholder="El Paso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>

              <Input
                id="state"
                name="state"
                value={profile.state}
                maxLength={2}
                onChange={(event) =>
                  updateProfile(
                    "state",
                    event.target.value
                      .replace(/[^a-zA-Z]/g, "")
                      .toUpperCase()
                  )
                }
                placeholder="TX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>

              <Input
                id="zip_code"
                name="zip_code"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={profile.zip_code}
                onChange={(event) =>
                  updateProfile(
                    "zip_code",
                    event.target.value.replace(/\D/g, "").slice(0, 5)
                  )
                }
                placeholder="79901"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>

              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={(event) =>
                  updateProfile("phone", event.target.value)
                }
                placeholder="(915) 555-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={(event) =>
                  updateProfile("email", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>

              <Input
                id="website"
                name="website"
                type="text"
                value={profile.website}
                onChange={(event) =>
                  updateProfile("website", event.target.value)
                }
                placeholder="example.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialties">
                Practice Areas (comma separated)
              </Label>

              <Input
                id="specialties"
                name="specialties"
                value={profile.specialties.join(", ")}
                onChange={(event) =>
                  updateProfile(
                    "specialties",
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Personal Injury, Criminal Defense, Family Law"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">
                Years of Experience
              </Label>

              <Input
                id="years_experience"
                name="years_experience"
                type="number"
                min="0"
                step="1"
                value={profile.years_experience}
                onChange={(event) =>
                  updateProfile("years_experience", event.target.value)
                }
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_size">Team Size</Label>

              <Input
                id="team_size"
                name="team_size"
                type="number"
                min="0"
                step="1"
                value={profile.team_size}
                onChange={(event) =>
                  updateProfile("team_size", event.target.value)
                }
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation_fee">
                Consultation Fee ($)
              </Label>

              <Input
                id="consultation_fee"
                name="consultation_fee"
                type="number"
                min="0"
                step="0.01"
                value={profile.consultation_fee}
                onChange={(event) =>
                  updateProfile("consultation_fee", event.target.value)
                }
                placeholder="100"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || uploading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};