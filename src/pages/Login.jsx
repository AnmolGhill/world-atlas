import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/styles.css"; // CSS File Connection

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ NEW: loading state

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("userEmail")) {
      navigate("/");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    let valid = true;

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(form.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true); // ✅ Start loading

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "❌ Login failed");
        return;
      }

      localStorage.setItem("userEmail", result.email);
      localStorage.setItem("userName", result.name);
      localStorage.setItem("loginExpiry", (Date.now() + 10 * 24 * 60 * 60 * 1000).toString());

      toast.success("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
