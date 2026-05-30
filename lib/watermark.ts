export function addWatermarkStyle(): React.CSSProperties {
  return {
    position: "relative",
  };
}

export const WATERMARK_TEXT = "HEROMINT PREVIEW";

// CSS-based watermark overlay for client-side rendering
export function getWatermarkCSSProperties(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 10,
  };
}
