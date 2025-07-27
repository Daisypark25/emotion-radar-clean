import Input from "./common/Input/Input";
import Button from "./common/Button";
import "../styles/writeform.css";

function WriteForm({
  showInput = true,
  showTextarea = true,
  showButton = false,
  inputType = "text",
  inputValue,
  setInputValue,
  textareaValue,
  setTextareaValue,
  inputPlaceholder = "Please enter text",
  textareaPlaceholder = "Please enter details",
  onSubmit,
  submitText = "Submit"
}) {
  return (
    <div className="write-container">
      {showInput && inputValue !== undefined && setInputValue !== undefined && (
        <Input
          type={inputType}
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      )}

      {showTextarea && textareaValue !== undefined && setTextareaValue !== undefined && (
        <Input
          type="textarea"
          placeholder={textareaPlaceholder}
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          rows={25}
        />
      )}

      {showButton && (
        <Button
          type="primary"
          size="md"
          onClick={onSubmit}
          style={{ marginTop: "auto" }}
        >
          {submitText}
        </Button>
      )}
    </div>
  );
}

export default WriteForm;