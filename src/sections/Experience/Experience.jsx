import "./Experience.scss"
import experience from "../../data/experience"
import ReactMarkdown from "react-markdown"

export default function Experience() {
    return (
        <section id="experience" className="experience">
            <h1>Experience</h1>
            <div className="experience-list">
                {experience.map((exp) => (
                    <div
                        className="experience-list-entry"
                        key={exp.id}
                    >
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
            <button className="experience-resume-button">
                <a href="/dillon_bellefeuille_resume.pdf" target="_blank" rel="noopener noreferrer" download="dillon_bellefeuille_resume.pdf">
                    Download Resume
                </a>
            </button>
        </section>
    )
}