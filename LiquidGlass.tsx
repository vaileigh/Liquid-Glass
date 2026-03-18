import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    style?: React.CSSProperties
    borderRadius?: number
}

const componentId = "reflection-glass-styles"

function ensureStyles() {
    if (typeof document === "undefined") return
    if (document.getElementById(componentId)) return

    const style = document.createElement("style")
    style.id = componentId
    style.textContent = `
      @keyframes reflectionRippleSweep {
        0% { transform: translate3d(-14%, 0, 0) scale(1.18, 0.84); }
        50% { transform: translate3d(12%, 0, 0) scale(1.26, 0.8); }
        100% { transform: translate3d(-14%, 0, 0) scale(1.18, 0.84); }
      }

      @keyframes reflectionSpecularDrift {
        0% {
          transform: translate3d(-3%, -2%, 0) scale(0.98) rotate(-4deg);
          opacity: 0.56;
        }
        50% {
          transform: translate3d(3%, 2%, 0) scale(1.04) rotate(3deg);
          opacity: 0.74;
        }
        100% {
          transform: translate3d(-3%, -2%, 0) scale(0.98) rotate(-4deg);
          opacity: 0.56;
        }
      }

      @keyframes reflectionChromaticFloat {
        0% {
          transform: translate3d(-2%, 1%, 0) scale(0.98);
          opacity: 0.18;
        }
        50% {
          transform: translate3d(2%, -1%, 0) scale(1.04);
          opacity: 0.3;
        }
        100% {
          transform: translate3d(-2%, 1%, 0) scale(0.98);
          opacity: 0.18;
        }
      }

      @keyframes reflectionDriftHighlight {
        0% {
          transform: translate3d(-8%, 0, 0) scale(0.96, 1);
          opacity: 0.1;
        }
        50% {
          transform: translate3d(8%, 0, 0) scale(1.08, 0.88);
          opacity: 0.16;
        }
        100% {
          transform: translate3d(-8%, 0, 0) scale(0.96, 1);
          opacity: 0.1;
        }
      }
    `

    document.head.appendChild(style)
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 430
 * @framerIntrinsicHeight 300
 */
export default function LiquidGlass(props: Props) {
    const { style, borderRadius = 56 } = props

    React.useEffect(() => {
        ensureStyles()
    }, [])

    const sharedLayer: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        pointerEvents: "none",
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius,
                overflow: "hidden",
                isolation: "isolate",
                background: "rgba(8, 10, 16, 0.08)",
                boxShadow:
                    "0 22px 52px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -18px 28px rgba(0, 0, 0, 0.12)",
                ...style,
            }}
        >
            <div
                style={{
                    ...sharedLayer,
                    background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)), radial-gradient(48% 42% at 12% 10%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.06) 28%, rgba(255, 255, 255, 0) 62%), radial-gradient(42% 38% at 88% 88%, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.04) 26%, rgba(255, 255, 255, 0) 58%), radial-gradient(110% 86% at 50% 12%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.015) 24%, rgba(255, 255, 255, 0) 58%), radial-gradient(120% 110% at 50% 100%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 30%, rgba(255, 255, 255, 0) 66%)",
                    backdropFilter: "blur(10px) saturate(130%) contrast(1.18)",
                    WebkitBackdropFilter: "blur(10px) saturate(130%) contrast(1.18)",
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 3,
                    boxShadow:
                        "inset 18px 0 26px rgba(255, 255, 255, 0.055), inset -18px 0 24px rgba(255, 255, 255, 0.038), inset 0 16px 22px rgba(255, 255, 255, 0.055), inset 0 -18px 24px rgba(255, 255, 255, 0.038)",
                    filter: "blur(0.8px)",
                }}
            >
                <div
                    style={{
                        ...sharedLayer,
                        background:
                            "radial-gradient(30% 34% at 8% 8%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.12) 20%, rgba(255, 255, 255, 0.028) 42%, rgba(255, 255, 255, 0) 76%), radial-gradient(26% 30% at 94% 92%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.09) 18%, rgba(255, 255, 255, 0.024) 40%, rgba(255, 255, 255, 0) 74%), linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 26%, rgba(255, 255, 255, 0) 72%, rgba(255, 255, 255, 0.05))",
                        mixBlendMode: "screen",
                    }}
                />
                <div
                    style={{
                        ...sharedLayer,
                        inset: 6,
                        borderRadius: Math.max(borderRadius - 12, 0),
                        boxShadow:
                            "inset 14px 0 22px rgba(82, 160, 255, 0.075), inset -14px 0 22px rgba(255, 110, 190, 0.06), inset 0 10px 16px rgba(255, 255, 255, 0.04), inset 0 -10px 18px rgba(255, 255, 255, 0.03)",
                        opacity: 0.9,
                    }}
                />
            </div>
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 2,
                    inset: "-4%",
                    borderRadius: 50,
                    mixBlendMode: "soft-light",
                    background:
                        "repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0 6px, rgba(255, 255, 255, 0.008) 8px 20px, rgba(255, 255, 255, 0.025) 24px 30px, rgba(255, 255, 255, 0) 34px 56px)",
                    filter: "blur(7px)",
                    opacity: 0.08,
                    animation: "reflectionRippleSweep 5.2s linear infinite",
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 2,
                    inset: "-4%",
                    borderRadius: 50,
                    mixBlendMode: "soft-light",
                    background:
                        "repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0 4px, rgba(255, 255, 255, 0.01) 8px 16px, rgba(255, 255, 255, 0) 20px 42px)",
                    filter: "blur(12px)",
                    opacity: 0.08,
                    animation: "reflectionRippleSweep 6.8s linear infinite reverse",
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 2,
                    background:
                        "radial-gradient(64% 34% at 52% 84%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.028) 30%, rgba(255, 255, 255, 0) 68%)",
                    filter: "blur(18px)",
                    opacity: 0.14,
                    animation: "reflectionDriftHighlight 6.2s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 2,
                    boxShadow:
                        "inset 0 0 0 1px rgba(255, 255, 255, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 18px rgba(255, 255, 255, 0.04), inset 0 -10px 14px rgba(255, 255, 255, 0.02)",
                    background:
                        "radial-gradient(28% 16% at 14% 5%, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.16) 20%, rgba(255, 255, 255, 0) 64%), radial-gradient(24% 16% at 86% 95%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.12) 22%, rgba(255, 255, 255, 0) 60%)",
                    opacity: 0.94,
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 3,
                    boxShadow:
                        "inset 0 0 0 4px rgba(255, 255, 255, 0.09), inset 0 0 0 8px rgba(255, 255, 255, 0.03), inset 0 0 22px rgba(255, 255, 255, 0.03), inset 0 -12px 18px rgba(0, 0, 0, 0.08)",
                    filter: "blur(0.5px)",
                    opacity: 0.92,
                }}
            >
                <div
                    style={{
                        ...sharedLayer,
                        inset: "2px 4px 2px 0",
                        boxShadow:
                            "inset 4px 0 0 rgba(82, 160, 255, 0.16), inset 0 4px 0 rgba(82, 160, 255, 0.1), inset 12px 0 16px rgba(82, 160, 255, 0.06)",
                        filter: "blur(1.2px)",
                        opacity: 0.68,
                        mixBlendMode: "screen",
                    }}
                />
                <div
                    style={{
                        ...sharedLayer,
                        inset: "2px 0 2px 4px",
                        boxShadow:
                            "inset -4px 0 0 rgba(255, 110, 190, 0.14), inset 0 -4px 0 rgba(255, 110, 190, 0.08), inset -12px 0 16px rgba(255, 110, 190, 0.05)",
                        filter: "blur(1.2px)",
                        opacity: 0.62,
                        mixBlendMode: "screen",
                    }}
                />
            </div>
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 4,
                    background:
                        "radial-gradient(36% 18% at 18% 12%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.16) 18%, rgba(255, 255, 255, 0.03) 34%, rgba(255, 255, 255, 0) 56%), radial-gradient(28% 16% at 82% 88%, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.12) 20%, rgba(255, 255, 255, 0.024) 34%, rgba(255, 255, 255, 0) 54%)",
                    filter: "blur(10px)",
                    mixBlendMode: "screen",
                    opacity: 0.82,
                    animation: "reflectionSpecularDrift 6.8s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 4,
                    background:
                        "radial-gradient(34% 18% at 34% 46%, rgba(72, 150, 255, 0.16) 0%, rgba(72, 150, 255, 0.08) 24%, rgba(72, 150, 255, 0) 52%), radial-gradient(30% 16% at 64% 44%, rgba(255, 92, 184, 0.14) 0%, rgba(255, 92, 184, 0.07) 22%, rgba(255, 92, 184, 0) 52%)",
                    filter: "blur(18px)",
                    mixBlendMode: "screen",
                    opacity: 0.24,
                    animation: "reflectionChromaticFloat 7s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    ...sharedLayer,
                    zIndex: 5,
                    background:
                        "radial-gradient(16% 8% at 18% 11%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.58) 16%, rgba(255, 255, 255, 0.08) 34%, rgba(255, 255, 255, 0) 58%), radial-gradient(14% 8% at 82% 89%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.32) 18%, rgba(255, 255, 255, 0.06) 36%, rgba(255, 255, 255, 0) 58%)",
                    filter: "blur(0.8px)",
                    opacity: 0.7,
                }}
            />
        </div>
    )
}

addPropertyControls(LiquidGlass, {
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        min: 0,
        max: 200,
        defaultValue: 56,
        unit: "px",
    },
})
