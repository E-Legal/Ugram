import React from 'react'
import "../css/search.css"
import { deleteImage, getProfileInfos, editImage } from '../Api'
import { Redirect } from "react-router-dom";
import cookie from 'react-cookies'

export type DateCustom = {
    year: number,
    month: number,
    day: number
}

class EditImage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            description: "",
            button: false,
            owner: "NONE",
            canDelete: false,
            tags: [],
            newtag: ""
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.getTagsValue = this.getTagsValue.bind(this);
        this.handleChangeTags = this.handleChangeTags.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.removeTag = this.removeTag.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state.img.description) {
            this.setState({ description: this.props.location.state.img.description });
        }
        if (this.props.location.state.img.tags) {
            this.setState({ tags: this.props.location.state.img.tags });
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

    handleChange(event: any) {
        this.setState({ description: event.target.value });
    }

    handleClick(event: any) {
        editImage(this.props.location.state.img.test, {
            title: this.props.location.state.img.title,
            description: this.state.description,
            tags: this.state.tags
        }).then((response) => {
            alert("L'image à été modifier");
        })
            .catch((error) => {
                alert("Impossible de modifier l'image");
            })
    }

    handleRemove() {
        deleteImage(this.props.location.state.img.test).then((response) => {
            alert("L'image à été supprimée");
        }).catch((error) => {
            alert("Impossible de supprimer l'image");
        });
        this.setState({ button: true });
    }

    format_date(date: Date) {
        const d = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    };

    getTagsValue() {
        let ret = "";
        // eslint-disable-next-line array-callback-return
        this.state.tags.map((tag: string) => {
            ret += tag + " ";
        });
        return ret.slice(0, -1);
    }

    handleChangeTags(event: any) {
        this.setState({ newtag: event.target.value });
    }

    handleKeyDown(event: any) {
        if (event.key === 'Enter') {
            this.state.tags.push(this.state.newtag);
            this.setState({ newtag: '' });
        }
    }

    removeTag(tag: any) {
        const newTags = this.state.tags.filter((current: string) => {
            return current !== tag
        });
        this.setState({ tags: newTags });
    }

    render() {
        if (this.state.button) {
            return <Redirect to={{ pathname: '/profil', state: { userId: this.props.location.state.img.currentUserId } }} />
        }
        return (
            <div className="gallery">
                <div className="desc"><span>Posted by: </span>{this.state.owner}</div>
                <img style={{ marginTop: 10 }} src={this.props.location.state.img.url} alt="Cinque Terre" width="300" height="200" />
                <div className="desc">
                    <span>Description: </span>
                    {this.state.canDelete ?
                        <input type="text" value={this.state.description} onChange={this.handleChange} />
                        :
                        <div>{this.state.description}</div>
                    }

                </div>
                <div className="desc"><span>Post Date: {this.format_date(this.props.location.state.img.createdAt)}</span></div>
                <div style={{ marginTop: 10 }} className="desc_date"><span className="colsDir">Tags:
                {this.state.tags.map((tag: string, index: any) =>
                    <div key={index}>
                        <span className="tag"> {tag} </span>
                        {this.state.canDelete ?
                            <button style={{ marginTop: 10 }} onClick={() => this.removeTag(tag)}>Remove</button>
                            :
                            <div></div>
                        }
                    </div>
                )}
                    {this.state.canDelete ?
                        <input value={this.state.newtag} onChange={this.handleChangeTags} onKeyDown={this.handleKeyDown} />
                        :
                        <div></div>
                    }

                </span></div>

                {this.state.canDelete ? <button onClick={this.handleClick}>Modifier</button> : null}
                {this.state.canDelete ? <button style={{ marginTop: 10 }} onClick={this.handleRemove}>Remove</button> : null}
            </div >
        )
    }
}

export default EditImage
