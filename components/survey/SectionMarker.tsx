/** The small crosshair and numbered label above a major section heading. */
export function SectionMarker({
  index,
  label,
  align = "center",
}: {
  index: string;
  label: string;
  align?: "center" | "left";
}) {
  return (
    <p className={`section-marker ${align === "left" ? "is-left" : ""}`}>
      <span className="section-marker-cross" aria-hidden="true" />
      {index} / {label}
    </p>
  );
}
