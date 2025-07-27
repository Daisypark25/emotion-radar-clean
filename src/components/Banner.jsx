import "../styles/Banner.css";

export default function Banner({ background, icon, title, text }) {
  return (
    <div
      className="banner"
      style={{ background }}
    >
      <div className="banner-left">
        {icon}
      </div>
      <div className="banner-right">
        {title && <h3 className="banner-title">{title}</h3>}
        <p className="banner-text">{text}</p>
      </div>
    </div>
  );
}