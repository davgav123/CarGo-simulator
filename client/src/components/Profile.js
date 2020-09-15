import React, { Component } from 'react';
import '../css/Profile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import SelectMenu from './SelectMenu';
import Footer from './Footer';


export default class Profile extends Component {

    render() {
        return (
        <div className="profile">
            <div className="headerProfile">
                <a href='/' className="back"><FontAwesomeIcon icon={faAngleLeft} className="fi_menu"/> Vratite se na početnu</a>
                <div className="buttonLogOut">
                    <button className="logOut"><a href="/"> <span className="textLogOut">Odjavite se</span> </a></button>
                </div>
            </div>
            <SelectMenu />
            <Footer />
        </div>
    );
  }
}