import { useEffect } from "react";
import "./Input.css";

function Input({
  type = "text",
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  resetTrigger,
  required,
  rows = 4 // textarea일 때 기본 rows
}) {
  useEffect(() => {
    // resetTrigger 바뀔 때 input 내부 상태 초기화 필요하다면 여기에
  }, [resetTrigger]);

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}

      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          className={`input-field ${error ? "input-error" : ""}`}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          className={`input-field ${error ? "input-error" : ""}`}
          required={required}
        />
      )}

      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
}

export default Input;