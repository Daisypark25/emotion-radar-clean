import "./Button.css";
import Loading from "./Loading";

function Button({ type = "primary", size = "md", children, loading, icon, ...props }) {
  return (
    <button
      className={`btn ${type}-btn ${size}-btn ${loading ? "loading" : ""}`}
      {...props}
      disabled={loading}
    >
      {loading ? (
        <Loading small />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;