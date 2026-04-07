import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <div className="logo">🚀</div>

        <h1>Welcome 👋</h1>
        <p>Authentication System Built with MERN Stack</p>

        <div className="home-buttons">
          <Link to="/login" className="link">
            <button className="btn login-btn">Log In</button>
          </Link>

          <Link to="/signup" className="link">
            <button className="btn signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;