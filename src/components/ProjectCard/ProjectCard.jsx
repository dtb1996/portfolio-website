import "./ProjectCard.scss"

export default function ProjectCard({ title, thumbnail, onClick }) {
    return (
        <div className="project-card" onClick={onClick}>
            <img src={thumbnail} alt={title} className="project-card-image" />
            <div className="project-card-overlay">
                <h3 className="project-card-title">{title}</h3>
            </div>
        </div>
    )
}
