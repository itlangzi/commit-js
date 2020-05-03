import React from 'react'

export default ({
    className,
    getRef,
    onClick,
    onMouseDown,
    text,
    isLoading
}) =>
    (
        <button
            ref={el => getRef && getRef(el)}
            className={`comt-btn ${className}`}
            onClick={onClick}
            onMouseDown={onMouseDown}>
            <span className="comt-btn-text">{text}</span>
            {
                isLoading && <span className="comt-btn-loading comt-spinner" />
            }
        </button>
    )

