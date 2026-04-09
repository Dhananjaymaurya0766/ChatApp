import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "https://chatapp-vxkf.onrender.com/login",
      {
        email: form.email,
        password: form.password
      }
    );

    localStorage.setItem("token", res.data.token);

    alert(res.data.message);

    // Redirect to chat
    navigate("/chat");

  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Server not reachable");
    }
  }
};

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Log in</h1>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••"
            onChange={handleChange}
          />

          <div className="checkbox-row">
            <input
              type="checkbox"
              name="subscribe"
              onChange={handleChange}
            />
            <span>I want to receive updates via email.</span>
          </div>

          <button type="submit" className="signup-btn">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;