import React, {Component} from 'react';

export default class Investigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        let self = this;
        fetch('/api/investigations', {
            method: 'GET'
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            console.log(data)
            self.setState({users: data});
        }).catch(err => {
            console.log('caught it!',err);
        })
    }

    render() {
        return (
        <div className="container"> 
            <div className="panel panel-default p50 uth-panel">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Investigation</th>
                            <th>Sponsor</th>>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(member =>
                        <tr key={member.Name}>
                        <td>{member.Name} </td>
                        <td>{member.Sponsor}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
}