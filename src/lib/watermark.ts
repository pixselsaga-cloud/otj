export interface WatermarkConfig {
  text: string;
  position: "BOTTOM_RIGHT" | "CENTER" | "TILED" | "BOTTOM_LEFT";
  opacity: number;
  size: number;
  enabled: boolean;
}

export const defaultWatermarkConfig: WatermarkConfig = {
  text: "OTAJON JAHONGIROV STUDIO",
  position: "BOTTOM_RIGHT",
  opacity: 0.35,
  size: 16,
  enabled: true,
};

export function getWatermarkStyle(config: Partial<WatermarkConfig> = {}) {
  const current = { ...defaultWatermarkConfig, ...config };
  if (!current.enabled) return { display: "none" };

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    color: "#ffffff",
    opacity: current.opacity,
    fontSize: `${current.size}px`,
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "var(--font-mono), monospace",
    zIndex: 20,
    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
  };

  switch (current.position) {
    case "CENTER":
      return {
        ...baseStyle,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-20deg)",
        fontSize: `${current.size * 1.5}px`,
      };
    case "BOTTOM_LEFT":
      return {
        ...baseStyle,
        bottom: "16px",
        left: "16px",
      };
    case "TILED":
      return {
        ...baseStyle,
        inset: 0,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        alignItems: "center",
        justifyItems: "center",
        transform: "rotate(-25deg)",
      };
    case "BOTTOM_RIGHT":
    default:
      return {
        ...baseStyle,
        bottom: "16px",
        right: "16px",
      };
  }
}
