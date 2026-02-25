import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from './Pages/Login';
import ProtectedRoute from "./Pages/ProtectedRoute";
import Home from './Pages/Home';
import Chat from "./Pages/Chat";
function App() {
  
  return (
    <>
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/signup" element={<Signup />} />
       <Route path='/login' element={<Login />}/>
       <Route path="/chat" element={<Chat />} />
       <Route path="/chat" element={<ProtectedRoute><Chat /> </ProtectedRoute>}/>
    </Routes>
    </>
  )
}

export default App
