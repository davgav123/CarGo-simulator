import React from 'react';
import '../css/Footer.css';
import { Link } from 'react-router-dom';
import ReturnToTop from 'react-scroll-to-top';

function Footer() {
    return (
        <div className="footer">
            <div className="containter">
                <div className="aboutUs">
                    <p> ABOUT US </p>
                    <p> Founded in 2020 in Belgrade, Serbia with a mission<br/> to provide our clients with reliable and easy to use
                    application. </p>
                </div>
            </div>

            <div className="copyright">
                <p> Copyright © 2020, All Rights Reserved </p>
                <ReturnToTop />
            </div>
        </div>
    );
}
export default Footer;

