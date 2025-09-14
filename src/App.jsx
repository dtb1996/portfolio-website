import './App.scss'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Footer from './components/Footer/Footer'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'

function App() {

  return (
    <>
      <Navbar />
      <section id="about">
        <About />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="experience">
        <Experience />
      </section>
      <Footer />
    </>
  )
}

export default App
