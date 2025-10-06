import "./Experience.scss"
import { experience, skills } from "../../data/experience"
import ReactMarkdown from "react-markdown"

export default function Experience() {
    return (
        <section id="experience" className="experience">
            {/* Experience Section */}
            <h1>Experience</h1>
            <div className="experience-list">
                {experience.map((exp) => (
                    <div className="experience-list-entry" key={exp.id}>
                        <div className="experience-list-entry-header">
                            <h3>{exp.role}</h3>
                            <p>{exp.period}</p>
                        </div>
                        <div className="experience-list-entry-description">
                            <ReactMarkdown>{exp.description}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills Section */}
            <div className="skills">
                <h1>Skills</h1>
                <div className="skills-groups">
                    <div className="skills-group">
                        <h3>Game Development</h3>
                        <ul>
                            {skills.gameDev.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="skills-group">
                        <h3>Web Development</h3>
                        <ul>
                            {skills.webDev.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* View Resume Button */}
            <button className="experience-resume-button">
                <a href="/dillon_bellefeuille_resume.pdf" target="_blank" rel="noopener noreferrer">
                    View Resume
                </a>
            </button>
        </section>
    )
}
