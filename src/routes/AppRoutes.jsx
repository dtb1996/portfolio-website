import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home/Home"
import BlogList from "../pages/Blog/BlogList"
import BlogPost from "../pages/Blog/BlogPost"
import { useEffect, useRef } from "react"

export default function AppRoutes() {
    const { pathname } = useLocation()
    const prevPath = useRef(pathname)

    useEffect(() => {
        if (prevPath.current !== pathname) {
            window.scrollTo(0, 0)
        }
        prevPath.current = pathname
    }, [pathname])

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
    )
}
