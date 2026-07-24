import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

import {
  Camera,
  GraduationCap,
  Gavel,
  Loader2,
  Mail,
  Phone,
  Plus,
  Upload,
  UserRound,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type {
  AttorneyProfile,
  AttorneyProfileInput,
} from '@/data/attorneyTypes';

import {
  categories,
  getPracticeAreaTitle,
} from '@/data/categories';

import { attorneyService } from '@/services/attorneyService';
import { toast } from '@/hooks/use-toast';

interface AttorneyFormProps {
  attorney?: AttorneyProfile;
  firmId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type ArrayField =
  | 'specialties'
  | 'education'
  | 'bar_admissions';

const createInitialFormData = (
  attorney?: AttorneyProfile
): AttorneyProfileInput => ({
  name: attorney?.name ?? '',
  title: attorney?.title ?? '',
  photo_url: attorney?.photo_url ?? '',
  bio: attorney?.bio ?? '',
  specialties: attorney?.specialties ?? [],
  education: attorney?.education ?? [],
  bar_admissions: attorney?.bar_admissions ?? [],
  email: attorney?.email ?? '',
  phone: attorney?.phone ?? '',
  linkedin_url: attorney?.linkedin_url ?? '',
});

export function AttorneyForm({
  attorney,
  firmId,
  onSuccess,
  onCancel,
}: AttorneyFormProps) {
  const [formData, setFormData] =
    useState<AttorneyProfileInput>(() =>
      createInitialFormData(attorney)
    );

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [educationInput, setEducationInput] =
    useState('');

  const [barInput, setBarInput] =
    useState('');

  useEffect(() => {
    setFormData(createInitialFormData(attorney));
    setEducationInput('');
    setBarInput('');
  }, [attorney]);

  const updateField = <
    Key extends keyof AttorneyProfileInput
  >(
    field: Key,
    value: AttorneyProfileInput[Key]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePhotoUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported image type',
        description:
          'Upload a JPG, PNG, or WebP image.',
        variant: 'destructive',
      });

      event.target.value = '';
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      toast({
        title: 'Image is too large',
        description:
          'Attorney photos must be smaller than 5 MB.',
        variant: 'destructive',
      });

      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const url =
        await attorneyService.uploadPhoto(file);

      updateField('photo_url', url);

      toast({
        title: 'Photo uploaded',
        description:
          'The attorney photo is ready to save.',
      });
    } catch (error) {
      console.error(
        'Failed to upload attorney photo:',
        error
      );

      toast({
        title: 'Failed to upload photo',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected upload error occurred.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removePhoto = () => {
    updateField('photo_url', '');
  };

  const addToArray = (
    field: ArrayField,
    value: string
  ) => {
    const cleanValue = value.trim();

    if (!cleanValue) return;

    const currentValues =
      formData[field] ?? [];

    const alreadyExists =
      currentValues.some(
        (item) =>
          item.toLowerCase() ===
          cleanValue.toLowerCase()
      );

    if (alreadyExists) {
      toast({
        title: 'Already added',
        description: `${cleanValue} is already listed.`,
      });

      return;
    }

    setFormData((current) => ({
      ...current,
      [field]: [
        ...(current[field] ?? []),
        cleanValue,
      ],
    }));
  };

  const removeFromArray = (
    field: ArrayField,
    index: number
  ) => {
    setFormData((current) => ({
      ...current,
      [field]:
        current[field]?.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ) ?? [],
    }));
  };

  const handleArrayKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    field: 'education' | 'bar_admissions',
    value: string,
    clearInput: () => void
  ) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();

    addToArray(field, value);
    clearInput();
  };

  const toggleSpecialty = (
    slug: string
  ) => {
    const currentSpecialties =
      formData.specialties ?? [];

    const isSelected =
      currentSpecialties.includes(slug);

    updateField(
      'specialties',
      isSelected
        ? currentSpecialties.filter(
            (specialty) =>
              specialty !== slug
          )
        : [...currentSpecialties, slug]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: 'Attorney name required',
        description:
          'Enter the attorney’s full name.',
        variant: 'destructive',
      });

      return false;
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      toast({
        title: 'Invalid email address',
        description:
          'Enter a valid attorney email address.',
        variant: 'destructive',
      });

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const cleanedFormData: AttorneyProfileInput = {
      ...formData,
      name: formData.name.trim(),
      title: formData.title?.trim() ?? '',
      bio: formData.bio?.trim() ?? '',
      email: formData.email?.trim() ?? '',
      phone: formData.phone?.trim() ?? '',
      linkedin_url:
        formData.linkedin_url?.trim() ?? '',
      specialties:
        formData.specialties ?? [],
      education: formData.education ?? [],
      bar_admissions:
        formData.bar_admissions ?? [],
    };

    try {
      if (attorney) {
        await attorneyService.updateAttorney(
          attorney.id,
          cleanedFormData
        );

        toast({
          title:
            'Attorney profile updated',
          description: `${cleanedFormData.name} was updated successfully.`,
        });
      } else {
        await attorneyService.createAttorney(
          firmId,
          cleanedFormData
        );

        toast({
          title:
            'Attorney profile created',
          description: `${cleanedFormData.name} was added to the firm.`,
        });
      }

      onSuccess();
    } catch (error) {
      console.error(
        'Failed to save attorney profile:',
        error
      );

      toast({
        title:
          'Failed to save attorney profile',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5 text-[#1FA8A1]" />
            Professional Photo
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {formData.photo_url ? (
              <div className="relative w-fit">
                <img
                  src={formData.photo_url}
                  alt={
                    formData.name
                      ? `${formData.name} profile`
                      : 'Attorney profile'
                  }
                  className="h-28 w-28 rounded-2xl border object-cover shadow-sm"
                />

                <button
                  type="button"
                  onClick={removePhoto}
                  aria-label="Remove attorney photo"
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-gray-50">
                <UserRound className="h-12 w-12 text-gray-300" />
              </div>
            )}

            <div className="flex-1">
              <Label htmlFor="attorney-photo">
                Upload headshot
              </Label>

              <div className="mt-2 flex items-center gap-3">
                <Input
                  id="attorney-photo"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />

                {uploading && (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#1FA8A1]" />
                )}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Use a professional JPG, PNG,
                or WebP image smaller than
                5 MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserRound className="h-5 w-5 text-[#1FA8A1]" />
            Basic Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">
                Full Name *
              </Label>

              <Input
                id="name"
                value={formData.name}
                onChange={(event) =>
                  updateField(
                    'name',
                    event.target.value
                  )
                }
                placeholder="Jane M. Smith"
                required
              />
            </div>

            <div>
              <Label htmlFor="title">
                Professional Title
              </Label>

              <Input
                id="title"
                value={formData.title ?? ''}
                onChange={(event) =>
                  updateField(
                    'title',
                    event.target.value
                  )
                }
                placeholder="Senior Partner"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">
              Professional Biography
            </Label>

            <Textarea
              id="bio"
              value={formData.bio ?? ''}
              onChange={(event) =>
                updateField(
                  'bio',
                  event.target.value
                )
              }
              rows={7}
              placeholder="Describe the attorney’s experience, approach, representative matters, and professional background."
            />

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>
                Write in the third person
                for a professional public
                profile.
              </span>

              <span>
                {(formData.bio ?? '').length}{' '}
                characters
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-[#1FA8A1]" />
            Contact Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">
                Direct Email
              </Label>

              <Input
                id="email"
                type="email"
                value={formData.email ?? ''}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value
                  )
                }
                placeholder="attorney@lawfirm.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">
                Direct Phone
              </Label>

              <Input
                id="phone"
                type="tel"
                value={formData.phone ?? ''}
                onChange={(event) =>
                  updateField(
                    'phone',
                    event.target.value
                  )
                }
                placeholder="(915) 555-1234"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="linkedin">
                LinkedIn URL
              </Label>

              <Input
                id="linkedin"
                type="url"
                value={
                  formData.linkedin_url ?? ''
                }
                onChange={(event) =>
                  updateField(
                    'linkedin_url',
                    event.target.value
                  )
                }
                placeholder="https://www.linkedin.com/in/attorney-name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gavel className="h-5 w-5 text-[#1FA8A1]" />
            Practice Areas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            Select every practice area
            handled by this attorney.
          </p>

          <div className="max-h-80 overflow-y-auto rounded-xl border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => {
                const isSelected =
                  (
                    formData.specialties ?? []
                  ).includes(category.slug);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      toggleSpecialty(
                        category.slug
                      )
                    }
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? 'border-[#1FA8A1] bg-[#1FA8A1]/10 text-[#0F2A43]'
                        : 'border-gray-200 bg-white hover:border-[#1FA8A1]/50 hover:bg-gray-50'
                    }`}
                  >
                    <span>
                      {category.title}
                    </span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        isSelected
                          ? 'border-[#1FA8A1] bg-[#1FA8A1] text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="text-xs">
                          ✓
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {(formData.specialties ?? [])
            .length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Selected practice areas
              </p>

              <div className="flex flex-wrap gap-2">
                {(
                  formData.specialties ?? []
                ).map((specialty) => (
                  <Badge
                    key={specialty}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {getPracticeAreaTitle(
                      specialty
                    )}

                    <button
                      type="button"
                      aria-label={`Remove ${getPracticeAreaTitle(
                        specialty
                      )}`}
                      onClick={() =>
                        toggleSpecialty(
                          specialty
                        )
                      }
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-[#1FA8A1]" />
            Education
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={educationInput}
              onChange={(event) =>
                setEducationInput(
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleArrayKeyDown(
                  event,
                  'education',
                  educationInput,
                  () =>
                    setEducationInput('')
                )
              }
              placeholder="Texas Tech University School of Law, J.D."
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addToArray(
                  'education',
                  educationInput
                );
                setEducationInput('');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {(formData.education ?? []).map(
              (education, index) => (
                <div
                  key={`${education}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-lg border bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm text-gray-700">
                    {education}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromArray(
                        'education',
                        index
                      )
                    }
                    aria-label={`Remove ${education}`}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            )}

            {(formData.education ?? [])
              .length === 0 && (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-gray-500">
                No education entries added
                yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gavel className="h-5 w-5 text-[#1FA8A1]" />
            Bar Admissions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={barInput}
              onChange={(event) =>
                setBarInput(event.target.value)
              }
              onKeyDown={(event) =>
                handleArrayKeyDown(
                  event,
                  'bar_admissions',
                  barInput,
                  () => setBarInput('')
                )
              }
              placeholder="State Bar of Texas, 2015"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addToArray(
                  'bar_admissions',
                  barInput
                );
                setBarInput('');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {(
              formData.bar_admissions ?? []
            ).map((admission, index) => (
              <div
                key={`${admission}-${index}`}
                className="flex items-center justify-between gap-4 rounded-lg border bg-gray-50 px-4 py-3"
              >
                <span className="text-sm text-gray-700">
                  {admission}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeFromArray(
                      'bar_admissions',
                      index
                    )
                  }
                  aria-label={`Remove ${admission}`}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {(
              formData.bar_admissions ?? []
            ).length === 0 && (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-gray-500">
                No bar admissions added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-white/95 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || uploading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading || uploading}
          className="bg-[#1FA8A1] hover:bg-[#178D87]"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}

          {attorney
            ? 'Save Attorney Changes'
            : 'Create Attorney Profile'}
        </Button>
      </div>
    </form>
  );
}