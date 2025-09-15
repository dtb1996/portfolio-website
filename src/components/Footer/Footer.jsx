import { FaEnvelope, FaGithub, FaItchIo, FaLinkedin } from "react-icons/fa"
import "./Footer.scss"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <p>Copyright &copy; {currentYear} Rolling Pixels. All rights reserved.</p>
            <div className="footer-links">
                <a href="mailto:bellefeuilledillon@gmail.com" target="blank" rel="noopener noreferrer">
                    <FaEnvelope />
                </a>
                <a href="https://www.linkedin.com/in/dillon-bellefeuille/" target="blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
                <a href="https://github.com/dtb1996" target="blank" rel="noopener noreferrer">
                    <FaGithub />
                </a>
                <a href="https://dillionaire.itch.io/" target="blank" rel="noopener noreferrer">
                    <FaItchIo />
                </a>
            </div>
        </footer>
    )
}