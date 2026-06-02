import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { createFirm, getFirmByUserId, updateFirm } from '@/services/firmService';
import { uploadLogo, deleteLogo } from '@/services/storageService';
import { validateFirmProfile } from '@/utils/validation';
import { Firm } from '@/data/types';

export const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    website: '',
    specialties: [] as string[],
    years_experience: 0,
    team_size: 0,
    consultation_fee: 0,
    logo_url: ''
  });

  // Load existing firm profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      const { data, error } = await getFirmByUserId(user.id);
      if (data && !error) {
        setFirmId(data.id);
        setProfile({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          specialties: data.specialties || [],
          years_experience: data.years_experience || 0,
          team_size: data.team_size || 0,
          consultation_fee: data.consultation_fee || 0,
          logo_url: data.logo_url || ''
        });
      }
    };
    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateFirmProfile(profile);
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors[0].message,
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let result;
      if (firmId) {
        // Update existing firm
        result = await updateFirm(firmId, profile);
      } else {
        // Create new firm
        result = await createFirm(profile);
        if (result.data) {
          setFirmId(result.data.id);
        }
      }

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Success',
          description: 'Profile saved successfully!'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const { url, error } = await uploadLogo(file, user.id);

    if (error) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive'
      });
    } else if (url) {
      setProfile({ ...profile, logo_url: url });
      toast({
        title: 'Success',
        description: 'Logo uploaded successfully!'
      });
    }

    setUploading(false);
  };

  const handleDeleteLogo = async () => {
    if (!profile.logo_url) return;

    setUploading(true);
    const { error } = await deleteLogo(profile.logo_url);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete logo',
        variant: 'destructive'
      });
    } else {
      setProfile({ ...profile, logo_url: '' });
      toast({
        title: 'Success',
        description: 'Logo deleted successfully'
      });
    }

    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Firm Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Firm Logo</Label>
            <div className="flex items-center gap-4">
              {profile.logo_url && (
                <div className="relative">
                  <img src={profile.logo_url} alt="Logo" className="h-24 w-24 object-cover rounded-lg border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={handleDeleteLogo}
                    disabled={uploading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground mt-1">Max 5MB. JPG, PNG, WebP, or SVG</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Firm Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({...profile, description: e.target.value})}
                rows={4}
                placeholder="Tell potential clients about your firm..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile({...profile, city: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={profile.state}
                onChange={(e) => setProfile({...profile, state: e.target.value})}
                placeholder="CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={profile.zip_code}
                onChange={(e) => setProfile({...profile, zip_code: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialties">Practice Areas (comma separated)</Label>
              <Input
                id="specialties"
                value={profile.specialties.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="Corporate Law, Real Estate, Family Law"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                value={profile.years_experience}
                onChange={(e) => setProfile({...profile, years_experience: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                type="number"
                min="0"
                value={profile.team_size}
                onChange={(e) => setProfile({...profile, team_size: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
              <Input
                id="consultation_fee"
                type="number"
                min="0"
                step="0.01"
                value={profile.consultation_fee}
                onChange={(e) => setProfile({...profile, consultation_fee: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || uploading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};


