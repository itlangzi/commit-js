import React from 'react'
import QueueAnim from 'rc-queue-anim'
import 'url-search-params-polyfill'
import i18n from './i18n'
import { Icon, Button, Comment, Avatar, Fetch } from './component'
import {
    COMT_VERSION, trim, isObject, isFunction,
    AuthorRegexp, EmailRegexp, WebsiteRegexp
} from './const'
class CommentJS extends React.PureComponent {
    state = {
        comments: [],
        totalRecords: 0,
        perPage: 10,
        page: 1,
        isLoadOver: false,
        isLoadingMore: false,
        isIniting: true,
        isOccurError: false,
        isCommentsError: false,
        commentsErrorMsg: '',
        isCommentError: false,
        commentErrorMsg: '',
        user: { author: '', email: '', authorUrl: '' },
        content: '',
        reply: '',
        authorChanged: false,
        emailChanged: false,
        authorUrlChanged: false,
        contentChanged: false
    }
    constructor(props) {
        super(props)
        this.version = COMT_VERSION
        this.options = Object.assign({}, {
            title: window.document.title,
            language: window.navigator.language || window.navigator.userLanguage,
            queueAnimOptions: {
                type: ['right', 'left']
            },
            showCopyright: true,
            markdownGuide: true,
            commentUrl: '',
            commentsUrl: '',
            commentHeader: {},
            commentParams: {},
            commentBodyResolve: () => { },
            commentsHeader: {},
            commentsParams: {},
            commentsBodyResolve: () => { },
            commentsOnError: null,
            placeholder: 'Say words'
        }, props.options)

        this.i18n = i18n(this.options.language)

        if (!this.options.commentUrl || !this.options.commentsUrl) {
            this.state.isOccurError = true
            this.state.errMsg = `${this.i18n.t('commentUrl and commentsUrl parameter is required')}.`
        }

        this.containerRef = null
    }
    componentDidMount() {
        this.options.commentsUrl && this.loadComments()
    }
    get isLoadOver() {
        const { totalRecords, perPage, page } = this.state
        return totalRecords <= page * perPage
    }
    get isCanComment() {
        return this.isAuthorVaildated === true
            && this.isEmailVaildated === true
            && this.isWebsiteVaildated === true
            && this.isContentVaildated === true
            && this.options.commentUrl
    }
    get isAuthorVaildated() {
        const { user, authorChanged } = this.state
        if (!authorChanged) {
            return true
        }
        if (!trim(user.author)) {
            return this.i18n.t("Author Vaildated Error")
        }
        if (AuthorRegexp.test(user.author)) {
            return true
        }
        return this.i18n.t("Author Vaildated Error")
    }
    get isEmailVaildated() {
        const { user, emailChanged } = this.state
        if (!emailChanged) {
            return true
        }
        if (EmailRegexp.test(user.email)) {
            return true
        }
        return this.i18n.t("Email Vaildated Error")
    }
    get isWebsiteVaildated() {
        const { user, authorUrlChanged } = this.state
        if (!authorUrlChanged) {
            return true
        }
        if (user.authorUrl) {
            if (WebsiteRegexp.test(user.authorUrl)) {
                return true
            }
            return this.i18n.t("Website Vaildated Error")
        }
        return true
    }
    get isContentVaildated() {
        const { content, contentChanged } = this.state
        if (!contentChanged) {
            return true
        }
        if (content && trim(content)) {
            return true
        }
        return this.i18n.t("Content Vaildated Error")
    }
    resolveParams = params => {
        if (isObject(params)) {
            return { ...params }
        }
        if (isFunction(params)) {
            params = params()
        }
        return params || {}
    }
    resolveHeader = header => {
        if (isObject(header)) {
            return { ...header }
        }
        if (isFunction(header)) {
            header = header()
        }
        return header || {}
    }
    nextComments() {
        this.setState(
            state => ({
                ...state,
                page: state.page + 1,
                isLoadingMore: true
            }), () => this.loadComments().then(() => {
                this.setState({ isLoadingMore: false })
            })
        )
    }
    loadComments() {
        const {
            commentsParams, commentsHeader,
            commentsUrl, commentsBodyResolve,
            commentsOnError
        } = this.options

        let params = this.resolveParams(commentsParams)
        params = { ...params, page: this.state.page }
        const headers = this.resolveHeader(commentsHeader)
        this.setState({
            isCommentsError: false,
            commentsErrorMsg: ''
        })
        return Fetch(commentsUrl, {
            body: new URLSearchParams(params),
            headers,
            method: 'POST'
        })
            .then(response => response.json())
            .then(response => {
                const data = isFunction(commentsBodyResolve) ? commentsBodyResolve(response) || response : response
                const comments = this.state.comments
                const content = (data.content ? data.content : [])
                    .filter(item => comments.findIndex(i => i.id === item.id) === -1)
                this.setState({
                    comments: comments.concat(content),
                    totalRecords: data.total || 0,
                    isIniting: false,
                    isLoadingMore: false
                })
                return Promise.resolve('success.')
            }).catch(error => {
                isFunction(commentsOnError) ? commentsOnError(error) : console.error(error)
                this.setState({
                    isCommentsError: true,
                    commentsErrorMsg: this.i18n.t(error.message),
                    isIniting: false,
                    isLoadingMore: false
                })
                return Promise.resolve('error.')
            })
    }
    newComment() {
        if (
            this.isAuthorVaildated !== true ||
            this.isEmailVaildated !== true ||
            this.isWebsiteVaildated !== true ||
            this.isContentVaildated !== true
        ) {
            return Promise.reject('error.')
        }
        const { user, content, page, totalRecords, perPage, reply } = this.state
        const { commentUrl, commentParams, commentHeader } = this.options

        let params = this.resolveParams(commentParams)
        params = { ...params, ...user, content }
        if (reply) {
            params.parentId = reply.id
        }

        const headers = this.resolveHeader(commentHeader)
        this.setState({ isCommentError: false, commentErrorMsg: '' })
        return Fetch(commentUrl, {
            body: new URLSearchParams(params),
            headers,
            method: 'POST'
        }).then(() => {
            const totalPage = totalRecords % perPage === 0 ? totalRecords / perPage : Math.ceil(totalRecords / perPage)
            if (totalRecords < perPage || page === totalPage) {
                this.loadComments()
            }
            return Promise.resolve('success.')
        }).catch(error => {
            this.setState({ isCommentError: true, commentErrorMsg: this.i18n.t(error.message) })
            return Promise.reject('error.')
        })
    }
    onAuthorChange = e => {
        const value = e.target.value
        this.setState(state => ({
            ...state,
            user: {
                ...state.user,
                author: value
            },
            authorChanged: true
        }))
    }
    onEmailChange = e => {
        const value = e.target.value
        this.setState(state => ({
            ...state,
            user: {
                ...state.user,
                email: value
            },
            emailChanged: true
        }))
    }
    onAuthorUrlChange = e => {
        const value = e.target.value
        this.setState(state => ({
            ...state,
            user: {
                ...state.user,
                authorUrl: value
            },
            authorUrlChanged: true
        }))
    }
    onContentChange = e => {
        const value = e.target.value
        this.setState(state => ({
            ...state,
            content: value,
            contentChanged: true
        }))
    }
    onComment = () => {
        this.setState({
            authorChanged: true,
            authorUrlChanged: true,
            emailChanged: true,
            contentChanged: true
        }, () => {
            if (this.isCanComment) {
                this.newComment().then(() => {
                    this.setState({
                        authorChanged: false,
                        authorUrlChanged: false,
                        emailChanged: false,
                        contentChanged: false
                    })
                })
            }
        })
        // this.setState(state => { comments: [...state.comments, Math.random()] })
    }
    onLoadMore = () => {
        this.nextComments()
    }
    onReply = comment => {
        this.setState({
            reply: comment,
            content: `@Re: ${comment.author}  \n`
        })

        window.scrollTo({ top: this.containerRef.offsetTop })
    }
    onCloseReply = () => {
        this.setState({
            reply: null
        })
    }
    initing() {
        return (
            <div className="comt-initing">
                <i className="comt-loader" />
                <p className="comt-initing-text">{this.i18n.t('CommentJS loading')}...</p>
            </div>
        )
    }
    meta() {
        const { totalRecords = 0 } = this.state
        const { showCopyright } = this.options
        return (
            <div className="comt-meta">
                <span className="comt-meta-counts">
                    <a className="comt-link comt-link-counts" href=":;">{totalRecords}</a>
                    <span> {this.i18n.t('Comments')} </span>
                </span>
                {
                    showCopyright ? (
                        <div className="comt-copytight">
                            <div className="comt-copytight-inner">
                                <span className="comt-copytight-pkg-name"> @ CommentJS v{this.version} </span>
                            </div>
                        </div>
                    ) : null
                }

            </div>
        )
    }
    header() {
        const { user, content, reply } = this.state
        const { markdownGuide } = this.options
        return (
            <div
                key="comt-header"
                className="comt-header"
            >
                <a className="comt-avatar comt-avatar-avatar">
                    {
                        user.avatar ? (
                            <Avatar
                                className="comt-header-avatar"
                                src={user.avatar}
                                alt={user.author}
                            />
                        ) : <Icon className="comt-icon-avatar" name="avatar" />
                    }
                </a>
                <div className="comt-header-comments">
                    <div className="comt-header-form">
                        {
                            reply ? (
                                <div className="comt-comments comt-comments-reply">
                                    <div className="comt-comment">
                                        <div className="comt-comment-content">
                                            <div className="comt-comment-header">
                                                <span className="comt-comment-reply-prefix">
                                                    {this.i18n.t('Reply')}
                                                </span>
                                                <a
                                                    className="comt-comment-username"
                                                    href={reply.authorUrl}
                                                >
                                                    {reply.author}
                                                </a>
                                                <a
                                                    className="comt-comment-close"
                                                    title={this.i18n.t("Close")}
                                                    onClick={this.onCloseReply}
                                                >
                                                    <Icon className="comt-icon-close" name="close" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className="comt-header-row clearfix">
                            <div className="comt-header-col">
                                <input
                                    value={user.author}
                                    className={`comt-header-input ${this.isAuthorVaildated === true ?
                                        '' :
                                        'comt-header-input-error'}`}
                                    placeholder={`${this.i18n.t('Name')} *`}
                                    onChange={this.onAuthorChange}
                                />
                            </div>
                            <div className="comt-header-col">
                                <input
                                    value={user.email}
                                    className={`comt-header-input ${this.isEmailVaildated === true ?
                                        '' :
                                        'comt-header-input-error'}`}
                                    placeholder={`${this.i18n.t('Email')} *`}
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="comt-header-col">
                                <input
                                    value={user.authorUrl}
                                    className={`comt-header-input ${this.isWebsiteVaildated === true ?
                                        '' :
                                        'comt-header-input-error'}`}
                                    placeholder={this.i18n.t('Website')}
                                    onChange={this.onAuthorUrlChange}
                                />
                            </div>
                        </div>
                        <textarea
                            value={content}
                            rows={3}
                            placeholder={`${this.i18n.t(this.options.placeholder)}`}
                            className={`comt-header-textarea ${this.isContentVaildated === true ?
                                '' :
                                'comt-header-input-error'}`}
                            maxLength={10000}
                            onChange={this.onContentChange}
                        />
                    </div>
                    <div className="comt-header-controlls">
                        {
                            markdownGuide ? (
                                <a
                                    className="comt-header-controlls-tip"
                                    href="https://guides.github.com/features/mastering-markdown/"
                                    target="_blank"
                                >
                                    <Icon className="comt-icon-tip" name="tip" text={this.i18n.t('Support Markdown')} />
                                </a>
                            ) : null
                        }
                        <button
                            className={`comt-btn comt-btn-comment ${this.isCanComment ?
                                '' : ' is--disable '}`}
                            onClick={this.onComment}
                        >
                            <span className="comt-btn-text"> {this.i18n.t('Comment')} </span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    comments() {
        const { isLoadingMore, user, comments } = this.state
        const { queueAnimOptions } = this.options
        return (
            <div key="comt-comments" className="comt-comments">
                <div style={{ position: "relative" }}>
                    <QueueAnim {...queueAnimOptions}>
                        {
                            comments.map(comt => <Comment
                                key={comt.id}
                                i18n={this.i18n}
                                comment={comt}
                                user={user}
                                onReply={this.onReply}
                            />)
                        }
                    </QueueAnim>
                </div>
                {!comments.length && <p className="comt-comments-null"> {this.i18n.t('Sofa')}! </p>}
                {
                    !this.isLoadOver && comments.length ? (
                        <div className="comt-comments-controlls">
                            <Button
                                className="comt-btn-loadmore"
                                isLoading={isLoadingMore}
                                text={this.i18n.t('Load More')}
                                onClick={this.onLoadMore}
                            />
                        </div>
                    ) : null
                }

            </div>
        )
    }
    render() {
        // https://iochen.com/2018/01/06/use-gitalk-in-hexo/
        // https://cjjkkk.github.io/gitalk/
        const {
            isIniting, isCommentsError, commentsErrorMsg,
            isCommentError, commentErrorMsg
        } = this.state
        return (
            <div ref={ref => { this.containerRef = ref }} className="comt-container">
                {isIniting && this.initing()}
                {/* meta */}
                {!isIniting && this.meta()}
                {isCommentsError && (
                    <div className="comt-error">
                        {commentsErrorMsg}
                    </div>)}

                {!isIniting && !isCommentsError ? (
                    <>
                        {/*  header forms  */}
                        {this.header()}
                        {
                            isCommentError ? (
                                <div className="comt-error">
                                    {commentErrorMsg}
                                </div>
                            ) : null
                        }

                        {/*   Comments */}
                        {this.comments()}
                    </>
                ) : null}
            </div>
        )
    }
}

export default CommentJS