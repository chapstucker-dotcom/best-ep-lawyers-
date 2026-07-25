import { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { AttorneyProfile } from "@/data/attorneyTypes";
import { getPlanRules } from "@/config/planRules";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { attorneyService } from "@/services/attorneyService";

import { AttorneyForm } from "./AttorneyForm";

import {
  AlertCircle,
  Edit,
  Loader2,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

interface AttorneyManagementProps {
  firmId: string;

  // Kept for compatibility with the current Dashboard.
  // The live database plan is the source of truth.
  planLimit?: number;
  currentCount?: number;
  onCountChange?: (count: number) => void;
}

type FirmPlanRow = {
  plan?: string | null;
  plan_key?: string | null;
};

export function AttorneyManagement({
  firmId,
  onCountChange,
}: AttorneyManagementProps) {
  const [attorneys, setAttorneys] = useState<
    AttorneyProfile[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] =
    useState(true);
  const [dialogOpen, setDialogOpen] =
    useState(false);
  const [editingAttorney, setEditingAttorney] =
    useState<AttorneyProfile | undefined>();
  const [firmPlan, setFirmPlan] =
    useState<string>("free");

  const planRules = useMemo(
    () => getPlanRules(firmPlan),
    [firmPlan]
  );

  const attorneyLimit =
    planRules.attorneyLimit;
  const attorneyCount =
    attorneys.length;
  const isAtLimit =
    attorneyCount >= attorneyLimit;
  const remainingProfiles = Math.max(
    0,
    attorneyLimit - attorneyCount
  );

  const loadPlan = async () => {
    setPlanLoading(true);

    try {
      const { data, error } = await supabase
        .from("firms")
        .select("plan, plan_key")
        .eq("id", firmId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const row =
        (data ?? {}) as FirmPlanRow;

      setFirmPlan(
        row.plan_key ??
          row.plan ??
          "free"
      );
    } catch (error) {
      console.error(
        "Failed to load firm plan:",
        error
      );

      setFirmPlan("free");

      toast({
        title: "Could not load subscription",
        description:
          "Attorney additions are locked until the plan can be verified.",
        variant: "destructive",
      });
    } finally {
      setPlanLoading(false);
    }
  };

  const loadAttorneys = async () => {
    setLoading(true);

    try {
      const data =
        await attorneyService.getAllAttorneysByFirm(
          firmId
        );

      setAttorneys(data);
      onCountChange?.(data.length);
    } catch (error) {
      console.error(
        "Failed to load attorneys:",
        error
      );

      toast({
        title: "Failed to load attorneys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firmId) return;

    void Promise.all([
      loadPlan(),
      loadAttorneys(),
    ]);
  }, [firmId]);

  const handleAdd = () => {
    if (planLoading) {
      toast({
        title: "Checking subscription",
        description:
          "Please wait while your plan is verified.",
      });
      return;
    }

    if (attorneyLimit === 0) {
      toast({
        title:
          "Attorney profiles are not included",
        description:
          "Upgrade to Expert, Category Featured, or Category Exclusive to add attorney profiles.",
        variant: "destructive",
      });
      return;
    }

    if (isAtLimit) {
      toast({
        title: "Attorney limit reached",
        description: `${planRules.displayName} includes up to ${attorneyLimit} attorney profiles. Upgrade your plan to add more.`,
        variant: "destructive",
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

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attorney profile?"
    );

    if (!confirmed) return;

    try {
      await attorneyService.deleteAttorney(
        id
      );

      toast({
        title:
          "Attorney profile deleted",
      });

      await loadAttorneys();
    } catch (error) {
      console.error(
        "Failed to delete attorney:",
        error
      );

      toast({
        title:
          "Failed to delete attorney",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = async () => {
    setDialogOpen(false);
    setEditingAttorney(undefined);
    await loadAttorneys();
  };

  const addButtonDisabled =
    planLoading ||
    attorneyLimit === 0 ||
    isAtLimit;

  const usageLabel =
    attorneyLimit === 0
      ? "0 attorney profiles included"
      : `${attorneyCount} of ${attorneyLimit} profiles used`;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-[#0F2A43]">
                <Users className="h-6 w-6 text-[#1FA8A1]" />
                Attorney Profiles
              </CardTitle>

              <CardDescription className="mt-2">
                Manage the attorneys displayed
                on your public firm profile.
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              disabled={addButtonDisabled}
              className="bg-[#1FA8A1] hover:bg-[#178f89]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Attorney
            </Button>
          </div>

          <div className="mt-5 rounded-xl bg-[#0F2A43] p-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                  Current Subscription
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {planLoading
                    ? "Loading plan..."
                    : planRules.displayName}
                </h3>

                <p className="mt-2 text-sm text-white/75">
                  {planLoading
                    ? "Verifying attorney profile access."
                    : attorneyLimit === 0
                      ? "Attorney profiles are not included with this plan."
                      : `${remainingProfiles} profile${
                          remainingProfiles ===
                          1
                            ? ""
                            : "s"
                        } remaining.`}
                </p>
              </div>

              <Badge
                className={
                  isAtLimit ||
                  attorneyLimit === 0
                    ? "w-fit bg-red-100 text-red-800 hover:bg-red-100"
                    : "w-fit bg-white text-[#0F2A43] hover:bg-white"
                }
              >
                {usageLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!planLoading &&
            attorneyLimit === 0 && (
              <Alert className="mb-5 border-amber-300 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <AlertDescription className="text-amber-900">
                  The Free plan does not include
                  attorney profiles. Upgrade to
                  Expert for up to 5, Category
                  Featured for up to 10, or
                  Category Exclusive for up to
                  20.
                </AlertDescription>
              </Alert>
            )}

          {!planLoading &&
            attorneyLimit > 0 &&
            isAtLimit && (
              <Alert className="mb-5 border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-700" />
                <AlertDescription className="text-red-900">
                  You have reached the{" "}
                  {planRules.displayName} limit
                  of {attorneyLimit} attorney
                  profiles. Existing profiles
                  may still be edited or
                  deleted, but another profile
                  cannot be added unless the
                  plan is upgraded.
                </AlertDescription>
              </Alert>
            )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1FA8A1]" />
            </div>
          ) : attorneys.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-gray-50 px-6 py-12 text-center">
              <Users className="mx-auto mb-4 h-10 w-10 text-gray-400" />

              <h3 className="font-bold text-[#0F2A43]">
                No attorney profiles yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                {attorneyLimit === 0
                  ? "Upgrade your subscription to begin showcasing individual attorneys."
                  : "Add your first attorney to showcase the firm's legal team."}
              </p>

              {attorneyLimit > 0 && (
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={addButtonDisabled}
                  className="mt-5 bg-[#1FA8A1] hover:bg-[#178f89]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Attorney
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {attorneys.map((attorney) => (
                <article
                  key={attorney.id}
                  className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    {attorney.photo_url ? (
                      <img
                        src={
                          attorney.photo_url
                        }
                        alt={attorney.name}
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0F2A43]/10">
                        <Users className="h-7 w-7 text-[#0F2A43]" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-[#0F2A43]">
                        {attorney.name}
                      </h3>

                      {attorney.title && (
                        <p className="mt-1 text-sm text-gray-600">
                          {attorney.title}
                        </p>
                      )}

                      {attorney.email && (
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {attorney.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleEdit(attorney)
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void handleDelete(
                          attorney.id
                        )
                      }
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setEditingAttorney(
              undefined
            );
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAttorney
                ? "Edit Attorney Profile"
                : "Add Attorney Profile"}
            </DialogTitle>
          </DialogHeader>

          {editingAttorney ||
          (!planLoading &&
            attorneyLimit > 0 &&
            !isAtLimit) ? (
            <AttorneyForm
              attorney={editingAttorney}
              firmId={firmId}
              onSuccess={() =>
                void handleSuccess()
              }
              onCancel={() =>
                setDialogOpen(false)
              }
            />
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your current subscription does
                not allow another attorney
                profile.
              </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
