import "./ProjectModal.scss"
import ReactMarkdown from "react-markdown"

export default function ProjectModal({ project, onClose }) {
    function extractYouTubeID(url) {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

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
                            <iframe
                                src={`https://www.youtube.com/embed/${extractYouTubeID(project.video)}`}
                                title={project.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
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