import React from 'react';
import '../css/Header.css'

class Header extends React.Component {

  render() {
    return (
      <div className="header">
            <div className="logo_header">
                <a href="/">
                    <img src="/logo.png" alt="logo" className="logo" />
                </a>
            </div>

            <div className="NB_css">
                <ul>
                    <li>
                        <a href="/"> USLUGE </a>
                    </li>
                    <li>
                        <a href="/"> GRADOVI </a>
                    </li>
                    <li>
                        <a href="/#oNama"> O NAMA </a> 
                    </li>
                    <li>
                        <a href="/#ponuda"> KONTAKT </a>
                    </li>
                    <li>
                        <a href="/#"> TIM </a>
                    </li>
                </ul>
                

            </div>
            <div className="buttonsHeader">
                <button className="btnLogIn"><a href="/login"> <span className="textBtn">Prijavite se</span> </a></button>
                <button className="btnSignIn"> <a href="/register">  <span className="textBtn">Registrujte se </span></a></button>
            </div>
      </div>
      );
  }

}

export default Header;