import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/styles.css"; // CSS File Connection

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    repassword: ""
  });

  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("userEmail")) {
      navigate("/");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    let valid = true;

    const namePattern = /^[A-Z][a-z]{2,}( [A-Z][a-z]{2,}){0,3}$/;
    if (!namePattern.test(form.name)) {
      newErrors.name = "Name must start with a capital and have at least 3 letters";
      valid = false;
    }

    const age = parseInt(form.age);
    if (isNaN(age) || age < 17 || age > 46) {
      newErrors.age = "Age must be between 17 and 46";
      valid = false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(form.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
    if (!passwordPattern.test(form.password)) {
      newErrors.password = "Password must be 6+ characters, include number & symbol";
      valid = false;
    }

    if (form.password !== form.repassword) {
      newErrors.repassword = "Passwords do not match";
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

    try {
      const response = await fetch("https://world-atlas-93zd.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: form.age,
          email: form.email,
          password: form.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "❌ Registration failed");
        return;
      }

      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("userName", form.name);
      localStorage.setItem("loginExpiry", (Date.now() + 10 * 24 * 60 * 60 * 1000).toString());

      toast.success("✅ Registration successful! Redirecting...");

      // Reset form
      setForm({
        name: "",
        age: "",
        email: "",
        password: "",
        repassword: ""
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("❌ Registration error:", err);
      toast.error("❌ Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Register</h2>

        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        {errors.age && <p className="error">{errors.age}</p>}

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

        <label htmlFor="repassword">Confirm Password</label>
        <input
          type="password"
          name="repassword"
          placeholder="••••••••"
          value={form.repassword}
          onChange={handleChange}
        />
        {errors.repassword && <p className="error">{errors.repassword}</p>}

        <button type="submit">Register</button>
        <p className="switch-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}