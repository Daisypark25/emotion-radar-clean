import { NavLink } from "react-router-dom";
import ScheduleIcon from "../../assets/icons/care.svg?react"; // 상담 스케줄 보기
import ClientsIcon from "../../assets/icons/care.svg?react";   // 내 내담자 목록
import MyIcon from "../../assets/icons/my.svg?react";            // 마이페이지
import "../../styles/BottomNav.css";

function TherapistBottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/therapist/schedule"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <ScheduleIcon className="nav-icon" />
        <span>Schedule</span>
      </NavLink>

      <NavLink
        to="/therapist/clients"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <ClientsIcon className="nav-icon" />
        <span>Clients</span>
      </NavLink>

      <NavLink
        to="/therapist/my"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <MyIcon className="nav-icon" />
        <span>My</span>
      </NavLink>
    </nav>
  );
}

export default TherapistBottomNav;