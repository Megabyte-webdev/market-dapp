import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="w-full max-w-peak px-3 md:px-6" >
            <Navbar />
            <main className="">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
