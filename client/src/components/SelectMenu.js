import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import Map from './MapForProfile';
import '../css/SelectMenu.css';
import ChangePassword from './ChangePassword';

class SelectMenu extends Component {
  render() {

    return (
        <div className="selectMenu">
            <Tabs defaultActiveKey="myRides" id="uncontrolled-tab-example" className="tabs">
                <Tab eventKey="myRides" title="Moje vožnje" >
                    <Map />    
                </Tab>
                <Tab eventKey="myProfil" title="Moj profil">
                    
                </Tab>
                <Tab eventKey="changePassword" title="Promenite šifru">
                    <ChangePassword />
                </Tab>
            </Tabs>
        </div>
    );
  }
}

export default SelectMenu;