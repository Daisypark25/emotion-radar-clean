import { useState, useEffect } from "react";
import "./LoginModal.css";
import LoginForm from "../../components/LoginForm";

function LoginModal({ onClose, onSuccess }) {
  return (
    <div className="login-modal-inner">
      <LoginForm onSuccess={onSuccess} />
    </div>
  );
}

export default LoginModal;