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
                        <a href="/"> POČETNA </a>
                    </li>
                    <li>
                        <a href="/#"> O NAMA </a> 
                    </li>
                    <li>
                        <a href="/#"> PONUDA </a>
                    </li>
                    <li>
                        <a href="/#"> TIM </a>
                    </li>
                </ul>
            </div>
      </div>
      );
  }

}

export default Header;