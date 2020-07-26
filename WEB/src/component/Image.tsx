import React from 'react'
import "../css/search.css"
import { Redirect } from "react-router-dom";
import { getProfileInfos, reactImage, unreactImage, getImage } from '../Api'
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import cookie from 'react-cookies';

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

type ImageState = {
    searchButton: boolean,
    commentButton: boolean,
    username: string,
    tags: any,
    hasReact: boolean,
    imgId: string,
    nbReact: number,
    comments: any,
    empty: boolean
}

class ImageComponent extends React.Component<any, ImageState> {

    constructor(props: ImageInfos) {
        super(props);
        this.state = {
            searchButton: false,
            commentButton: false,
            username: "",
            tags: [],
            hasReact: false,
            imgId: "",
            nbReact: 0,
            comments: [],
            empty: false
        }
    }

    async componentDidMount() {
        this.setState({ imgId: this.props.test })
        await getImage(this.props.test)
            .then(response => {
                let img = response;
                if (this.props.tags) {
                    this.setState({ tags: this.props.tags });
                }
                img.data.reactions.forEach((react: any) => {
                    if (react.owner_id === cookie.load('id')) {
                        this.setState({ hasReact: true });
                    }
                });
                this.setState({ comments: img.data.comments })
                this.setState({ nbReact: img.data.reactions.length });
                getProfileInfos(this.props.owner_id).then((response) => {
                    this.setState({ username: response.data.username })
                })
                    .catch((error) => {
                        alert(error.response.data);
                    })
            }).catch((error) => {
                this.setState({ empty: true });
                alert(error.response.data);
            });
    }

    format_date(date: Date) {
        const d = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    };

    searchButton(img: any) {
        this.setState({ searchButton: true });
    }

    commentButton() {
        this.setState({ commentButton: true });
    }

    reactToImg(react: boolean) {
        this.setState({ hasReact: react });
        react ? reactImage(this.props.test) : unreactImage(this.props.test);
        react ? this.setState({ nbReact: this.state.nbReact + 1 }) : this.setState({ nbReact: this.state.nbReact - 1 });
    }

    render() {
        if (this.state.searchButton) {
            return <Redirect to={{ pathname: '/editImage', state: { img: this.props, id: this.props.id } }} />
        }
        if (this.state.commentButton) {
            return <Redirect to={{ pathname: '/commentImage', state: { img: this.props, id: this.props.id, comments: this.state.comments } }} />
        }
        if (this.state.empty) {
            return null;
        }
        const date: Date = new Date(this.props.createdAt);
        return (
            <div className="gallery">
                <div className="desc"><span>Postée par: </span>{this.state.username}</div>
                <img onClick={() => this.searchButton(this.props)} src={this.props.url} alt="Cinque Terre" width="600" height="400" />
                <div className="desc"><span>Titre: </span>{this.props.title}</div>
                <div className="desc"><span>Description: </span>{this.props.description}</div>
                <div className="desc"><span>Date: {this.format_date(date)} </span></div>
                <div className="desc"><span >Tags: {this.state.tags.map((tags: any, index: any) => <span key={index}>{tags} </span>)} </span></div>
                <div className="colsDir">
                    <div style={{ paddingRight: 20 }}>{this.state.nbReact}</div>
                    {this.state.hasReact
                        ? <FaHeart size={25} style={{ color: "red" }} onClick={() => this.reactToImg(false)} />
                        : <FaRegHeart size={25} style={{ color: "red" }} onClick={() => this.reactToImg(true)} />}
                    <FaRegComment size={25} style={{ color: "black", marginLeft: "20" }} onClick={() => this.commentButton()} />
                </div>
            </div >
        )
    }
}

export default ImageComponent
