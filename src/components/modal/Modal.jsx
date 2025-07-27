import { IoClose } from "react-icons/io5";
import Button from "../common/Button"; 
import "./Modal.css";

function Modal({
  onClose,
  title,
  description,
  children,
  primaryButton,
  secondaryButton,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <IoClose size={24} />
        </button>

        {title && <h2 className="modal-title">{title}</h2>}
        {description && <p className="modal-description">{description}</p>}

        <div className="modal-body">{children}</div>

        {(primaryButton || secondaryButton) && (
          <div className="modal-actions">
          {secondaryButton && (
            <Button
              type="secondary"
              size="md"
              onClick={secondaryButton.onClick}
              loading={secondaryButton.loading}
            >
              {secondaryButton.label}
            </Button>
          )}
          {primaryButton && (
            <Button
              type="primary"
              size="md"
              onClick={primaryButton.onClick}
              loading={primaryButton.loading}
            >
              {primaryButton.label}
            </Button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export default Modal;