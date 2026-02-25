import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome 👋</h1>
        <p>Authentication System Built with MERN Stack</p>

        <div className="home-buttons">
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>

          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;