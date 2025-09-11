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
                <a>Dillon Bellefeuille</a>
            </div>
            <div className="navbar-right">
                <a>About</a>
                <a>Projects</a>
                <a>Resume</a>
                <a>Contact</a>
            </div>
        </nav>
    )
}