import './App.scss'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Footer from './components/Footer/Footer'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Contact from "./components/Contact/Contact"

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
