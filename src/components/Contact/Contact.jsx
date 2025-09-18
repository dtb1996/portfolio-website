import { FaEnvelope, FaGithub, FaItchIo, FaLinkedin } from "react-icons/fa"
import "./Contact.scss"

export default function Contact() {
    return (
        <>
            <div className="contact">
                <a href="mailto:bellefeuilledillon@gmail.com" target="blank" rel="noopener noreferrer">
                    <FaEnvelope /> bellefeuilledillon@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/dillon-bellefeuille/" target="blank" rel="noopener noreferrer">
                    <FaLinkedin /> dillon-bellefeuille
                </a>
                <a href="https://github.com/dtb1996" target="blank" rel="noopener noreferrer">
                    <FaGithub /> dtb1996
                </a>
                <a href="https://dillionaire.itch.io/" target="blank" rel="noopener noreferrer">
                    <FaItchIo /> dillionaire
                </a>
            </div>
        </>
    )
}