import React from "react";
import { getNotification } from "../Api";
import OneNotif from "./OneNotif";

type Myprops = {

}

type MyNotif = {
    notification_content: string
}

type Mystate = {
    notification: MyNotif[]
}

function initState(): MyNotif[] {
    return require('../json/notification.json');
}

class Notification extends React.Component<Mystate> {
    state: Mystate;
    constructor(props: Mystate) {
        super(props);
        this.state = {
            notification: initState()
        }
    }

    createState(response: any): any {

    }

    componentDidMount = () => {
        getNotification().then((response) => {
            this.setState({
                notification: response.data
            })
        })
            .catch((error) => {
                alert(error.response.data);
            })

        if (this.state.notification.length <= 0) {
            this.setState({
                notification: "Sorry you don't have any notification yet !"
            })
        }
    }
    render() {
    return (
        <div>{ this.state.notification.map((notification: MyNotif) => <OneNotif {...notification} />) }</div>
    )}
}

export default Notification;