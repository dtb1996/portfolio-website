import "./About.scss"
import profilePic from "../../assets/avatar.png"
import Contact from "../../components/Contact/Contact"

export default function About() {
    return (
        <section id="about" className="about">
            <h1>About Me</h1>
            <img src={profilePic} alt="profilePic" />
            <div className="about-details">
                <p>
                    I’m Dillon Bellefeuille, a Gameplay/UI Engineer with experience in Unreal Engine, React, and Qt. I specialize in building intuitive and responsive interfaces that are focused on the user experience.<br /><br />

                    My background includes designing modular and scalable systems such as inventory management, quest systems, and in-game menus. Whether I’m developing core gameplay features or building polished interfaces, I aim to create solutions that are both robust and cohesive.<br /><br />

                    I am adept at solving complex challenges, joining together functionality and design, and collaborating with teams that value creativity and user-first experiences.<br /><br />

                    Some of my work is featured in the <a href="#projects">Projects</a> section.<br /><br />

                    I'm always open to new opportunities. Feel free to get in touch through any of the links below.
                </p>
            </div>
            <div className="about-links">
                <Contact />
            </div>
        </section>
    )
}