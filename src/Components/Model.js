import React from 'react'

export default function Model({children,showModel,setShowModel}) {

  const modelRef = React.useRef()
  const closeModel = (e) => {
    if(e.target === modelRef.current)
    {
      setShowModel(false)
    }
  }

  return (
    showModel &&
    <div className='Model' ref={modelRef} onClick={closeModel}>
      <div className="Container">
        {children}
      </div>
    </div>
  )
}
