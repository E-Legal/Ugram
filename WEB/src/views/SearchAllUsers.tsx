import React from 'react'
import { profilInfos } from '../component/profile_components/Profil';
import UserProfileCard from '../component/profile_components/SearchProfilCard';
import { allUsers } from '../Api'
import '../css/search.css'


function InitState(): profilInfos[] {
    return require('../json/users.json')
}

type ImageComponentProps = {
    user: profilInfos[]
}


class ImageComponent extends React.Component<ImageComponentProps> {
    state: ImageComponentProps;

    constructor(props: ImageComponentProps) {
        super(props);
        this.state = {
            user: InitState()
        };
        this.createState = this.createState.bind(this);
    }

    createState(response: any): any {

    }

    componentDidMount = () => {
        allUsers().then((response) => {
            this.setState({ user: response.data });
        })
            .catch((error) => {
                alert(error.response.data);
            })
    };

    render() {
        return (
            <div id="results-container">
                {this.state.user.map((user: profilInfos, index: any) => <UserProfileCard {...user} key={index} />)}
            </div>
        )
    }
}

export default ImageComponent