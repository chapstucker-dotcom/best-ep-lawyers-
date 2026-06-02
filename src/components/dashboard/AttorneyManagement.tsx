import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AttorneyProfile } from '@/data/attorneyTypes';
import { attorneyService } from '@/services/attorneyService';
import { AttorneyForm } from './AttorneyForm';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface AttorneyManagementProps {
  firmId: string;
  planLimit: number;
  currentCount: number;
  onCountChange: (count: number) => void;
}

export function AttorneyManagement({ firmId, planLimit, currentCount, onCountChange }: AttorneyManagementProps) {
  const [attorneys, setAttorneys] = useState<AttorneyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAttorney, setEditingAttorney] = useState<AttorneyProfile | undefined>();

  const loadAttorneys = async () => {
    try {
      const data = await attorneyService.getAllAttorneysByFirm(firmId);
      setAttorneys(data);
      onCountChange(data.length);
    } catch (error) {
      toast({ title: 'Failed to load attorneys', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttorneys();
  }, [firmId]);

  const handleAdd = () => {
    if (currentCount >= planLimit) {
      toast({
        title: 'Profile limit reached',
        description: 'Please upgrade your plan to add more attorney profiles',
        variant: 'destructive'
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
    if (!confirm('Are you sure you want to delete this attorney profile?')) return;

    try {
      await attorneyService.deleteAttorney(id);
      toast({ title: 'Attorney profile deleted' });
      loadAttorneys();
    } catch (error) {
      toast({ title: 'Failed to delete attorney', variant: 'destructive' });
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    loadAttorneys();
  };

  const isAtLimit = currentCount >= planLimit;
  const additionalProfiles = Math.max(0, currentCount - planLimit);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Attorney Profiles</CardTitle>
            <CardDescription>
              Manage your firm's attorney profiles
            </CardDescription>
          </div>
          <Button onClick={handleAdd} disabled={isAtLimit && planLimit > 0}>
            <Plus className="w-4 h-4 mr-2" />
            Add Attorney
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant={isAtLimit ? "destructive" : "default"}>
            {currentCount} of {planLimit === 0 ? 'unlimited' : planLimit} profiles used
          </Badge>
          {additionalProfiles > 0 && (
            <Badge variant="secondary">
              +${additionalProfiles}/mo for additional profiles
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAtLimit && planLimit > 0 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've reached your plan limit. Upgrade to add more attorney profiles or pay $1/month per additional profile.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : attorneys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attorney profiles yet. Add your first attorney to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {attorneys.map((attorney) => (
              <div key={attorney.id} className="border rounded-lg p-4 flex items-start gap-4">
                {attorney.photo_url && (
                  <img
                    src={attorney.photo_url}
                    alt={attorney.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{attorney.name}</h3>
                  {attorney.title && <p className="text-sm text-gray-600">{attorney.title}</p>}
                  {attorney.specialties && attorney.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {attorney.specialties.map((s, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(attorney)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(attorney.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAttorney ? 'Edit Attorney Profile' : 'Add Attorney Profile'}
            </DialogTitle>
          </DialogHeader>
          <AttorneyForm
            attorney={editingAttorney}
            firmId={firmId}
            onSuccess={handleSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}


