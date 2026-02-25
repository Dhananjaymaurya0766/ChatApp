import "./Signup.css";
import { useState } from "react";
import axios from "axios";
function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    subscribe: false,
  });

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/register",
      {
        name: form.name,
        email: form.email,
        password: form.password
      }
    );

    alert(res.data.message);

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
        <h1>Sign up</h1>

        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input
            type="text"
            name="name"
            placeholder="Jon Snow"
            onChange={handleChange}
          />

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
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;