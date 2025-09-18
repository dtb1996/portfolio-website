import { useEffect, useState } from "react"
import "./Navbar.scss"
import ThemeToggle from "../ThemeToggle/ThemeToggle"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("about")

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section")
            let current = ""

            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 100
                const sectionHeight = section.clientHeight

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute("id")
                }
            })

            if (current) {
                setActiveSection(current)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <nav className={`navbar ${menuOpen ? "open" : ""}`}>
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
                <a
                    href="#about"
                    className={activeSection === "about" ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                >
                    About
                </a>
                <a
                    href="#projects"
                    className={activeSection === "projects" ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                >
                    Projects
                </a>
                <a
                    href="#experience"
                    className={activeSection === "experience" ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                >
                    Resume
                </a>
                <div className="navbar-right-theme-toggle">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}