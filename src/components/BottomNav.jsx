import { NavLink } from "react-router-dom";
import JournalIcon from "../assets/icons/journal.svg?react";
import EmotionsIcon from "../assets/icons/emotions.svg?react";
import CareIcon from "../assets/icons/care.svg?react";
import MyIcon from "../assets/icons/my.svg?react";
import "../styles/BottomNav.css";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <JournalIcon className="nav-icon" />
        <span>Journal</span>
      </NavLink>

      <NavLink to="/emotions" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <EmotionsIcon className="nav-icon" />
        <span>Emotions</span>
      </NavLink>

      <NavLink to="/comingsoon" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <CareIcon className="nav-icon" />
        <span>Care</span>
      </NavLink>

      <NavLink to="/my" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <MyIcon className="nav-icon" />
        <span>My</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;