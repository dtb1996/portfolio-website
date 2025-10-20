import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import fm from "front-matter"
import "highlight.js/styles/github-dark.css"
import "./BlogPost.scss"

export default function BlogPost() {
    const { slug } = useParams()
    const [content, setContent] = useState("")
    const [meta, setMeta] = useState({ title: "", date: "" })

    useEffect(() => {
        const loadPost = async () => {
            const files = import.meta.glob("/src/posts/*.md", { query: "?raw", import: "default" })
            const path = `/src/posts/${slug}.md`

            if (files[path]) {
                const raw = await files[path]()
                const { attributes, body } = fm(raw)
                setMeta({ title: attributes.title, date: attributes.date })
                setContent(body)
            } else {
                setMeta({ title: "Post not found" })
                setContent("This post could not be loaded.")
            }
        }

        loadPost()
    }, [slug])

    return (
        <section>
            <article className="blog-post">
                <h1>{meta.title}</h1>
                <small>Published on {new Date(meta.date).toLocaleDateString()}</small>
                <div className="content">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
                </div>
            </article>
        </section>
    )
}
