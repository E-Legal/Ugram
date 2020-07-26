import React from 'react'
import "../css/search.css"

export type DateCustom = {
    year: number,
    month: number,
    day: number
}

export type ImageInfos = {
    src: string,
    owner_id: string,
    description: string,
    date: DateCustom,
    like: number,
    id: string,
    title: string
    key: string,
    test: string,
    createdAt: string,
    tags: any,
    url: string,
    currentUserId: string
}

class CommentComponent extends React.Component<any> {

    componentDidMount() {

    }

    render() {
        return (
            <div className="gallery">
                <div style={{ fontWeight: 'bold' }}>{this.props.user.username}</div>
                <div>Comment : {this.props.text}</div>
            </div >
        )
    }
}

export default CommentComponent
