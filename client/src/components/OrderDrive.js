import React, { Component } from 'react';
import '../css/OrderDrive.css';
import Header from './Header';
import MapForOrder from './MapForOrder';
import Footer from './Footer';


export default class OrderDrive extends Component {

    render() {
        return (
        <div className="orderDrive">
            <Header logout="logout" />
            <MapForOrder />
            <Footer />
            
        </div>
    );
  }
}