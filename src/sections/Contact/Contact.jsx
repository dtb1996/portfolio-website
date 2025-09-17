import { FaEnvelope, FaGithub, FaItchIo, FaLinkedin } from "react-icons/fa"
import "./Contact.scss"

export default function Contact() {
    return (
        <section id="contact" className="contact">
            <h1>Contact Me</h1>
            <div className="contact-links">
                <a href="mailto:bellefeuilledillon@gmail.com" target="blank" rel="noopener noreferrer">
                    <FaEnvelope /> bellefeuilledillon@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/dillon-bellefeuille/" target="blank" rel="noopener noreferrer">
                    <FaLinkedin /> LinkedIn
                </a>
                <a href="https://github.com/dtb1996" target="blank" rel="noopener noreferrer">
                    <FaGithub /> GitHub
                </a>
                <a href="https://dillionaire.itch.io/" target="blank" rel="noopener noreferrer">
                    <FaItchIo /> Itch.io
                </a>
            </div>
        </section>
    )
}