import { useState, useEffect } from "react";
import "./PasswordInput.css";

function PasswordInput({ value, onChange, resetTrigger }) {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setIsFocused(false);
  }, [resetTrigger]);

  const conditions = {
    length: value.length >= 8,
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*]/.test(value),
  };

  const allValid = Object.values(conditions).every(Boolean);

  const handleFocus = () => {
    setIsFocused(true);
    setError("");
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!allValid) {
      setError("Please meet all password requirements.");
    }
  };

  return (
    <div className="input-wrapper">
      <input
        type="password"
        placeholder="Password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`input-field ${
          value && !allValid && !isFocused ? "input-error" : ""
        }`}
        required
      />

      {isFocused && (
        <ul className="password-conditions">
          <li className={conditions.length ? "valid" : "invalid"}>
            {conditions.length ? "✔" : "❌"} At least 8 characters
          </li>
          <li className={conditions.number ? "valid" : "invalid"}>
            {conditions.number ? "✔" : "❌"} Contains a number
          </li>
          <li className={conditions.special ? "valid" : "invalid"}>
            {conditions.special ? "✔" : "❌"} Contains a special character
          </li>
        </ul>
      )}

      {!isFocused && error && (
        <div className="input-error-message">{error}</div>
      )}
    </div>
  );
}

export default PasswordInput;