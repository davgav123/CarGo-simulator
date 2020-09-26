import React from 'react';
import '../css/Header.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            linkResponse: [],
            backgroundColor: "rgb(15, 64, 82, 1)",

        };
    }
    logout() {
        localStorage.setItem("accessToken", '');
        localStorage.setItem("refreshToken", '');
    }
    componentDidMount() {
        let header = document.getElementById("header");
        
        if (this.props.logout === 'logout') {
            this.setState({
                buttons: [
                    <button key={1} className="btnProfile"><a href="/profil"> <span className="textBtn">Moj profil</span> </a></button>,
                    <button key={2} className="btnLogOut" onClick={this.logout}><a href="/"> <span className="textBtn">Odjavite se</span> </a></button>
                ],
                linkResponse: [
                    <li key={7}> <a href="/profil">Moj profil </a></li>,
                    <li key={8}> <a href="/">Odjavite se</a></li>
                ]
            });
            header.style.marginTop = "0px";
        } else {
            window.addEventListener('scroll', () => {
                const isTop = window.scrollY < 300;
                if (isTop) {
                  this.setState({backgroundColor: "rgb(15, 64, 82, 0)"});
                } else {
                  this.setState({backgroundColor: "rgb(15, 64, 82, 0.9)"});
                }
              });
            
            this.setState({
                buttons: [
                    <button key={1} className="btnLogIn"><a href="/prijavljivanje"> <span className="textBtn">Prijavite se</span> </a></button>,
                    <button key={2} className="btnSignIn"> <a href="/registracija">  <span className="textBtn">Registrujte se </span></a></button>
                ],
                linkResponse: [
                    <li key={7}> <a href="/prijavljivanje">Prijavite se </a></li>,
                    <li key={8}> <a href="/registracija">Registrujte se</a></li>
                ]
            });
            header.style.marginTop = "50px";

        }
    }

    handleChange({target}){
        let nb = document.getElementById('NB_css_response');
        if (target.checked){
          nb.style.display = "block";
        } else {
          nb.style.display = "none";
        }
    }

    render() {
        return (
            <div>
                <div className="header" id="header" style={{ backgroundColor: `${this.state.backgroundColor}` }}>
                    <div className="logo_header">
                        <a href="/">
                            <img src="/logo.png" alt="logo" className="logo" />
                        </a>
                    </div>

                    <div className="NB_css">
                        <ul>
                            <li>
                                <a href="/#usluge"> Usluge </a>
                            </li>
                            <li>
                                <a href="/#gradovi"> Gradovi </a>
                            </li>
                            <li>
                                <a href="/#oNama"> O nama </a> 
                            </li>
                            <li>
                                <a href="/#kontakt"> Kontakt </a>
                            </li>
                            <li>
                                <a href="/#tim"> Tim </a>
                            </li>
                        </ul>
                        

                    </div>
                    <div className="buttonsHeader">
                        {this.state.buttons}
                    </div>
                </div>
                <div className="header_response">
                    <div className="linija_header_response">
                        <a href="/">
                            <img src="/logo.png" alt="logo" className="logo" />
                        </a>
                        <div className="fa_bars">
                            <label htmlFor="check" className="checkbtn">
                                <input type="checkbox" id="check" onClick={this.handleChange}
                                            defaultChecked={this.props.complete}/>
                                <FontAwesomeIcon icon={faBars} className="fa_bars_icon"/>
                            </label>
                        </div>
                    </div>

                    <div className="NB_css_response" id="NB_css_response">
                        <ul>
                            <li>
                                <a href="/#uslugeResponse"> Usluge </a>
                            </li>
                            <li>
                                <a href="/#gradoviResponse"> Gradovi </a>
                            </li>
                            <li>
                                <a href="/#oNamaResponse"> O nama </a> 
                            </li>
                            <li>
                                <a href="/#kontaktResponse"> Kontakt </a>
                            </li>
                            <li>
                                <a href="/#timResponse"> Tim </a>
                            </li>
                            {this.state.linkResponse}
                        </ul>
                    </div>
                </div>
            </div>
      );
  }

}

export default Header;