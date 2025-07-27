import "../styles/InputBar.css";

function InputBar({ onClick, placeholder = "Write something..." }) {
  return (
    <div className="input-bar" onClick={onClick}>
      {placeholder}
    </div>
  );
}

export default InputBar;