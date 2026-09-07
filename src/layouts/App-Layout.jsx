import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'

const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className='grid-background'></div>

            {/* flex-grow fills the remaining space, pushing footer to the bottom */}
            <main className='flex-grow container mx-auto px-4'>
                <Header />
                <Outlet />
            </main>

            <footer className='p-10 text-center bg-gray-800 text-white mt-10'>
                made by himanshu
            </footer>
        </div>
    )
}

export default AppLayout
