import { forwardRef } from "react";
import "../styles/DropdownMenu.css";

const DropdownMenu = forwardRef(function DropdownMenu({ options }, ref) {
  return (
    <div className="dropdown-menu" ref={ref}>
      {options.map((option, idx) => (
        <div key={idx} className="dropdown-item" onClick={option.onClick}>
          {option.icon && (
            <span className="dropdown-icon">{option.icon}</span>
          )}
          <span className="dropdown-label">{option.label}</span>
        </div>
      ))}
    </div>
  );
});

export default DropdownMenu;