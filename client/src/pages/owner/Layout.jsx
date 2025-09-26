import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

  const { isOwner, navigate } = useAppContext()

  //if the user is not an owner redirect to home page 
  useEffect(() => {
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])

  return (
    <div className='flex flex-col min-h-screen bg-gray-900' >
        <NavbarOwner/>
        <div className='flex flex-1'>
            <Sidebar/>
            <Outlet/>
        </div>
    </div>
  )
}

export default Layout
