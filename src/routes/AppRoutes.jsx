import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home/Home"
import BlogList from "../pages/Blog/BlogList"
import BlogPost from "../pages/Blog/BlogPost"
import { useEffect } from "react"

export default function AppRoutes() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
    )
}
