import React from "react";
import Card from 'react-bootstrap/Card'

export type DateCustom = {
    year: number,
    month: number,
    day: number
}


class OneNotif extends React.Component<any> {

    format_date(date: Date) {
        const _date = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return _date.toLocaleDateString('en-US', options);
    }

    render(){
        const date: Date = new Date(this.props.createdAt)
        return (
         <div>
             <Card style={{ width: '21rem', margin: '10px auto', padding: '10px', float: "none" }}>
                 <Card.Text>{ this.props.username } added a {this.props.action} to {this.props.image} on {this.format_date(date)} </Card.Text>
             </Card>
         </div>
        )
    }
}

export default OneNotif;