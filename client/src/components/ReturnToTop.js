import React, { Component } from "react";
import ScrollToTop from "react-scroll-up";
import '../css/ReturnToTop.css'

class ReturnToTop extends Component {

  render(){
    return (
        <ScrollToTop showUnder={160}  >
        <img src="/backToTop.png" alt="back" className="returnLogo"/>
        </ScrollToTop>
    );
    }
}

export default ReturnToTop;