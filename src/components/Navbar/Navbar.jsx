import { useEffect, useState } from "react"
import "./Navbar.scss"
import ThemeToggle from "../ThemeToggle/ThemeToggle"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("about")

    useEffect(() => {
        const sections = Array.from(document.querySelectorAll("section[id]"))
        if (!sections.length) return

        // Read navbar height from CSS variable (fallback to 64)
        const raw =
            getComputedStyle(document.documentElement).getPropertyValue("--navbar-height") || "64px"
        const navbarHeight = parseInt(raw, 10) || 64
        const rootMargin = `-${navbarHeight}px 0px 0px 0px`

        // Map to hold the latest intersectionRatio for each section
        const ratios = new Map(sections.map((s) => [s.id, 0]))

        const observer = new IntersectionObserver(
            (entries) => {
                // Update ratios for changed entries
                entries.forEach((entry) => {
                    ratios.set(entry.target.id, entry.intersectionRatio)
                })

                // Pick the section with the largest visible ratio
                let maxId = null
                let maxRatio = -1
                ratios.forEach((ratio, id) => {
                    if (ratio > maxRatio) {
                        maxRatio = ratio
                        maxId = id
                    }
                })

                // Fallback: if none intersecting (maxRatio === 0), prefer the last visible by boundingClientRect
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

        // Ensure bottom-of-page selects last section
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
    }, [])

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <nav className={`navbar ${menuOpen ? "open" : ""}`}>
            <div className="navbar-left">
                <a href="/">Dillon Bellefeuille</a>
            </div>

            <div className={`navbar-toggle ${menuOpen ? "active" : ""}`} onClick={handleMenuToggle}>
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
