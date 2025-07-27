import "./Toast.css";

export default function Toast({ title, description, children, onClose }) {
  return (
    <div className="toast">
      <div className="toast-text">
        <strong className="toast-title">{title}</strong>
        <p className="toast-description">{description}</p>
      </div>
      {children && <div className="toast-actions">{children}</div>}
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}