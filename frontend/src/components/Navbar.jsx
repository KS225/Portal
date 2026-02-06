import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="granuler-navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="https://granuler.com">
            GRANULER
          </a>
        </div>

        <nav className="nav-links">
          <a href="https://granuler.com">Home</a>
          <a href="https://granuler.com/services">Services</a>
          <a href="https://granuler.com/certification">Certification</a>
          <a href="https://granuler.com/about">About</a>
          <a href="https://granuler.com/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
