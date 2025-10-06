import { useEffect, useState } from "react"
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md"
import "./ThemeToggle.scss"

export default function ThemeToggle() {
    const [theme, setTheme] = useState("dark")

    useEffect(() => {
        // Check if user has a saved theme preference
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.setAttribute("data-theme", savedTheme)
            return
        }

        // Check for system theme preference
        const prefersLight = window.matchMedia("(prefers-color-scheme: light").match
        if (prefersLight) {
            setTheme("light")
            document.documentElement.setAttribute("data-theme", "light")
        } else {
            document.documentElement.setAttribute("data-theme", "dark")
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
        localStorage.setItem("theme", newTheme)
    }

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <MdDarkMode /> : <MdOutlineLightMode />}
        </button>
    )
}
