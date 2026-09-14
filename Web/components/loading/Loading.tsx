import React from 'react'
import './style.scss'

const Loading = () => {
  return (
    <div id="loading">
      <div className="snippet" data-title=".dot-pulse">
        <div className="stage">
          <div className="dot-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading