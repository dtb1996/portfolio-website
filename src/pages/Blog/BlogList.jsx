import dayjs from "dayjs"
import fm from "front-matter"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function BlogList() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const importPosts = async () => {
            // Import all markdown files as raw text
            const files = import.meta.glob("/src/posts/*.md", { query: "?raw", import: "default" })
            const postsData = []

            for (const path in files) {
                const slug = path.split("/").pop().replace(".md", "")
                const raw = await files[path]()
                const { attributes } = fm(raw)
                postsData.push({ ...attributes, slug })
            }

            // Sort by date descending
            postsData.sort((a, b) => new Date(b.date) - new Date(a.date))
            setPosts(postsData)
        }

        importPosts()
    }, [])

    return (
        <section className="blog-list">
            <h1>Blog</h1>
            {posts.map((post) => (
                <article key={post.slug}>
                    <h2>
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p>{post.description}</p>
                    <small>{dayjs(post.date).format("MMM D, YYYY")}</small>
                </article>
            ))}
        </section>
    )
}
