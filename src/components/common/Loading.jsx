import "./Loading.css";

function Loading({ text, small = false }) {
  return (
    <div className={`loading-container ${small ? "small" : ""}`}>
      <div className="loader">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default Loading;