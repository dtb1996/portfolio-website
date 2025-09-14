import "./About.scss"
import profilePic from "../../assets/avatar.png"

export default function About() {
    return (
        <section id="about" className="about">
            <div className="about-image">
                <img src={profilePic} alt="profilePic" />
            </div>
            <div className="about-text">
                <h1>About Me</h1>
                <p>
                    I'm Dillon Bellefeuille, a passionate game programmer specializing in Unreal Engine development, with a particular focus on UI engineering. With a deep understanding of Unreal Engine's framework and a keen eye for user experience, I design and implement intuitive, responsive, and engaging interfaces that enhance gameplay and immerse players in their worlds.<br /><br />

                    Over the years, I have honed my skills in crafting modular and scalable systems, including inventory management, quest systems, and menu designs. My expertise lies in seamlessly integrating functionality with aesthetics, ensuring that every interface not only works flawlessly but also complements the overall game design.<br /><br />

                    Whether working on core gameplay mechanics or polishing the finer details of a HUD, I thrive on solving complex challenges and bringing creative visions to life. I am always eager to collaborate with teams that value innovation, quality, and user-centric design.<br /><br />

                    When I’m not coding, you’ll find me exploring the latest trends in game development, experimenting with new tools and techniques, or playing games that inspire my next big idea.<br /><br />

                    Some things I've worked on can be found in the Projects section.<br /><br />

                    I'm currently looking for a job in UI engineering. You can reach me at <a href="mailto:bellefeuilledillon@gmail.com">bellefeuilledillon@gmail.com</a> or contact me here.
                </p>
            </div>
        </section>
    )
}