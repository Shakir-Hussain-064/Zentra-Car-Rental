import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

    const {user} = useAppContext();

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-300 border-b border-gray-700 relative transition-all bg-gray-800' >   
        <Link to='/'>
            <img src={assets.logo} alt="" className='h-7' />
        </Link>
        <p className='text-gray-200'> Welcome, {user?.name || 'Owner'} </p>
    </div>
  )
}

export default NavbarOwner
