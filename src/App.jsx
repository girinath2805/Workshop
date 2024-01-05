import React, {useState} from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import { Client, Freelancer, Role } from './components'
const App = () => {

  const [signer, setSigner] = useState(null);
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route
          path="/"
          element={<Role setSigner={setSigner} />}
        />
        <Route
          path="/freelancer"
          element={<Freelancer signer={signer} />} // Pass signer as a prop
        />
        <Route
          path="/client"
          element={<Client signer={signer} />} // Pass signer as a prop
        />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
