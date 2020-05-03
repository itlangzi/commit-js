import React from 'react'
import Avatar from './Avatar'
import Icon from './icons'
import dayjs from '../dayjs'

export default class Comment extends React.PureComponent {
    constructor(props) {
        super(props)
        this.node = null
    }
    render() {
        const {
            comment, user = {}, i18n,
            onReply, onLike
        } = this.props
        const likes = comment.likes

        let reactionTotalCount = likes || '0'
        if (likes && likes > 100) {
            reactionTotalCount = '100+'
        }
        const isAuthor = comment.author === user.author &&
            comment.email === user.email
        const canReply = typeof onReply === 'function' && user &&
            comment.author !== user.author && comment.email !== user.email

        return (
            <div ref={ref => { this.node = ref }} className={`comt-comment ${isAuthor ? 'comt-comment-author' : ''}`}>
                <Avatar
                    className="comt-comment-avatar"
                    src={comment.avatar}
                    alt={comment.author}
                />
                <div className="comt-comment-content">
                    <div className="comt-comment-header">
                        <div className={`comt-comment-block-${user ? '2' : '1'}`} />
                        <a
                            className="comt-comment-username"
                            href={comment.authorUrl}
                        >
                            {comment.author}
                        </a>
                        {
                            comment.receivedAuthor ? (
                                <>
                                    <span className="comt-comment-text">{i18n.t('Reply')}</span>
                                    <a
                                        className="comt-comment-reply-username"
                                        href={comment.receivedAuthorUrl}
                                    >
                                        {comment.receivedAuthor}
                                    </a>
                                </>
                            ) :
                                (
                                    <span className="comt-comment-text">{i18n.t('Commented At')}</span>
                                )
                        }
                        <span className="comt-comment-date">
                            {
                                comment.createAt ?
                                    dayjs(comment.createAt)
                                        .locale(i18n.currentLocale.toLowerCase())
                                        .fromNow()
                                    : ''
                            }
                        </span>

                        {
                            onLike ? (
                                <a className="comt-comment-like" title={i18n.t("Like")} onClick={onLike}>
                                    {likes ?
                                        (
                                            <Icon
                                                className="comt-icon-heart"
                                                name="heart_on"
                                                text={reactionTotalCount}
                                            />
                                        ) :
                                        (
                                            <Icon
                                                className="comt-icon-heart"
                                                name="heart"
                                                text={reactionTotalCount}
                                            />
                                        )
                                    }
                                </a>
                            ) : null
                        }

                        {/* <a
                            href={comment.authorUrl}
                            className="comt-comment-edit"
                            title={i18n.t("Edit")}
                            target="_blank"
                        >
                            <Icon className="comt-icon-edit" name="edit" />
                        </a> */}
                        {canReply ? (
                            <a className="comt-comment-reply" title={i18n.t("Reply")} onClick={() => onReply(comment)}>
                                <Icon className="comt-icon-reply" name="reply" />
                            </a>
                        ) : null}

                    </div>
                    <div
                        className="comt-comment-body markdown-body"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                </div>
            </div>
        )
    }
}