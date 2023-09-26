import React from 'react'
import NavHeader from '../NavHeader'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function CarHeader() {
  return (
    <div className='border-b border-b-black/10'>
      <div className='bg-orange text-white'>
        <div className='container'>
          <NavHeader></NavHeader>
        </div>
      </div>
      <div className='bg-white py-6'>
        <div className='container'>
          <nav className='flex items-end'>
            <Link to={path.home}></Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
