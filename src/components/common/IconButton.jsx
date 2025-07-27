import React from "react";
import "./IconButton.css";

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32
};

export default function IconButton({ onClick, children, ariaLabel, color = "#222", size = "md" }) {
  const pixelSize = sizeMap[size] || sizeMap.md;

  return (
    <button
      className="icon-button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ color }}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            width: pixelSize,
            height: pixelSize,
            fill: "currentColor"
          })
        : children}
    </button>
  );
}