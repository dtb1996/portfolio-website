import "./App.scss"
import Navbar from "./components/Navbar/Navbar"
import About from "./sections/About/About"
import Footer from "./components/Footer/Footer"
import Projects from "./sections/Projects/Projects"
import Experience from "./sections/Experience/Experience"
import AppRoutes from "./routes/AppRoutes"
import { BrowserRouter } from "react-router-dom"
import { usePageTracking } from "./utils/usePageTracking"

function App() {
    usePageTracking()

    return (
        <>
            <Navbar />
            <main id="content">
                <AppRoutes />
            </main>
            <Footer />
        </>
    )
}

export default App
