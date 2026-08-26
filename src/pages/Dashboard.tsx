import {
  useEffect,
  useState,
} from "react";
import {
  useSearchParams,
} from "react-router-dom";
import {
  AlertTriangle,
} from "lucide-react";

import {
  DashboardNav,
} from "@/components/dashboard/DashboardNav";
import {
  ProfileEditor,
} from "@/components/dashboard/ProfileEditor";
import {
  Analytics,
} from "@/components/dashboard/Analytics";
import {
  Subscription,
} from "@/components/dashboard/Subscription";
import {
  AttorneyManagement,
} from "@/components/dashboard/AttorneyManagement";
import {
  ReviewManagement,
} from "@/components/dashboard/ReviewManagement";

import {
  useAuth,
} from "@/contexts/AuthContext";
import {
  useToast,
} from "@/hooks/use-toast";
import {
  supabase,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  plans,
} from "@/data/plans";
import {
  saveFirmProfile,
} from "@/services/firmService";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type PendingFirmProfile = {
  firmName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  practiceArea?: string;
  requestedPlan?: string;
};

const readPendingFirmProfile =
  (): PendingFirmProfile | null => {
    try {
      const raw =
        localStorage.getItem(
          "pending-firm-profile"
        );

      if (!raw) {
        return null;
      }

      return JSON.parse(
        raw
      ) as PendingFirmProfile;
    } catch (error) {
      console.error(
        "Unable to read pending firm profile:",
        error
      );

      return null;
    }
  };

export default function Dashboard() {
  const [
    activeTab,
    setActiveTab,
  ] = useState("profile");

  const [
    firmId,
    setFirmId,
  ] = useState("");

  const [
    currentPlan,
    setCurrentPlan,
  ] = useState("free");

  const [
    attorneyCount,
    setAttorneyCount,
  ] = useState(0);

  const [
    isLoadingFirm,
    setIsLoadingFirm,
  ] = useState(true);

  const [
    firmLoadError,
    setFirmLoadError,
  ] = useState("");

  const {
    user,
    isConfigured,
  } = useAuth();

  const {
    toast,
  } = useToast();

  const [
    searchParams,
  ] = useSearchParams();

  useEffect(() => {
    if (
      searchParams.get(
        "success"
      ) === "true"
    ) {
      toast({
        title:
          "Payment Successful!",
        description:
          "Your subscription is now active.",
      });

      setActiveTab(
        "subscription"
      );
    }

    if (
      searchParams.get(
        "canceled"
      ) === "true"
    ) {
      toast({
        title:
          "Payment Canceled",
        description:
          "Your subscription was not changed.",
        variant:
          "destructive",
      });
    }
  }, [
    searchParams,
    toast,
  ]);

  useEffect(() => {
    let active = true;

    const loadFirmData =
      async () => {
        setIsLoadingFirm(true);
        setFirmLoadError("");
        setFirmId("");

        if (!user) {
          if (active) {
            setFirmLoadError(
              "No authenticated user was found."
            );

            setIsLoadingFirm(
              false
            );
          }

          return;
        }

        if (
          !isSupabaseConfigured ||
          !supabase
        ) {
          if (active) {
            setFirmLoadError(
              "Supabase is not configured."
            );

            setIsLoadingFirm(
              false
            );
          }

          return;
        }

        let {
          data,
          error,
        } = await supabase
          .from("firms")
          .select(
            "id, name, plan, plan_key, user_id"
          )
          .eq(
            "user_id",
            user.id
          )
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error(
            "Firm query failed:",
            error
          );

          if (active) {
            setFirmLoadError(
              error.message
            );

            setIsLoadingFirm(
              false
            );
          }

          return;
        }

        if (!data) {
          const pending =
            readPendingFirmProfile();

          const metadata =
            user.user_metadata ??
            {};

          const firmName =
            pending?.firmName?.trim() ||
            String(
              metadata.firm_name ??
                ""
            ).trim();

          const phone =
            pending?.phone?.trim() ||
            String(
              metadata.phone ??
                ""
            ).trim();

          const practiceArea =
            pending?.practiceArea?.trim() ||
            String(
              metadata.practice_area ??
                ""
            ).trim();

          const requestedPlan =
            pending?.requestedPlan ||
            String(
              metadata.selected_plan ??
                ""
            ).trim();

          const email =
            pending?.email?.trim() ||
            user.email ||
            "";

          if (!firmName) {
            if (active) {
              setFirmLoadError(
                "Your account is confirmed, but the firm name could not be recovered from signup."
              );

              setIsLoadingFirm(
                false
              );
            }

            return;
          }

          if (!practiceArea) {
            if (active) {
              setFirmLoadError(
                "Your account is confirmed, but the selected practice area could not be recovered from signup."
              );

              setIsLoadingFirm(
                false
              );
            }

            return;
          }

          const {
            data: createdFirm,
            error:
              createError,
          } =
            await saveFirmProfile(
              user.id,
              {
                name:
                  firmName,

                phone:
                  phone || null,

                email,

                city:
                  "El Paso",

                state:
                  "TX",

                category:
                  practiceArea,

                primary_category:
                  practiceArea,

                practice_areas: [
                  practiceArea,
                ],

                specialties: [
                  practiceArea,
                ],

                plan:
                  "free",

                plan_key:
                  "free",

                is_featured:
                  false,

                is_exclusive:
                  false,

                is_verified:
                  false,

                verified:
                  false,

                approved:
                  false,

                is_active:
                  true,

                payment_status:
                  "unpaid",

                status:
                  "pending",
              }
            );

          if (
            createError ||
            !createdFirm
          ) {
            console.error(
              "Unable to create firm profile:",
              createError
            );

            if (active) {
              setFirmLoadError(
                createError?.message
                  ? `Your account is signed in, but the firm profile could not be created: ${createError.message}`
                  : "Your account is signed in, but the firm profile could not be created."
              );

              setIsLoadingFirm(
                false
              );
            }

            return;
          }

          if (
            requestedPlan &&
            requestedPlan !==
              "free"
          ) {
            localStorage.setItem(
              "pending-checkout-plan",
              requestedPlan
            );

            localStorage.setItem(
              "selected-firm-plan",
              requestedPlan
            );
          }

          localStorage.setItem(
            "pending-checkout-practice-area",
            practiceArea
          );

          localStorage.setItem(
            "selected-firm-practice-area",
            practiceArea
          );

          localStorage.removeItem(
            "pending-firm-profile"
          );

          localStorage.removeItem(
            "pending-firm-name"
          );

          localStorage.removeItem(
            "pending-firm-phone"
          );

          data = {
            id:
              createdFirm.id,

            name:
              createdFirm.name,

            plan:
              createdFirm.plan ??
              "free",

            plan_key:
              createdFirm.plan_key ??
              "free",

            user_id:
              createdFirm.user_id,
          };

          toast({
            title:
              "Firm profile connected",
            description:
              `${firmName} is now connected to your account.`,
          });
        }

        if (!active) {
          return;
        }

        setFirmId(
          String(
            data.id
          )
        );

        const databasePlan =
          data.plan_key ||
          data.plan ||
          "free";

        const normalizedPlan =
          databasePlan ===
          "basic"
            ? "free"
            : databasePlan;

        setCurrentPlan(
          normalizedPlan
        );

        setFirmLoadError("");
        setIsLoadingFirm(false);
      };

    void loadFirmData();

    return () => {
      active = false;
    };
  }, [
    user,
    toast,
  ]);

  const planData =
    plans.find(
      (plan) =>
        plan.id ===
        currentPlan
    );

  const planLimit =
    planData
      ?.attorneyProfileLimit ??
    0;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        activeTab={
          activeTab
        }
        setActiveTab={
          setActiveTab
        }
      />

      <div className="container mx-auto px-4 py-8">
        {!isConfigured && (
          <Alert
            variant="destructive"
            className="mb-6"
          >
            <AlertTriangle className="h-4 w-4" />

            <AlertTitle>
              Demo Mode
            </AlertTitle>

            <AlertDescription>
              Supabase is not
              configured. The
              dashboard is running
              in demo mode with
              limited functionality.
            </AlertDescription>
          </Alert>
        )}

        {firmLoadError && (
          <Alert
            variant="destructive"
            className="mb-6"
          >
            <AlertTriangle className="h-4 w-4" />

            <AlertTitle>
              Firm Profile Error
            </AlertTitle>

            <AlertDescription>
              {firmLoadError}
            </AlertDescription>
          </Alert>
        )}

        {activeTab ===
          "profile" && (
          <ProfileEditor />
        )}

        {activeTab ===
          "attorneys" && (
          <>
            {isLoadingFirm && (
              <div className="rounded-lg border bg-white p-6">
                Loading your firm
                profile...
              </div>
            )}

            {!isLoadingFirm &&
              firmId &&
              !firmLoadError && (
                <AttorneyManagement
                  firmId={
                    firmId
                  }
                  planLimit={
                    planLimit
                  }
                  currentCount={
                    attorneyCount
                  }
                  onCountChange={
                    setAttorneyCount
                  }
                />
              )}

            {!isLoadingFirm &&
              !firmId &&
              !firmLoadError && (
                <div className="rounded-lg border bg-white p-6">
                  No firm profile
                  was found for
                  this account.
                </div>
              )}
          </>
        )}

        {activeTab ===
          "reviews" && (
          <ReviewManagement />
        )}

        {activeTab ===
          "analytics" && (
          <Analytics />
        )}

        {activeTab ===
          "subscription" && (
          <Subscription />
        )}
      </div>
    </div>
  );
}