import React from 'react'

export default ({ src, className, alt, defaultSrc = '//cdn.v2ex.com/gravatar?d=mm' }) => (
    <div className={`comt-avatar ${className}`}>
        <img src={src || defaultSrc} alt={`@${alt}`} onError={function (e) {
            e.target.src = defaultSrc
        }} />
    </div>
)