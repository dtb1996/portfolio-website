import "./ProjectModal.scss"
import ReactMarkdown from "react-markdown"
import ReactPlayer from "react-player"

export default function ProjectModal({ project, onClose }) {
    return (
        <div className="project-modal-backdrop" onClick={onClose}>
            <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                <div className="project-modal-header">
                    <h2>{project.title}</h2>
                    <button className="project-modal-header-close" onClick={onClose}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="project-modal-media">
                    {project.video ? (
                        <div className="video-wrapper">
                            <ReactPlayer
                                url={project.video}
                                width="100%"
                                height="100%"
                                controls
                            />
                        </div>
                    ) : (
                        <div className="image-wrapper">
                            <img src={project.thumbnail} alt={project.title} />
                        </div>
                    )}
                </div>

                <div className="project-modal-description">
                    <ReactMarkdown>{project.description}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}