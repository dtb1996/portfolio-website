import "./App.scss"
import Navbar from "./components/Navbar/Navbar"
import About from "./sections/About/About"
import Footer from "./components/Footer/Footer"
import Projects from "./sections/Projects/Projects"
import Experience from "./sections/Experience/Experience"
import AppRoutes from "./routes/AppRoutes"

function App() {
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
