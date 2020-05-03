import React from 'react'

export default ({ className, onClick, text }) => (
    <a className={`comt-action ${className}`} onClick={onClick}>
        <span className="comt-action-text">{text}</span>
    </a>
)
