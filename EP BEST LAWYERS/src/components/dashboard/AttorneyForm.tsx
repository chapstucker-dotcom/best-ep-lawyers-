import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AttorneyProfile, AttorneyProfileInput } from '@/data/attorneyTypes';
import { attorneyService } from '@/services/attorneyService';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AttorneyFormProps {
  attorney?: AttorneyProfile;
  firmId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AttorneyForm({ attorney, firmId, onSuccess, onCancel }: AttorneyFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<AttorneyProfileInput>({
    name: attorney?.name || '',
    title: attorney?.title || '',
    photo_url: attorney?.photo_url || '',
    bio: attorney?.bio || '',
    specialties: attorney?.specialties || [],
    education: attorney?.education || [],
    bar_admissions: attorney?.bar_admissions || [],
    email: attorney?.email || '',
    phone: attorney?.phone || '',
    linkedin_url: attorney?.linkedin_url || '',
  });

  const [specialtyInput, setSpecialtyInput] = useState('');
  const [educationInput, setEducationInput] = useState('');
  const [barInput, setBarInput] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await attorneyService.uploadPhoto(file);
      setFormData({ ...formData, photo_url: url });
      toast({ title: 'Photo uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const addToArray = (field: 'specialties' | 'education' | 'bar_admissions', value: string) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), value.trim()]
    });
  };

  const removeFromArray = (field: 'specialties' | 'education' | 'bar_admissions', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (attorney) {
        await attorneyService.updateAttorney(attorney.id, formData);
        toast({ title: 'Attorney profile updated successfully' });
      } else {
        await attorneyService.createAttorney(firmId, formData);
        toast({ title: 'Attorney profile created successfully' });
      }
      onSuccess();
    } catch (error) {
      toast({ title: 'Failed to save attorney profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Photo</Label>
        <div className="mt-2 flex items-center gap-4">
          {formData.photo_url && (
            <img src={formData.photo_url} alt="Attorney" className="w-20 h-20 rounded-full object-cover" />
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploading}
          />
          {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
      </div>

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Senior Partner, Associate Attorney"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          value={formData.linkedin_url}
          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
        />
      </div>

      <div>
        <Label>Specialties</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            placeholder="Add specialty"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToArray('specialties', specialtyInput);
                setSpecialtyInput('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray('specialties', specialtyInput);
              setSpecialtyInput('');
            }}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.specialties?.map((s, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {s}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromArray('specialties', i)} />
            </span>
          ))}
        </div>
      </div>

      <div>
        <Label>Education</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={educationInput}
            onChange={(e) => setEducationInput(e.target.value)}
            placeholder="Add education"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToArray('education', educationInput);
                setEducationInput('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray('education', educationInput);
              setEducationInput('');
            }}
          >
            Add
          </Button>
        </div>
        <div className="space-y-1 mt-2">
          {formData.education?.map((e, i) => (
            <div key={i} className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center">
              <span className="text-sm">{e}</span>
              <X className="w-4 h-4 cursor-pointer" onClick={() => removeFromArray('education', i)} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Bar Admissions</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={barInput}
            onChange={(e) => setBarInput(e.target.value)}
            placeholder="Add bar admission"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToArray('bar_admissions', barInput);
                setBarInput('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addToArray('bar_admissions', barInput);
              setBarInput('');
            }}
          >
            Add
          </Button>
        </div>
        <div className="space-y-1 mt-2">
          {formData.bar_admissions?.map((b, i) => (
            <div key={i} className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center">
              <span className="text-sm">{b}</span>
              <X className="w-4 h-4 cursor-pointer" onClick={() => removeFromArray('bar_admissions', i)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {attorney ? 'Update' : 'Create'} Attorney
        </Button>
      </div>
    </form>
  );
}
