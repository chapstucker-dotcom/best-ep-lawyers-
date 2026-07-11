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
import { Trash2, Loader2 } from "lucide-react";
import {
  createFirm,
  getFirmByUserId,
  updateFirm,
} from "@/services/firmService";
import { uploadLogo, deleteLogo } from "@/services/storageService";
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
            specialties: Array.isArray(data.specialties)
              ? data.specialties
              : [],
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
      } catch (error) {
        console.error("Unexpected profile load error:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

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
    const cleanWebsite = website.trim();

    if (!cleanWebsite) {
      return "";
    }

    if (
      cleanWebsite.startsWith("http://") ||
      cleanWebsite.startsWith("https://")
    ) {
      return cleanWebsite;
    }

    return `https://${cleanWebsite}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      specialties: profile.specialties,
      years_experience:
        profile.years_experience === ""
          ? 0
          : Number(profile.years_experience),
      team_size:
        profile.team_size === "" ? 0 : Number(profile.team_size),
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
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      if (!firmId && result.data?.id) {
        setFirmId(result.data.id);
      }

      setProfile((current) => ({
        ...current,
        website: firmProfile.website,
        city: firmProfile.city,
        state: firmProfile.state,
      }));

      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save profile.";

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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !user) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose an image smaller than 5 MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { url, error } = await uploadLogo(file, user.id);

      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (url) {
        updateProfile("logo_url", url);

        toast({
          title: "Success",
          description: "Logo uploaded successfully!",
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Logo upload failed.";

      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
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
          description: error.message || "Failed to delete the logo.",
          variant: "destructive",
        });
        return;
      }

      updateProfile("logo_url", "");

      toast({
        title: "Success",
        description: "Logo deleted successfully.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete logo.";

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
            <Label>Firm Logo</Label>

            <div className="flex items-center gap-4">
              {profile.logo_url && (
                <div className="relative">
                  <img
                    src={profile.logo_url}
                    alt="Firm logo"
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
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum 5 MB. JPG, PNG, WebP, or SVG.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Firm Name *</Label>

              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) =>
                  updateProfile("description", e.target.value)
                }
                rows={4}
                placeholder="Tell potential clients about your firm..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Street Address</Label>

              <Input
                id="address"
                value={profile.address}
                onChange={(e) => updateProfile("address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>

              <Input
                id="city"
                value={profile.city}
                onChange={(e) => updateProfile("city", e.target.value)}
                placeholder="El Paso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>

              <Input
                id="state"
                value={profile.state}
                maxLength={2}
                onChange={(e) =>
                  updateProfile(
                    "state",
                    e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase()
                  )
                }
                placeholder="TX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>

              <Input
                id="zip_code"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={profile.zip_code}
                onChange={(e) =>
                  updateProfile(
                    "zip_code",
                    e.target.value.replace(/\D/g, "").slice(0, 5)
                  )
                }
                placeholder="79901"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>

              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                placeholder="(915) 555-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>

              <Input
                id="website"
                type="text"
                value={profile.website}
                onChange={(e) => updateProfile("website", e.target.value)}
                placeholder="example.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialties">
                Practice Areas (comma separated)
              </Label>

              <Input
                id="specialties"
                value={profile.specialties.join(", ")}
                onChange={(e) =>
                  updateProfile(
                    "specialties",
                    e.target.value
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
                type="number"
                min="0"
                step="1"
                value={profile.years_experience}
                onChange={(e) =>
                  updateProfile("years_experience", e.target.value)
                }
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_size">Team Size</Label>

              <Input
                id="team_size"
                type="number"
                min="0"
                step="1"
                value={profile.team_size}
                onChange={(e) =>
                  updateProfile("team_size", e.target.value)
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
                type="number"
                min="0"
                step="0.01"
                value={profile.consultation_fee}
                onChange={(e) =>
                  updateProfile("consultation_fee", e.target.value)
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