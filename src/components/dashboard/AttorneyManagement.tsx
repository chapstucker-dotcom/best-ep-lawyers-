import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertCircle,
  Edit,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import type { AttorneyProfile } from '@/data/attorneyTypes';

import {
  getPracticeAreaTitle,
} from '@/data/categories';

import {
  attorneyService,
} from '@/services/attorneyService';

import { AttorneyForm } from './AttorneyForm';
import { toast } from '@/hooks/use-toast';

interface AttorneyManagementProps {
  firmId: string;
  planLimit: number;
  currentCount: number;
  onCountChange: (count: number) => void;
}

type PublicAttorney = AttorneyProfile & {
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  is_active?: boolean | null;
};

export function AttorneyManagement({
  firmId,
  planLimit,
  onCountChange,
}: AttorneyManagementProps) {
  const navigate = useNavigate();

  const [attorneys, setAttorneys] = useState<
    AttorneyProfile[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    editingAttorney,
    setEditingAttorney,
  ] = useState<
    AttorneyProfile | undefined
  >(undefined);

  const actualCount = attorneys.length;

  const hasAttorneyAccess =
    planLimit > 0;

  const isAtLimit =
    hasAttorneyAccess &&
    actualCount >= planLimit;

  const remainingProfiles = Math.max(
    planLimit - actualCount,
    0
  );

  const usagePercentage =
    hasAttorneyAccess && planLimit > 0
      ? Math.min(
          (actualCount / planLimit) * 100,
          100
        )
      : 0;

  const sortedAttorneys = useMemo(() => {
    return [...attorneys].sort(
      (first, second) =>
        String(first.name || '').localeCompare(
          String(second.name || '')
        )
    );
  }, [attorneys]);

  const loadAttorneys =
    useCallback(async () => {
      if (!firmId) {
        setAttorneys([]);
        setLoading(false);
        onCountChange(0);
        return;
      }

      setLoading(true);

      try {
        const data =
          await attorneyService
            .getAllAttorneysByFirm(
              firmId
            );

        setAttorneys(data);
        onCountChange(data.length);
      } catch (error) {
        console.error(
          'Failed to load attorneys:',
          error
        );

        toast({
          title:
            'Failed to load attorneys',
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, [firmId, onCountChange]);

  useEffect(() => {
    void loadAttorneys();
  }, [loadAttorneys]);

  const handleAdd = () => {
    if (!hasAttorneyAccess) {
      toast({
        title: 'Upgrade required',
        description:
          'Attorney profiles are available with the Expert plan or higher.',
        variant: 'destructive',
      });
      return;
    }

    if (isAtLimit) {
      toast({
        title:
          'Profile limit reached',
        description: `Your current plan includes up to ${planLimit} attorney profiles.`,
        variant: 'destructive',
      });
      return;
    }

    setEditingAttorney(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (
    attorney: AttorneyProfile
  ) => {
    setEditingAttorney(attorney);
    setDialogOpen(true);
  };

  const handlePreview = (
    attorneyId: string
  ) => {
    navigate(`/attorney/${attorneyId}`);
  };

  const handleDelete = async (
    attorney: AttorneyProfile
  ) => {
    const confirmed =
      window.confirm(
        `Delete the attorney profile for ${attorney.name}? This cannot be undone.`
      );

    if (!confirmed) return;

    setDeletingId(attorney.id);

    try {
      await attorneyService
        .deleteAttorney(attorney.id);

      toast({
        title:
          'Attorney profile deleted',
        description: `${attorney.name} was removed from the firm.`,
      });

      await loadAttorneys();
    } catch (error) {
      console.error(
        'Failed to delete attorney:',
        error
      );

      toast({
        title:
          'Failed to delete attorney',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuccess = async () => {
    setDialogOpen(false);
    setEditingAttorney(undefined);
    await loadAttorneys();
  };

  const handleDialogChange = (
    open: boolean
  ) => {
    setDialogOpen(open);

    if (!open) {
      setEditingAttorney(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-[#0F2A43] to-[#176B78] text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-6 w-6" />

                <CardTitle className="text-2xl text-white">
                  Attorney Profiles
                </CardTitle>
              </div>

              <CardDescription className="max-w-2xl text-white/80">
                Add and manage the attorneys
                shown on your firm’s public
                profile.
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              disabled={
                loading ||
                !hasAttorneyAccess ||
                isAtLimit
              }
              className="bg-[#F5B800] font-semibold text-[#0F2A43] hover:bg-[#E4AA00]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Attorney
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">
                Profiles Used
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0F2A43]">
                {actualCount}
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">
                Plan Limit
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0F2A43]">
                {hasAttorneyAccess
                  ? planLimit
                  : 0}
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">
                Profiles Remaining
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0F2A43]">
                {hasAttorneyAccess
                  ? remainingProfiles
                  : 0}
              </p>
            </div>
          </section>

          {hasAttorneyAccess && (
            <section>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Plan usage
                </span>

                <span className="text-gray-500">
                  {actualCount} of {planLimit}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#1FA8A1] transition-all"
                  style={{
                    width: `${usagePercentage}%`,
                  }}
                />
              </div>
            </section>
          )}

          {!hasAttorneyAccess && (
            <Alert>
              <AlertCircle className="h-4 w-4" />

              <AlertDescription>
                Upgrade to the Expert plan
                or higher to add attorney
                profiles.
              </AlertDescription>
            </Alert>
          )}

          {isAtLimit && (
            <Alert>
              <AlertCircle className="h-4 w-4" />

              <AlertDescription>
                You have reached the{' '}
                {planLimit}-profile limit
                for your current plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                Your Attorneys
              </CardTitle>

              <CardDescription>
                Edit profile information,
                preview public pages, or
                remove attorneys.
              </CardDescription>
            </div>

            <Badge
              variant={
                isAtLimit
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {actualCount}{' '}
              {actualCount === 1
                ? 'attorney'
                : 'attorneys'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading attorney profiles...
            </div>
          ) : sortedAttorneys.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed bg-gray-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <UserRound className="h-8 w-8 text-[#1FA8A1]" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#0F2A43]">
                No attorney profiles yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                Add your first attorney to
                display professional
                biographies and direct
                contact information on the
                public firm profile.
              </p>

              {hasAttorneyAccess &&
                !isAtLimit && (
                  <Button
                    type="button"
                    onClick={handleAdd}
                    className="mt-6 bg-[#1FA8A1] hover:bg-[#178D87]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Attorney
                  </Button>
                )}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {sortedAttorneys.map(
                (attorney) => {
                  const publicAttorney =
                    attorney as PublicAttorney;

                  const specialties =
                    attorney.specialties ??
                    [];

                  const isDeleting =
                    deletingId ===
                    attorney.id;

                  return (
                    <article
                      key={attorney.id}
                      className="flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:border-[#1FA8A1]/50 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">
                        {attorney.photo_url ? (
                          <img
                            src={
                              attorney.photo_url
                            }
                            alt={attorney.name}
                            className="h-28 w-28 shrink-0 rounded-2xl border object-cover"
                          />
                        ) : (
                          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border bg-gray-100 text-4xl font-bold text-gray-400">
                            {attorney.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-bold text-[#0F2A43]">
                                {attorney.name}
                              </h3>

                              {attorney.title && (
                                <p className="mt-1 font-medium text-gray-600">
                                  {
                                    attorney.title
                                  }
                                </p>
                              )}
                            </div>

                            <Badge
                              variant={
                                publicAttorney.is_active ===
                                false
                                  ? 'outline'
                                  : 'secondary'
                              }
                            >
                              {publicAttorney.is_active ===
                              false
                                ? 'Inactive'
                                : 'Active'}
                            </Badge>
                          </div>

                          {publicAttorney.bio && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                              {
                                publicAttorney.bio
                              }
                            </p>
                          )}

                          {specialties.length >
                            0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {specialties
                                .slice(0, 4)
                                .map(
                                  (
                                    specialty,
                                    index
                                  ) => (
                                    <Badge
                                      key={`${specialty}-${index}`}
                                      variant="secondary"
                                      className="rounded-full"
                                    >
                                      {getPracticeAreaTitle(
                                        specialty
                                      )}
                                    </Badge>
                                  )
                                )}

                              {specialties.length >
                                4 && (
                                <Badge
                                  variant="outline"
                                  className="rounded-full"
                                >
                                  +
                                  {specialties.length -
                                    4}{' '}
                                  more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-4 border-t pt-4 text-sm text-gray-600">
                        {publicAttorney.email && (
                          <span className="flex min-w-0 items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0 text-[#1FA8A1]" />

                            <span className="truncate">
                              {
                                publicAttorney.email
                              }
                            </span>
                          </span>
                        )}

                        {publicAttorney.phone && (
                          <span className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#1FA8A1]" />
                            {
                              publicAttorney.phone
                            }
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePreview(
                              attorney.id
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleEdit(
                              attorney
                            )
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() =>
                            void handleDelete(
                              attorney
                            )
                          }
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          {isDeleting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}

                          Delete
                        </Button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
      >
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAttorney
                ? `Edit ${editingAttorney.name}`
                : 'Add Attorney Profile'}
            </DialogTitle>
          </DialogHeader>

          <AttorneyForm
            attorney={editingAttorney}
            firmId={firmId}
            onSuccess={() =>
              void handleSuccess()
            }
            onCancel={() =>
              handleDialogChange(false)
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}