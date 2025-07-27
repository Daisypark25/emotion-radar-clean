import { useState, useEffect } from "react";
import EmptyState from "../components/EmptyState";
import comingSoonImg from "../assets/images/careempty.png";
import "./ComingSoonPage.css"; 

function ComingSoonPage() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const isLoaded = dataLoaded && imageLoaded;

  return (
    <div className="container coming-soon">
      <div className="container-inner">
        <h2 className="page-title">Care</h2>
        <p className="page-description">
          When your heart needs more gentle care,<br /> 
          reach out to a professional therapist anytime.
        </p>

        {!isLoaded && (
          <div className="skeleton-list">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="skeleton-card" />
            ))}
          </div>
        )}

        {isLoaded && (
          <EmptyState 
            img={
              <img
                src={comingSoonImg}
                alt="Coming Soon"
                className="empty-state-img"
              />
            }
            message="We're preparing this for you 😊"
          />
        )}

        <img
          src={comingSoonImg}
          alt=""
          style={{ display: "none" }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    </div>
  );
}

export default ComingSoonPage;