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
  getMarketByName,
  getMarketForPracticeArea,
} from "@/data/platformModel";

import {
  isSelfServicePlanId,
} from "@/config/selfServicePlans";

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
 * Expert uses the deployed create-checkout
 * Edge Function with Stripe test credentials.
 *
 * Category Featured remains availability-controlled
 * and is not enabled for self-service checkout.
 */
const SANDBOX_MODE = true;

const PLAN_LABELS: Record<string, string> = {
  free: "Free Listing",
  expert: "Expert",
  "category-featured": "Category Featured",
  "category-exclusive": "Market Exclusive",
};

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

const resolveLegalMarketName = (
  value: unknown
): string => {
  const rawValue = String(
    value ?? ""
  ).trim();

  if (!rawValue) {
    return "";
  }

  return (
    getMarketByName(
      rawValue
    )?.name ||
    getMarketForPracticeArea(
      rawValue
    )?.name ||
    rawValue
  );
};

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
      selectedMarket,
      setSelectedMarket,
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
     * Load the selected legal market
     * preserved from signup.
     *
     * The localStorage key names are
     * intentionally retained for
     * checkout compatibility.
     */
    useEffect(() => {
      const storedMarket =
        resolveLegalMarketName(
          localStorage.getItem(
            "selected-firm-practice-area"
          ) ||
            localStorage.getItem(
              "pending-checkout-practice-area"
            ) ||
            ""
        );

      setSelectedMarket(
        storedMarket
      );

      if (storedMarket) {
        localStorage.setItem(
          "selected-firm-practice-area",
          storedMarket
        );

        localStorage.setItem(
          "pending-checkout-practice-area",
          storedMarket
        );
      }
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
           * recover the legal market
           * directly from the firm row.
           *
           * Older rows may contain a
           * specialty or legacy category,
           * so normalize it through the
           * canonical taxonomy first.
           */
          if (
            !selectedMarket
          ) {
            const recoveredMarket =
              resolveLegalMarketName(
                data.primary_category ||
                  data.category ||
                  ""
              );

            if (
              recoveredMarket
            ) {
              setSelectedMarket(
                recoveredMarket
              );

              localStorage.setItem(
                "selected-firm-practice-area",
                recoveredMarket
              );

              localStorage.setItem(
                "pending-checkout-practice-area",
                recoveredMarket
              );
            }
          }
        };

      void loadFirm();
    }, [
      user,
      selectedMarket,
    ]);

    const checkAvailability =
      async (
        planName: string
      ): Promise<boolean> => {
        if (
          planName !==
            "Category Featured"
        ) {
          return true;
        }

        if (
          !selectedMarket
        ) {
          setAvailabilityError(
            "No primary legal market was found for this signup."
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

                      market:
                        selectedMarket,
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

    const handleSubscribe =
      async (
        planId: string,
        planName: string
      ) => {
        setAvailabilityError("");
        setFirmError("");

        if (planId === "free") {
          toast({
            title: "Free Listing",
            description:
              "Your firm already has access to the free listing plan.",
          });
          return;
        }

        if (planId === "category-featured") {
          toast({
            title: "Category Featured requires availability review",
            description:
              "Category Featured placement is not available for self-service checkout. Submit an availability request before premium placement can be activated.",
          });
          return;
        }

        if (SANDBOX_MODE && planId !== "expert") {
          toast({
            title: "Sandbox testing active",
            description:
              "Only the Expert plan is enabled for Stripe Sandbox checkout right now.",
          });
          return;
        }

        if (!firmId) {
          setFirmError(
            "Your firm profile is still loading. Please wait a moment and try again."
          );
          return;
        }

        if (!selectedMarket) {
          setAvailabilityError(
            "No legal market is connected to this firm."
          );
          return;
        }

        setLoadingPlan(planId);

        const available =
          await checkAvailability(planName);

        if (!available) {
          setLoadingPlan(null);
          return;
        }

        if (planId === "expert") {
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
            selectedMarket
          );
          localStorage.setItem(
            "pending-checkout-firm-id",
            firmId
          );
          localStorage.setItem(
            "pending-checkout-started-at",
            new Date().toISOString()
          );

          try {
            const { data, error } =
              await supabase.functions.invoke(
                "create-checkout",
                {
                  body: {
                    planKey: planId,
                    firmId,
                    userId: user?.id,
                  },
                }
              );

            if (error) {
              throw error;
            }

            if (!data?.url) {
              throw new Error(
                "Stripe checkout did not return a checkout URL."
              );
            }

            window.location.href = data.url;
            return;
          } catch (error) {
            console.error(
              "Unable to start Expert checkout:",
              error
            );

            const message =
              error instanceof Error
                ? error.message
                : "Unable to start Stripe checkout.";

            setFirmError(message);

            toast({
              title: "Checkout unavailable",
              description: message,
              variant: "destructive",
            });

            setLoadingPlan(null);
            return;
          }
        }

        setLoadingPlan(null);
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

          <div className="mt-4 rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">
              Current Plan
            </p>

            <div className="mt-1">
              <Badge className="bg-[#1FA8A1] text-white hover:bg-[#1FA8A1]">
                {PLAN_LABELS[currentPlan] || currentPlan}
              </Badge>
            </div>

            {(currentPlan === "category-featured" ||
              currentPlan === "category-exclusive") &&
              selectedMarket && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentPlan === "category-exclusive"
                      ? "Market Exclusive"
                      : "Featured Legal Market"}
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#0F2A43]">
                    {selectedMarket}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Your{" "}
                    {PLAN_LABELS[currentPlan] || currentPlan} placement
                    applies to this legal market only. Other practice areas
                    listed on your firm profile remain profile practice areas
                    and do not receive this premium market placement.
                  </p>
                </div>
              )}

            {currentPlan !== "category-featured" &&
              currentPlan !== "category-exclusive" &&
              selectedMarket && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Primary Legal Market
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedMarket}
                  </p>
                </div>
              )}
          </div>
        </div>

        {SANDBOX_MODE && (
          <Alert className="border-amber-300 bg-amber-50">
            <TestTube2 className="h-4 w-4" />

            <AlertDescription>
              Sandbox testing is
              active. Expert will use
              the Stripe test checkout.
              No real $299 charge will
              be made. Category Featured
              remains availability-controlled.
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
          {plans.filter((plan) => isSelfServicePlanId(plan.id)).map(
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

              const isSandboxExpert =
                plan.id ===
                "expert";

              const isFeaturedPlan =
                plan.id ===
                "category-featured";

              const disabledForSandbox =
                SANDBOX_MODE &&
                !isFreePlan &&
                !isSandboxExpert;

              return (
                <Card
                  key={
                    plan.id
                  }
                  className={
                    isCurrentPlan
                      ? "border-2 border-[#1FA8A1]"
                      : isSandboxExpert
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

                        {isSandboxExpert &&
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
                    ) : isFeaturedPlan ? (
                      <Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Availability Review Required
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

                            Starting
                            Checkout...
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