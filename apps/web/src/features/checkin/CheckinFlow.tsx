/**
 * CheckinFlow.tsx
 *
 * Controls the multi-step check-in flow: tracks which step the passenger is
 * on, fetches step content from Strapi, and moves between Documents ->
 * Baggage -> Review. On completion, it hands off to seat selection via
 * onCheckinComplete.
 */

import { useEffect, useState } from "react";
import { strapiClient } from "../../api/strapiClient";
import { useBooking } from "../../context/BookingContext";
import { ProgressIndicator } from "./ProgressIndicator";
import { DocumentsStep } from "./steps/DocumentsStep";
import { BaggageStep } from "./steps/BaggageStep";
import { ReviewStep } from "./steps/ReviewStep";

// Shape of a CheckinStep entry as returned from Strapi
interface CheckinStepContent {
  stepKey: string;
  order: number;
  title: string;
  body: string;
  destinationCountry: string | null;
  requiresVisa: boolean;
}

interface CheckinFlowProps {
  destinationCountry: string; // used to pick the right documents step content
  onCheckinComplete: () => void;
}

// Three real screens the passenger moves through, in order.
// "review" isn't in Strapi since it's just a summary of local state.
const STEP_ORDER = ["documents", "baggage", "review"] as const;
type StepName = (typeof STEP_ORDER)[number];

export function CheckinFlow({
  destinationCountry,
  onCheckinComplete,
}: CheckinFlowProps) {
  const { state, dispatch } = useBooking();
  const [stepsContent, setStepsContent] = useState<CheckinStepContent[]>([]);
  const [currentStep, setCurrentStep] = useState<StepName>("documents");
  const [checkedBags, setCheckedBags] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all check-in step content once when the flow mounts
  useEffect(() => {
    strapiClient
      .getCheckinSteps()
      .then((data) => setStepsContent(data as CheckinStepContent[]))
      .catch((err) => console.error("Failed to load check-in steps:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading check-in steps...</p>;
  }

  // Pick the right documents content for this destination (domestic vs
  // international) — falls back to the first documents-* entry if no exact match
  const documentsContent =
    stepsContent.find(
      (s) =>
        s.stepKey.startsWith("documents") &&
        s.destinationCountry === destinationCountry,
    ) ?? stepsContent.find((s) => s.stepKey.startsWith("documents"));

  const baggageContent = stepsContent.find((s) => s.stepKey === "baggage");

  const currentStepIndex = STEP_ORDER.indexOf(currentStep) + 1; // 1-indexed for display

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
      <ProgressIndicator
        currentStep={currentStepIndex}
        totalSteps={STEP_ORDER.length}
      />

      {currentStep === "documents" && documentsContent && (
        <DocumentsStep
          title={documentsContent.title}
          body={documentsContent.body}
          requiresVisa={documentsContent.requiresVisa}
          onConfirm={() => {
            dispatch({
              type: "COMPLETE_STEP",
              stepKey: documentsContent.stepKey,
            });
            setCurrentStep("baggage");
          }}
        />
      )}

      {currentStep === "baggage" && baggageContent && (
        <BaggageStep
          title={baggageContent.title}
          body={baggageContent.body}
          onConfirm={(bags) => {
            setCheckedBags(bags);
            dispatch({
              type: "COMPLETE_STEP",
              stepKey: baggageContent.stepKey,
            });
            setCurrentStep("review");
          }}
        />
      )}

      {currentStep === "review" && (
        <ReviewStep
          passengerName={state.passenger?.name ?? "Guest"}
          checkedBags={checkedBags}
          onComplete={onCheckinComplete}
        />
      )}
    </div>
  );
}
