import React from 'react'

import Todo from './Todo';

import Next7Days from './Next7Days';

export default function Todos() {
  return (
    <div className='Todos'>
      <Todo/>
      <Next7Days/>
    </div>
  )
}
