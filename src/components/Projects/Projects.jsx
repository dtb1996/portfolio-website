import "./Projects.scss"
import projects from "../../data/projects"
import ProjectCard from "./ProjectCard/ProjectCard"
import { useEffect, useState } from "react"
import ProjectModal from "./ProjectModal/ProjectModal"

export default function Projects() {
    const [showModal, setShowModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => (document.body.style.overflow = "auto")
    }, [showModal])

    const openProjectModal = (project) => {
        setSelectedProject(project)
        setShowModal(true)
    }

    const closeProjectModal = () => {
        setShowModal(false)
        setSelectedProject(null)
    }

    return (
        <section className="projects">
            <h1>Projects</h1>
            <div className="projects-grid">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        {...project}
                        onClick={() => openProjectModal(project)}
                    />
                ))}
            </div>
            {showModal && selectedProject && (
                <ProjectModal project={selectedProject} onClose={closeProjectModal} />
            )}
        </section>
    )
}