import { useEffect, useState } from "react"
import "./Navbar.scss"
import ThemeToggle from "../ThemeToggle/ThemeToggle"
import { Link, useLocation, useNavigate } from "react-router-dom"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("about")
    const location = useLocation()
    const navigate = useNavigate()

    const handleMenuToggle = () => setMenuOpen((prev) => !prev)
    const closeMenu = () => setMenuOpen(false)

    // Smooth scroll handler
    const handleSectionNav = (id) => {
        closeMenu()

        if (location.pathname === "/") {
            // Smooth scroll if already on home page
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: "smooth" })
        } else {
            // Navigate home first, then scroll
            navigate("/")
            // Wait for DOM to update before scrolling
            setTimeout(() => {
                const el = document.getElementById(id)
                if (el) el.scrollIntoView({ behavior: "smooth" })
            }, 200)
        }
    }

    // Home page scroll section tracking
    useEffect(() => {
        if (location.pathname !== "/") return

        const sections = Array.from(document.querySelectorAll("section[id]"))
        if (!sections.length) return

        const raw =
            getComputedStyle(document.documentElement).getPropertyValue("--navbar-height") || "64px"
        const navbarHeight = parseInt(raw, 10) || 64
        const rootMargin = `-${navbarHeight}px 0px 0px 0px`
        const ratios = new Map(sections.map((s) => [s.id, 0]))

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio))
                let maxId = null
                let maxRatio = -1
                ratios.forEach((ratio, id) => {
                    if (ratio > maxRatio) {
                        maxRatio = ratio
                        maxId = id
                    }
                })

                if (!maxId) {
                    const inView = sections.find((s) => {
                        const r = s.getBoundingClientRect()
                        return r.top < window.innerHeight && r.bottom > 0
                    })
                    maxId = inView ? inView.id : sections[0].id
                }

                if (maxId) setActiveSection(maxId)
            },
            {
                root: null,
                rootMargin,
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        )

        sections.forEach((s) => observer.observe(s))

        const onScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
                setActiveSection(sections[sections.length - 1].id)
            }
        }
        window.addEventListener("scroll", onScroll)

        return () => {
            observer.disconnect()
            window.removeEventListener("scroll", onScroll)
        }
    }, [location.pathname])

    // Reset active section when navigating to blog pages
    useEffect(() => {
        if (location.pathname.startsWith("/blog")) {
            setActiveSection("blog")
        }
    }, [location.pathname])

    return (
        <nav className={`navbar ${menuOpen ? "open" : ""}`}>
            <div className="navbar-left">
                <Link to="/" onClick={closeMenu}>
                    Dillon Bellefeuille
                </Link>
            </div>

            <div className={`navbar-toggle ${menuOpen ? "active" : ""}`} onClick={handleMenuToggle}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`navbar-right ${menuOpen ? "active" : ""}`}>
                <a
                    className={activeSection === "about" ? "active" : ""}
                    onClick={() => handleSectionNav("about")}
                >
                    About
                </a>
                <a
                    className={activeSection === "projects" ? "active" : ""}
                    onClick={() => handleSectionNav("projects")}
                >
                    Projects
                </a>
                <a
                    className={activeSection === "experience" ? "active" : ""}
                    onClick={() => handleSectionNav("experience")}
                >
                    Resume
                </a>

                <Link
                    to="/blog"
                    className={activeSection === "blog" ? "active" : ""}
                    onClick={closeMenu}
                >
                    Blog
                </Link>

                <div className="navbar-right-theme-toggle">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
