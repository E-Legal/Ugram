import React from 'react'
import "../css/search.css"
import { getProfileInfos, addComment } from '../Api'
import { Redirect } from "react-router-dom";
import cookie from 'react-cookies'
import { FiSend } from 'react-icons/fi';
import CommentComponent from './CommentComponent'

export type DateCustom = {
    year: number,
    month: number,
    day: number
}

type commentaire = {
    str: String,
    Date: String,
    Sender: String
}

class CommentImage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            description: "",
            button: false,
            owner: "NONE",
            canDelete: false,
            comment: "",
            comments: []
        };
        this.handleChangeComment = this.handleChangeComment.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state.comments) {
            this.setState({ comments: this.props.location.state.comments });
        }
        getProfileInfos(this.props.location.state.img.owner_id).then((response) => {
            this.setState({ owner: response.data.username });
            if (cookie.load('id') === this.props.location.state.img.owner_id) {
                this.setState({ canDelete: true })
            }
        })
            .catch((error) => {
                alert(error.response.data);
            })
    }

    async sendComment() {
        if (this.state.comment.length > 0) {
            const newComment = await addComment(this.props.location.state.img.test, this.state.comment);
            let comments = this.state.comments;
            newComment.data.user = { username: this.state.owner };
            comments.push(newComment.data);
            this.setState({ comments: comments })
        }
    }

    handleChangeComment(event: any) {
        this.setState({ comment: event.target.value });
    }

    render() {
        if (this.state.button) {
            return <Redirect to={{ pathname: '/profil', state: { userId: this.props.location.state.img.currentUserId } }} />
        }
        return (
            <div className="gallery">
                <div className="desc"><span>Posted by: </span>{this.state.owner}</div>
                <img style={{ marginTop: 10 }} src={this.props.location.state.img.url} alt="Cinque Terre" width="300" height="200" />
                {this.state.comments.map((comment: any, index: any) =>
                    <CommentComponent key={index} {...comment} />
                )}
                <div className="colsDir">
                    <input type="text" value={this.state.comment} onChange={this.handleChangeComment} />
                    <FiSend size={25} style={{ color: "black", marginLeft: "20", marginTop: '20', marginBottom: '20' }} onClick={() => this.sendComment()} />
                </div>
            </div >
        )
    }
}

export default CommentImage
