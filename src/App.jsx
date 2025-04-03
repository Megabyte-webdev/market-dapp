import { Routes, Route } from 'react-router-dom'
import './App.css'
import MarketPlace from './pages/MarketPlace'
import MainLayout from './layout/MainLayout'
// import Fallback from './components/Fallback'
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/AuthContext'
import { lazy, Suspense } from "react";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route index element={<MarketPlace />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={2000} draggable />
    </AuthProvider>


  )
}

export default App
