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

    const [
      openingBillingPortal,
      setOpeningBillingPortal,
    ] = useState(false);

    const [planRequests, setPlanRequests] = useState<{
      id: string;
      requested_plan: string;
      status: string;
      created_at: string;
    }[]>([]);
    const [requestBusy, setRequestBusy] = useState(false);
    const [requestsReady, setRequestsReady] = useState(false);
    const [requestError, setRequestError] = useState("");

    const [billingConnection, setBillingConnection] = useState<"loading" | "connected" | "unconnected" | "unavailable">("loading");

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

    useEffect(() => {
      let cancelled = false;
      if (!user || !firmId || currentPlan === "free") {
        setBillingConnection("loading");
        return;
      }
      setBillingConnection("loading");
      void (async () => {
        try {
          const { data, error } = await supabase.functions.invoke("create-billing-portal", {
            body: { firmId, action: "status" },
          });
          if (error) throw error;
          if (!data || typeof data.connected !== "boolean") {
            throw new Error("Unexpected billing status response");
          }
          if (!cancelled) setBillingConnection(data.connected ? "connected" : "unconnected");
        } catch (error) {
          console.error("Unable to check billing connection:", error);
          if (!cancelled) setBillingConnection("unavailable");
        }
      })();
      return () => { cancelled = true; };
    }, [user, firmId, currentPlan]);

    const refreshPlanRequests = async () => {
      if (!supabase || !firmId) return;

      const { data, error } = await supabase.rpc(
        "get_firm_plan_change_requests",
        { p_firm_id: firmId }
      );

      if (error) {
        setRequestsReady(false);
        setRequestError(error.message);
        return;
      }

      setPlanRequests(data || []);
      setRequestsReady(true);
      setRequestError("");
    };

    useEffect(() => {
      setPlanRequests([]);
      setRequestsReady(false);
      if (user && firmId) void refreshPlanRequests();
    }, [user, firmId]);

    const pendingRequest = planRequests.find(
      (request) => request.status === "pending"
    );

    const handlePlanRequest = async (planId: string) => {
      if (!supabase || !firmId || !user || requestBusy ||
          !requestsReady || pendingRequest) return;

      const label = PLAN_LABELS[planId] || planId;

      if (!window.confirm(
        `Submit a request to change your membership to ${label}? Your current membership remains active until the change is completed.`
      )) return;

      setRequestBusy(true);
      setRequestError("");

      try {
        const { data, error } = await supabase.rpc(
          "request_firm_plan_change",
          {
            p_firm_id: firmId,
            p_requested_plan: planId,
          }
        );

        if (error) throw error;
        if (!data) throw new Error("Request was not confirmed.");

        toast({
          title: "Plan change requested",
          description: `Your ${label} request has been submitted. No payment has been taken.`,
        });

        await refreshPlanRequests();
      } catch (error) {
        setRequestError(
          (error as { message?: string }).message ||
          "Unable to submit plan change."
        );
      } finally {
        setRequestBusy(false);
      }
    };

    const cancelPlanRequest = async (requestId: string) => {
      if (!supabase || requestBusy) return;
      if (!window.confirm("Cancel this pending plan change?")) return;

      setRequestBusy(true);
      setRequestError("");

      try {
        const { data, error } = await supabase.rpc(
          "resolve_firm_plan_change_request",
          {
            p_request_id: requestId,
            p_status: "cancelled",
          }
        );

        if (error) throw error;
        if (!data) throw new Error("Cancellation was not confirmed.");

        toast({ title: "Plan change request cancelled" });
        await refreshPlanRequests();
      } catch (error) {
        setRequestError(
          (error as { message?: string }).message ||
          "Unable to cancel request."
        );
      } finally {
        setRequestBusy(false);
      }
    };

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

        if (
          planId === "expert" &&
          currentPlan !== "free"
        ) {
          setFirmError(
            "Your firm already has a subscription or premium placement. Contact support to request billing changes."
          );
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

    const handleManageBilling = async () => {
      if (!firmId || !user || openingBillingPortal) return;

      setFirmError("");
      setOpeningBillingPortal(true);

      try {
        if (!supabase) {
          throw new Error("Billing service is unavailable.");
        }

        const { data, error } = await supabase.functions.invoke(
          "create-billing-portal",
          { body: { firmId } }
        );

        if (error) {
          let serverMessage = "";
          const context = (error as { context?: Response }).context;
          if (context && typeof context.json === "function") {
            try {
              const payload = await context.json();
              if (typeof payload?.error === "string") serverMessage = payload.error;
            } catch { /* Preserve original error if the response is not JSON. */ }
          }
          throw new Error(serverMessage || error.message);
        }
        if (typeof data?.url !== "string") {
          throw new Error("Stripe did not return a billing portal URL.");
        }

        const portalUrl = new URL(data.url);
        if (
          portalUrl.protocol !== "https:" ||
          (portalUrl.hostname !== "stripe.com" &&
            !portalUrl.hostname.endsWith(".stripe.com"))
        ) {
          throw new Error("The billing portal returned an invalid URL.");
        }

        window.location.assign(portalUrl.toString());
      } catch (error) {
        console.error("Unable to open billing portal:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Unable to open billing management. Please try again.";
        setFirmError(message);
        toast({
          title: "Billing management unavailable",
          description: message,
          variant: "destructive",
        });
      } finally {
        setOpeningBillingPortal(false);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">
              Subscription Management
            </h2>

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

            {currentPlan !== "free" && billingConnection === "connected" && (
              <div className="mt-4 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleManageBilling()}
                  disabled={!firmId || openingBillingPortal}
                >
                  {openingBillingPortal ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening Billing...
                    </>
                  ) : (
                    "Manage Billing"
                  )}
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  View invoices and manage payment methods through Stripe.
                  Plan changes require approval from our team.
                </p>
              </div>
            )}

            {currentPlan !== "free" && billingConnection !== "connected" && (
              <div className="mt-4 border-t pt-4 text-sm text-gray-600">
                {billingConnection === "loading"
                  ? "Checking billing connection..."
                  : billingConnection === "unconnected"
                    ? "Your premium placement remains active. Use the plan options below to request a membership change."
                    : "Billing connection status is temporarily unavailable. Please refresh to try again."}
              </div>
            )}

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

        {requestError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{requestError}</AlertDescription>
          </Alert>
        )}

        {pendingRequest && (
          <Card className="border-[#1FA8A1]">
            <CardHeader>
              <CardTitle>Pending Plan Change</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Requested plan:{" "}
                <strong>
                  {PLAN_LABELS[pendingRequest.requested_plan] ||
                    pendingRequest.requested_plan}
                </strong>
              </p>
              <p className="text-sm text-gray-600">
                Your request is being reviewed. Your existing
                membership remains active until the change is completed.
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={requestBusy}
                onClick={() => void cancelPlanRequest(pendingRequest.id)}
              >
                Cancel Request
              </Button>
            </CardContent>
          </Card>
        )}

        {planRequests.filter((request) => request.status !== "pending").length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Plan Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {planRequests.filter((request) => request.status !== "pending").slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b py-2 text-sm">
                  <span>{PLAN_LABELS[request.requested_plan] || request.requested_plan}</span>
                  <Badge variant="outline">{request.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
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

              const isFeaturedPlan =
                plan.id ===
                "category-featured";

              return (
                <Card
                  key={
                    plan.id
                  }
                  className={isCurrentPlan ? "border-2 border-[#1FA8A1]" : ""}
                >
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold">
                          {
                            plan.name
                          }
                        </span>

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
                    ) : isFreePlan || isFeaturedPlan || currentPlan !== "free" ? (
                      <Button
                        type="button"
                        className="w-full bg-[#1FA8A1] hover:bg-[#178d87]"
                        disabled={!firmId || !requestsReady || requestBusy || !!pendingRequest || !!loadingPlan}
                        onClick={() => void handlePlanRequest(plan.id)}
                      >
                        {pendingRequest?.requested_plan === plan.id
                          ? "Request Pending"
                          : requestBusy
                            ? "Processing..."
                            : isFreePlan
                              ? "Request Switch to Free"
                              : isFeaturedPlan
                                ? "Request Featured Placement"
                                : "Request Switch to Expert"}
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
                          !firmId ||
                          !requestsReady ||
                          requestBusy ||
                          !!pendingRequest
                        }
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                            Starting
                            Checkout...
                          </>
                        ) : (
                          "Subscribe to Expert"
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