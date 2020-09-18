import React from 'react';
import '../css/Header.css'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            backgroundColor: "rgb(15, 64, 82, 1)",

        };
    }
    componentDidMount() {
        let header = document.getElementById("header");
        if (this.props.logout === 'logout') {
            this.setState({
                buttons: [
                    <button key={1} className="btnProfile"><a href="/profil"> <span className="textBtn">Moj profil</span> </a></button>,
                    <button key={2} className="btnLogOut"><a href="/"> <span className="textBtn">Odjavite se</span> </a></button>
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
                ]
            });
            header.style.marginTop = "50px";

        }
    }
    render() {
        return (
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
      );
  }

}

export default Header;