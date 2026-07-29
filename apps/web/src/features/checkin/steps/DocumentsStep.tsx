/**
 * DocumentsStep.tsx
 *
 * First check-in step. Shows the passenger the document/visa requirements
 * for their destination, pulled from Strapi's CheckinStep content type.
 * The actual wording differs by destination (e.g. domestic vs international)
 * so this component just renders whatever content it's given — it doesn't
 * decide the wording itself.
 */

interface DocumentsStepProps {
  title: string;
  body: string;
  requiresVisa: boolean;
  onConfirm: () => void; // called when passenger confirms they meet the requirement
}

export function DocumentsStep({
  title,
  body,
  requiresVisa,
  onConfirm,
}: DocumentsStepProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{body}</p>
      {/* Only show a visa-specific checkbox if this destination actually requires one */}
      {requiresVisa && (
        <label style={{ display: "block", margin: "1rem 0" }}>
          <input type="checkbox" required /> I confirm my visa has been approved
        </label>
      )}
      <button onClick={onConfirm}>Continue</button>
    </div>
  );
}
