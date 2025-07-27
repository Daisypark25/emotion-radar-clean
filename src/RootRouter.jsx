import { useLocation } from "react-router-dom";
import MainApp from "./MainApp";
import TherapistApp from "./TherapistApp";

function RootRouter() {
  const location = useLocation();


  const isTherapistRoute = location.pathname.startsWith("/therapist");

  return isTherapistRoute ? <TherapistApp /> : <MainApp />;
}

export default RootRouter;