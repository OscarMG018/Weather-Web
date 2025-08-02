import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="container text-white p-5">
      <h1>Welcome to my React app!</h1>
      <FontAwesomeIcon icon={faSun} size="2x" color="yellow" />
      <p className="text-center">The sun is a deadly laser</p>
      <button className="btn btn-primary">Click me</button>
    </div>
    </>
  )
}

export default App
