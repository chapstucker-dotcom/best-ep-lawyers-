import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { plans } from "@/data/plans";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/*
 * SANDBOX TEST MODE
 *
 * Category Featured uses Stripe Sandbox.
 * Other paid plans are temporarily disabled
 * here so we cannot accidentally open a
 * live checkout while testing.
 */
const CATEGORY_FEATURED_SANDBOX_URL =
  "https://buy.stripe.com/test_28EfZg8ssgM82Ce54RaVa02";

const SANDBOX_MODE = true;

const normalizePlan = (
  value: unknown
): string =>
  String(value ?? "free")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

export const Subscription = () => {
  const [currentPlan, setCurrentPlan] =
    useState("free");

  const [
    selectedPracticeArea,
    setSelectedPracticeArea,
  ] = useState("");

  const [
    loadingPlan,
    setLoadingPlan,
  ] = useState<string | null>(null);

  const [availabilityError, setAvailabilityError] =
    useState("");

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const storedPracticeArea =
      localStorage.getItem(
        "selected-firm-practice-area"
      ) || "";

    setSelectedPracticeArea(
      storedPracticeArea
    );
  }, []);

  useEffect(() => {
    const loadCurrentPlan =
      async () => {
        if (!user) return;

        const { data, error } =
          await supabase
            .from("firms")
            .select(
              "plan, plan_key"
            )
            .eq(
              "user_id",
              user.id
            )
            .maybeSingle();

        if (error) {
          console.error(
            "Unable to load current subscription plan:",
            error
          );

          return;
        }

        if (!data) {
          setCurrentPlan("free");
          return;
        }

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
      };

    void loadCurrentPlan();
  }, [user]);

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
          "No primary practice area was found for this signup. Return to plan signup and select a practice area first."
        );

        return false;
      }

      try {
        const response =
          await fetch(
            "/api/check-plan-availability",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                plan: planName,
                category:
                  selectedPracticeArea,
              }),
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
      if (
        planId === "free"
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
       * During Sandbox testing,
       * prevent accidental live
       * purchases of other plans.
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

      setLoadingPlan(
        planId
      );

      setAvailabilityError(
        ""
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
          "pending-checkout-started-at",
          new Date().toISOString()
        );

        window.location.href =
          CATEGORY_FEATURED_SANDBOX_URL;

        return;
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

        <p className="mt-2 text-gray-600">
          Current Plan:{" "}
          <Badge className="bg-[#1FA8A1]">
            {currentPlan}
          </Badge>
        </p>

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

      {availabilityError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />

          <AlertDescription>
            {availabilityError}
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
                key={plan.id}
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
                        isLoading
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