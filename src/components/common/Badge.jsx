import "./Badge.css";

export default function Badge({ 
  text = "Badge", 
  backgroundColor = "#f1eaff", 
  textColor = "#7b4df3" 
}) {
  return (
    <div 
      className="badge"
      style={{
        backgroundColor,
        color: textColor
      }}
    >
      {text}
    </div>
  );
}