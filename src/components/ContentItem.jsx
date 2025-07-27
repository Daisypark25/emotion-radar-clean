import "../styles/ContentItem.css";

function ContentItem({ icon, title, description }) {
  return (
    <div className="content-item">
      {icon && <div className="content-item-icon">{icon}</div>}
      <div className="content-item-text">
        {title && <h3 className="content-item-title">{title}</h3>}
        {description && <p className="content-item-description">{description}</p>}
      </div>
    </div>
  );
}

export default ContentItem;