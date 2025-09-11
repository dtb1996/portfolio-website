import { useState } from 'react'
import './App.scss'
import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Footer from './components/Footer/Footer'

function App() {

  return (
    <>
      <Navbar />
      <About />
      <Footer />
    </>
  )
}

export default App
