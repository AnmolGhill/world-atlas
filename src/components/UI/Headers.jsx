import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect } from "react";

export const Headers = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isUser = localStorage.getItem("userEmail");
    setIsLoggedIn(!!isUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleMenu = () => setShow((prev) => !prev);

  return (
    <header className="main-header">
      <div className="container">
        <div className="navbar-grid">
          <div className="logo">
            <NavLink to="/" className="logo-text">🌍 WorldAtlas</NavLink>
          </div>

          <nav className={`menu ${show ? "menu-mobile" : "menu-web"}`}>
            <ul>
               <li><NavLink to="/" className="auth-btn">Home</NavLink></li>
               <li><NavLink to="/about" className="auth-btn">About</NavLink></li>
               <li><NavLink to="/country" className="auth-btn">Country</NavLink></li>
               <li><NavLink to="/contact" className="auth-btn">Contact</NavLink></li>

              {!isLoggedIn ? (
                <>
                  <li><NavLink to="/login" className="auth-btn">Login</NavLink></li>
                  <li><NavLink to="/register" className="auth-btn">Register</NavLink></li>
                </>
              ) : (
                <li>
                  <button className="logout-btn-with-text" onClick={handleLogout} title="Logout">
                      <span role="img" aria-label="logout"> logout</span>
                      <span className="logout-label">Logout</span>
                  </button>
                </li>
              )} 
            </ul>
          </nav>

          <div className="ham-menu">
            <button onClick={toggleMenu}>
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};