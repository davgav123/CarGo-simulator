import React, { Component } from 'react';
import axios from 'axios';

export default class LoginFirst extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }
    componentDidMount() {
        let userid = this.props.match.params.userid;
        let token = this.props.match.params.token;

        const url = "http://localhost:49943/api/auth/confirmemail?userid=" + userid + "&token=" + token;


        axios.get(url)
        .then((response) => {
            console.log(response);
            window.location.href = "/prijavljivanje";
        })
        .catch((error) => {
            console.log(error);
        });

    }

    render() {
        return (
        <div className="orderDrive">

        </div>
    );
  }
}