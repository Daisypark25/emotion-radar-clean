import "../styles/EmptyState.css";

export default function EmptyState({ img, message }) {
  return (
    <div className="empty-state">
      {img && <div className="empty-state-img">{img}</div>}
      <p className="empty-state-text">{message}</p>
    </div>
  );
}