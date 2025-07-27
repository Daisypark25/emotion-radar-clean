import { useEffect, useState } from "react";
import "../styles/FloatingButton.css";
import Button from "./common/Button";

function FloatingButton({ 
  text = "Label", 
  onClick, 
  loading = false, 
  disabled = false,
  hasBottomNav = false,
  small = false,
  variant,
  backgroundColor = "#111", 
  textColor = "#FFFFFF",
  type = "primary"      
}) {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

  return (
    <div 
      className={`floating-button-wrapper 
        ${hasBottomNav ? "has-bottom-nav" : ""} 
        ${small ? "small" : ""} 
        ${variant === "input" ? "input-bar" : ""} 
        ${isStandalone ? "standalone" : ""}`
      }
    >
      {variant === "input" ? (
        <span 
          style={{ color: textColor }}
          onClick={onClick} 
        >
          {text}
        </span>
      ) : (
        <Button
          type={type}       
          size="md"
          onClick={onClick}
          loading={loading}
          disabled={disabled}
          style={{
            width: small ? "auto" : "100%",
            minHeight: "3.25rem",
            ...(type === "primary" && {
              background: backgroundColor,
              color: textColor
            })
          }}
        >
          {text}
        </Button>
      )}
    </div>
  );
}

export default FloatingButton;