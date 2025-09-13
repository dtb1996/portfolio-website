import { useState } from 'react'
import './App.scss'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Footer from './components/Footer/Footer'
import Projects from './components/Projects/Projects'

function App() {

  return (
    <>
      <Navbar />
      <About />
      <Projects />
      <Footer />
    </>
  )
}

export default App
