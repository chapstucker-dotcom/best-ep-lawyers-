import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react';

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
import { attorneyService } from '@/services/attorneyService';
import { AttorneyForm } from './AttorneyForm';
import { toast } from '@/hooks/use-toast';

interface AttorneyManagementProps {
  firmId: string;
  planLimit: number;
  currentCount: number;
  onCountChange: (count: number) => void;
}

export function AttorneyManagement({
  firmId,
  planLimit,
  onCountChange,
}: AttorneyManagementProps) {
  const [attorneys, setAttorneys] = useState<AttorneyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAttorney, setEditingAttorney] =
    useState<AttorneyProfile | undefined>(undefined);

  const actualCount = attorneys.length;
  const hasAttorneyAccess = planLimit > 0;
  const isAtLimit =
    hasAttorneyAccess && actualCount >= planLimit;

  const loadAttorneys = useCallback(async () => {
    if (!firmId) {
      setAttorneys([]);
      setLoading(false);
      onCountChange(0);
      return;
    }

    setLoading(true);

    try {
      const data =
        await attorneyService.getAllAttorneysByFirm(firmId);

      setAttorneys(data);
      onCountChange(data.length);
    } catch (error) {
      console.error('Failed to load attorneys:', error);

      toast({
        title: 'Failed to load attorneys',
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
        title: 'Profile limit reached',
        description: `Your current plan includes up to ${planLimit} attorney profiles.`,
        variant: 'destructive',
      });
      return;
    }

    setEditingAttorney(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (attorney: AttorneyProfile) => {
    setEditingAttorney(attorney);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this attorney profile?'
    );

    if (!confirmed) return;

    try {
      await attorneyService.deleteAttorney(id);

      toast({
        title: 'Attorney profile deleted',
      });

      await loadAttorneys();
    } catch (error) {
      console.error('Failed to delete attorney:', error);

      toast({
        title: 'Failed to delete attorney',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = async () => {
    setDialogOpen(false);
    setEditingAttorney(undefined);
    await loadAttorneys();
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingAttorney(undefined);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Attorney Profiles</CardTitle>

            <CardDescription>
              Manage your firm&apos;s attorney profiles
            </CardDescription>
          </div>

          <Button
            type="button"
            onClick={handleAdd}
            disabled={loading || !hasAttorneyAccess || isAtLimit}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Attorney
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge
            variant={
              !hasAttorneyAccess || isAtLimit
                ? 'destructive'
                : 'default'
            }
          >
            {hasAttorneyAccess
              ? `${actualCount} of ${planLimit} profiles used`
              : 'Attorney profiles not included'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {!hasAttorneyAccess && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />

            <AlertDescription>
              Upgrade to the Expert plan or higher to add
              attorney profiles.
            </AlertDescription>
          </Alert>
        )}

        {isAtLimit && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />

            <AlertDescription>
              You have reached the {planLimit}-profile limit
              for your current plan.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="py-8 text-center">
            Loading attorney profiles...
          </div>
        ) : attorneys.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No attorney profiles yet. Add your first attorney
            to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {attorneys.map((attorney) => (
              <div
                key={attorney.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start"
              >
                {attorney.photo_url ? (
                  <img
                    src={attorney.photo_url}
                    alt={attorney.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-500">
                    {attorney.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    {attorney.name}
                  </h3>

                  {attorney.title && (
                    <p className="text-sm text-gray-600">
                      {attorney.title}
                    </p>
                  )}

                  {attorney.specialties &&
                    attorney.specialties.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {attorney.specialties.map(
                          (specialty, index) => (
                            <span
                              key={`${specialty}-${index}`}
                              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                            >
                              {specialty}
                            </span>
                          )
                        )}
                      </div>
                    )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={`Edit ${attorney.name}`}
                    onClick={() => handleEdit(attorney)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={`Delete ${attorney.name}`}
                    onClick={() =>
                      void handleDelete(attorney.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAttorney
                ? 'Edit Attorney Profile'
                : 'Add Attorney Profile'}
            </DialogTitle>
          </DialogHeader>

          <AttorneyForm
            attorney={editingAttorney}
            firmId={firmId}
            onSuccess={() => void handleSuccess()}
            onCancel={() => handleDialogChange(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}