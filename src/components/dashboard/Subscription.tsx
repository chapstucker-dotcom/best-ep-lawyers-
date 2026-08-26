import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import {
  AlertTriangle,
  Check,
  Loader2,
  TestTube2,
} from "lucide-react";

import {
  plans,
} from "@/data/plans";

import {
  supabase,
} from "@/lib/supabase";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  useToast,
} from "@/hooks/use-toast";

/*
 * SANDBOX TEST MODE
 *
 * Only Category Featured uses Stripe
 * Sandbox right now.
 *
 * No live checkout links are used here.
 */
const CATEGORY_FEATURED_SANDBOX_URL =
  "https://buy.stripe.com/test_28EfZg8ssgM82Ce54RaVa02";

const SANDBOX_MODE = true;

const normalizePlan = (
  value: unknown
): string =>
  String(
    value ?? "free"
  )
    .trim()
    .toLowerCase()
    .replace(
      /[\s_]+/g,
      "-"
    );

export const Subscription =
  () => {
    const [
      currentPlan,
      setCurrentPlan,
    ] = useState("free");

    const [
      firmId,
      setFirmId,
    ] = useState("");

    const [
      firmEmail,
      setFirmEmail,
    ] = useState("");

    const [
      selectedPracticeArea,
      setSelectedPracticeArea,
    ] = useState("");

    const [
      loadingPlan,
      setLoadingPlan,
    ] =
      useState<
        string | null
      >(null);

    const [
      availabilityError,
      setAvailabilityError,
    ] = useState("");

    const [
      firmError,
      setFirmError,
    ] = useState("");

    const {
      user,
    } = useAuth();

    const {
      toast,
    } = useToast();

    /*
     * Load selected practice area
     * preserved from signup.
     */
    useEffect(() => {
      const storedPracticeArea =
        localStorage.getItem(
          "selected-firm-practice-area"
        ) ||
        localStorage.getItem(
          "pending-checkout-practice-area"
        ) ||
        "";

      setSelectedPracticeArea(
        storedPracticeArea
      );
    }, []);

    /*
     * Load the authenticated firm's:
     *
     * - database ID
     * - current plan
     * - email
     *
     * The firm ID is required because
     * Stripe sends it back to our
     * webhook as client_reference_id.
     */
    useEffect(() => {
      const loadFirm =
        async () => {
          if (!user) {
            return;
          }

          setFirmError("");

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "firms"
              )
              .select(
                "id, plan, plan_key, email, primary_category, category"
              )
              .eq(
                "user_id",
                user.id
              )
              .maybeSingle();

          if (error) {
            console.error(
              "Unable to load firm subscription:",
              error
            );

            setFirmError(
              error.message
            );

            return;
          }

          if (!data) {
            setFirmError(
              "No firm profile is connected to this account."
            );

            return;
          }

          setFirmId(
            String(
              data.id
            )
          );

          setFirmEmail(
            data.email ||
              user.email ||
              ""
          );

          const databasePlan =
            data.plan_key ||
            data.plan ||
            "free";

          setCurrentPlan(
            normalizePlan(
              databasePlan ===
                "basic"
                ? "free"
                : databasePlan
            )
          );

          /*
           * If localStorage was lost,
           * recover the practice area
           * directly from the firm row.
           */
          if (
            !selectedPracticeArea
          ) {
            const recoveredArea =
              data.primary_category ||
              data.category ||
              "";

            if (
              recoveredArea
            ) {
              setSelectedPracticeArea(
                recoveredArea
              );

              localStorage.setItem(
                "selected-firm-practice-area",
                recoveredArea
              );

              localStorage.setItem(
                "pending-checkout-practice-area",
                recoveredArea
              );
            }
          }
        };

      void loadFirm();
    }, [
      user,
      selectedPracticeArea,
    ]);

    const checkAvailability =
      async (
        planName: string
      ): Promise<boolean> => {
        if (
          planName !==
            "Category Featured" &&
          planName !==
            "Category Exclusive"
        ) {
          return true;
        }

        if (
          !selectedPracticeArea
        ) {
          setAvailabilityError(
            "No primary practice area was found for this signup."
          );

          return false;
        }

        try {
          const response =
            await fetch(
              "/api/check-plan-availability",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify(
                    {
                      plan:
                        planName,

                      category:
                        selectedPracticeArea,
                    }
                  ),
              }
            );

          const result =
            await response.json();

          if (
            !response.ok ||
            result?.available !==
              true
          ) {
            setAvailabilityError(
              result?.reason ||
                result?.error ||
                "This premium position is not currently available."
            );

            return false;
          }

          setAvailabilityError(
            ""
          );

          return true;
        } catch (error) {
          console.error(
            "Availability check failed:",
            error
          );

          setAvailabilityError(
            "We could not verify premium plan availability. Please try again."
          );

          return false;
        }
      };

    const buildSandboxCheckoutUrl =
      () => {
        const url =
          new URL(
            CATEGORY_FEATURED_SANDBOX_URL
          );

        /*
         * Stripe Payment Links support
         * client_reference_id.
         *
         * Our webhook uses this value
         * to locate the correct firms row.
         */
        url.searchParams.set(
          "client_reference_id",
          firmId
        );

        /*
         * Prefill the customer's email
         * when available.
         */
        if (firmEmail) {
          url.searchParams.set(
            "prefilled_email",
            firmEmail
          );
        }

        return url.toString();
      };

    const handleSubscribe =
      async (
        planId: string,
        planName: string
      ) => {
        setAvailabilityError(
          ""
        );

        setFirmError("");

        if (
          planId ===
          "free"
        ) {
          toast({
            title:
              "Free Listing",

            description:
              "Your firm already has access to the free listing plan.",
          });

          return;
        }

        /*
         * Only Category Featured is
         * enabled during Sandbox testing.
         */
        if (
          SANDBOX_MODE &&
          planId !==
            "category-featured"
        ) {
          toast({
            title:
              "Sandbox testing active",

            description:
              "Only Category Featured is enabled for Sandbox checkout right now.",
          });

          return;
        }

        if (!firmId) {
          setFirmError(
            "Your firm profile is still loading. Please wait a moment and try again."
          );

          return;
        }

        if (
          !selectedPracticeArea
        ) {
          setAvailabilityError(
            "No practice area is connected to this firm."
          );

          return;
        }

        setLoadingPlan(
          planId
        );

        const available =
          await checkAvailability(
            planName
          );

        if (!available) {
          setLoadingPlan(
            null
          );

          return;
        }

        if (
          planId ===
          "category-featured"
        ) {
          /*
           * Preserve checkout context.
           */
          localStorage.setItem(
            "selected-firm-plan",
            planId
          );

          localStorage.setItem(
            "pending-checkout-plan",
            planId
          );

          localStorage.setItem(
            "pending-checkout-practice-area",
            selectedPracticeArea
          );

          localStorage.setItem(
            "pending-checkout-firm-id",
            firmId
          );

          localStorage.setItem(
            "pending-checkout-started-at",
            new Date().toISOString()
          );

          /*
           * The firm remains FREE in
           * Supabase until Stripe confirms
           * payment through the webhook.
           */
          window.location.href =
            buildSandboxCheckoutUrl();

          return;
        }

        setLoadingPlan(
          null
        );
      };

    return (
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">
              Subscription Management
            </h2>

            {SANDBOX_MODE && (
              <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
                <TestTube2 className="mr-1 h-3.5 w-3.5" />

                Stripe Sandbox
              </Badge>
            )}
          </div>

          <p className="mt-2 text-gray-600">
            Current Plan:{" "}

            <Badge className="bg-[#1FA8A1]">
              {currentPlan}
            </Badge>
          </p>

          {firmId && (
            <p className="mt-2 text-xs text-gray-500">
              Firm ID:{" "}
              {firmId}
            </p>
          )}

          {selectedPracticeArea && (
            <p className="mt-2 text-sm text-gray-600">
              Selected Practice
              Area:{" "}

              <strong>
                {
                  selectedPracticeArea
                }
              </strong>
            </p>
          )}
        </div>

        {SANDBOX_MODE && (
          <Alert className="border-amber-300 bg-amber-50">
            <TestTube2 className="h-4 w-4" />

            <AlertDescription>
              Sandbox testing is
              active. Category
              Featured will use the
              Stripe test checkout.
              No real $2,000 charge
              will be made.
            </AlertDescription>
          </Alert>
        )}

        {firmError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />

            <AlertDescription>
              {firmError}
            </AlertDescription>
          </Alert>
        )}

        {availabilityError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />

            <AlertDescription>
              {
                availabilityError
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {plans.map(
            (plan) => {
              const normalizedPlanId =
                normalizePlan(
                  plan.id
                );

              const isCurrentPlan =
                currentPlan ===
                normalizedPlanId;

              const isFreePlan =
                plan.id ===
                "free";

              const isLoading =
                loadingPlan ===
                plan.id;

              const isSandboxFeatured =
                plan.id ===
                "category-featured";

              const disabledForSandbox =
                SANDBOX_MODE &&
                !isFreePlan &&
                !isSandboxFeatured;

              return (
                <Card
                  key={
                    plan.id
                  }
                  className={
                    isCurrentPlan
                      ? "border-2 border-[#1FA8A1]"
                      : isSandboxFeatured
                        ? "border-2 border-amber-300"
                        : ""
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold">
                          {
                            plan.name
                          }
                        </span>

                        {isSandboxFeatured &&
                          SANDBOX_MODE && (
                            <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
                              Sandbox
                            </Badge>
                          )}
                      </div>

                      <div className="mt-2 text-3xl font-bold text-[#1FA8A1]">
                        $
                        {plan.priceMonth.toLocaleString()}

                        <span className="text-sm text-gray-500">
                          /mo
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <ul className="mb-6 space-y-2">
                      {plan.features.map(
                        (
                          feature,
                          index
                        ) => (
                          <li
                            key={`${feature}-${index}`}
                            className="flex items-start text-sm"
                          >
                            <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-[#1FA8A1]" />

                            <span>
                              {
                                feature
                              }
                            </span>
                          </li>
                        )
                      )}
                    </ul>

                    {isCurrentPlan ? (
                      <Button
                        type="button"
                        className="w-full"
                        disabled
                      >
                        Current Plan
                      </Button>
                    ) : isFreePlan ? (
                      <Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Free Listing
                      </Button>
                    ) : disabledForSandbox ? (
                      <Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Disabled During
                        Sandbox Test
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="w-full bg-[#1FA8A1] hover:bg-[#178d87]"
                        onClick={() =>
                          handleSubscribe(
                            plan.id,
                            plan.name
                          )
                        }
                        disabled={
                          isLoading ||
                          !firmId
                        }
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                            Checking
                            Availability...
                          </>
                        ) : (
                          "Test Sandbox Checkout"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>
    );
  };