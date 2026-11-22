/** The parts of the laser level. A `.tick-rule` parent positions them with --draw. */
export function LaserLayers() {
  return (
    <>
      <span className="laser-ticks" />
      <span className="laser-hot" />
      <span className="laser-beam" />
      <span className="laser-head" />
      <span className="laser-flash" />
    </>
  );
}
