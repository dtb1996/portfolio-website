import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { Link } from "react-router-dom"
import fm from "front-matter"
import "highlight.js/styles/github-dark.css"
import "./BlogPost.scss"
import dayjs from "dayjs"

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
                {meta.title !== "Post not found" && (
                    <small className="date">
                        Published on {dayjs(meta.date).format("MMMM D, YYYY")}
                    </small>
                )}
                <div className="content">
                    <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            a: ({ href, children }) => {
                                // Internal blog links
                                if (href && !href.startsWith("http")) {
                                    return <Link to={`/blog/${href}`}>{children}</Link>
                                }

                                // External links
                                return (
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                )
                            },
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
        </section>
    )
}
