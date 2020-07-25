import React, { Component } from 'react';
import '../css/ImgOnHomepage.css';
// import { Link } from 'react-router-dom';

class ImgOnHomepage extends Component {
  
  render(){

    return (
        <div className="ImgOnHomepage">
            <img src="/background.jpg" alt="image_header"/>
            <button className="btnLogIn"><a href="/login"> <span className="textBtn">Prijavite se</span> </a></button>
            <button className="btnSignIn"> <a href="/signin">Registrujte se </a></button>
        </div>
    );
  }
}

export default ImgOnHomepage;