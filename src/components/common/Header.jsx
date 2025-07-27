import React from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/icons/arrow-left.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import "./Header.css";

function Header({ title = "", type = "back", onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClose) {
      onClose();        
    } else {
      navigate(-1);     
    }
  };

  return (
    <div className="page-header">
      <button className="page-header-back" onClick={handleClick}>
        {type === "close" ? (
          <CloseIcon style={{ width: "24px", height: "24px" }} />
        ) : (
          <BackIcon style={{ width: "24px", height: "24px" }} />
        )}
      </button>
      {title && <h2 className="page-header-title">{title}</h2>}
    </div>
  );
}

export default Header;