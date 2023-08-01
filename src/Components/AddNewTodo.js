import React, { useState } from 'react'
import Model from './Model';

export default function AddNewTodo() {

  const [showModel, setShowModel] = useState(false);
  return (

    <div className='AddNewTodo'>

      <div className="Btn">
        <button onClick={() => setShowModel(true)}>
          + Add New Todo
        </button>
      </div>


      <Model showModel={showModel} setShowModel={setShowModel}>
        <div>
          LET'S GET STARTED
          <button
            onClick={() => setShowModel(false)}>
            hide
          </button>
        </div>
      </Model>

    </div>
  )
}
