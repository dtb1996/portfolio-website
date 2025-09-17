import './App.scss'
import Navbar from './components/Navbar/Navbar'
import About from './sections/About/About'
import Footer from './components/Footer/Footer'
import Projects from './sections/Projects/Projects'
import Experience from './sections/Experience/Experience'
import Contact from "./sections/Contact/Contact"

function App() {

  return (
    <>
      <Navbar />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}

export default App
