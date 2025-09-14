import { useState } from "react"
import "./Navbar.scss"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <nav className={`navbar ${menuOpen ? "open" : ""}`}>
            {/* <h1>My App</h1> */}
            <div className="navbar-left">
                <a href="/">Dillon Bellefeuille</a>
            </div>

            <div
                className={`navbar-toggle ${menuOpen ? "active" : ""}`}
                onClick={handleMenuToggle}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`navbar-right ${menuOpen ? "active" : ""}`}>
                <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
                <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
                <a href="#experience" onClick={() => setMenuOpen(false)}>Resume</a>
                <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            </div>
        </nav>
    )
}