import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="glow"></div>

      <nav>
        <div className="wrap">
          <div className="logo">
            <span className="logo-mark"></span>We Chat Us
          </div>
          <div className="nav-links">
          </div>
          <div className="nav-actions" style={{ display: "flex", gap: "10px" }}>
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero wrap">
        <div>
          <h1>
            Where conversations
            <br />
            <em>breathe.</em>
          </h1>
          <p>We Chat Us brings your closest people into one fluid space.</p>
          <div className="hero-ctas">
            <Link to="/signup" className="btn btn-primary">
              Get started — it's free
            </Link>
          </div>
        </div>

        <div className="constellation-wrap">
          <svg viewBox="0 0 420 420">
            <line className="node-line" x1="80" y1="90" x2="210" y2="180" />
            <line className="node-line" x1="210" y1="180" x2="340" y2="110" />
            <line className="node-line" x1="210" y1="180" x2="150" y2="300" />
            <line className="node-line" x1="210" y1="180" x2="320" y2="290" />
            <line className="node-line" x1="150" y1="300" x2="60" y2="260" />
            <line className="node-line" x1="320" y1="290" x2="360" y2="360" />
            <circle className="node pulse" cx="210" cy="180" r="20" fill="#8c7cff" />
            <circle className="node pulse pulse-d1 drift" cx="80" cy="90" r="12" fill="#d9bd93" />
            <circle className="node pulse pulse-d2 drift" cx="340" cy="110" r="9" fill="#5b52a8" />
            <circle className="node pulse pulse-d3 drift" cx="150" cy="300" r="14" fill="#8c7cff" />
            <circle className="node pulse pulse-d4 drift" cx="320" cy="290" r="10" fill="#d9bd93" />
            <circle className="node pulse pulse-d2 drift" cx="60" cy="260" r="7" fill="#5b52a8" />
            <circle className="node pulse pulse-d1 drift" cx="360" cy="360" r="8" fill="#8c7cff" />
          </svg>
        </div>
      </section>
    </div>
  );
}

export default Home;