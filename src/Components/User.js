import React from 'react'
import logo from '../Imgs/logo.png';

export default function User() {
  return (
    <div className='User'>

      <div className='logo'>
        <img src={logo} alt='logo' />
      </div>

      <div className='name'>
        <p>Ever Earlier App</p>
      </div>

    </div>
  )
}
