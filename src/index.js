import React from 'react'
import ReactDOM from 'react-dom'
import CommentJSComponent from './CommentJS'

class CommentJS {
    constructor(options = {}) {
        this.options = options
    }
    render(container, callback) {
        container = container || this.options.container
        if (!container) throw new Error(`Container is required.`)
        let node
        if (!(container instanceof HTMLElement)) {
            node = window.document.getElementById(container)
            if (!node) throw new Error(`Container not found, window.document.getElementById: ${container}`)
        } else {
            node = container
        }
        if (!callback) {
            callback = () => { }
        }

        return ReactDOM.render(<CommentJSComponent options={this.options} />, node, callback)
    }
}
export default CommentJS