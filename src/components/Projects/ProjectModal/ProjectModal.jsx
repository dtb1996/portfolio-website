import "./ProjectModal.scss"

export default function ProjectModal({ project, onClose }) {
    return (
        <div className="project-modal-backdrop" onClick={onClose}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                <button className="project-modal-close" onClick={onClose}>x</button>
                <h2>{project.title}</h2>
                <img src={project.thumbnail} alt={project.title} />
                <p>{project.description}</p>
            </div>
        </div>
    )
}