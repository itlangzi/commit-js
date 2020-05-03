
import React from 'react'
import Tip from './Tip'
import ArrawDown from './ArrawDown'
import Edit from './Edit'
import Reply from './Reply'
import Heart from './Heart'
import HeartOn from './HeartOn'
import Close from './Close'
import Avatar from './Avatar'

const icons = {
    tip: Tip,
    'arraw-down': ArrawDown,
    edit: Edit,
    reply: Reply,
    heart: Heart,
    'heart-on': HeartOn,
    close: Close,
    avatar: Avatar,
}
export default ({ className, text, name }) => {
    const Icon = icons[name]
    return (
        <span className={`comt-icon ${className}`}>
            <span className="comt-icon-svg">
                {Icon ? <Icon /> : null}
            </span>
            {
                text ? <span className="comt-icon-text">{text}</span> : null
            }
        </span>
    )
}