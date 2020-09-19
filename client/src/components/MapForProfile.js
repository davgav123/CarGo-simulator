import React from 'react';
import '../css/MapForProfile.css';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from 'react-google-maps'
import { compose } from "recompose"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

let path = [];
let center = {};

class MapForProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: center,
            path: path
        };
    }

    shouldComponentUpdate(_nextProps, _nextState) {
        if (center !== this.state.center || path !== this.state.path) {
            this.setState({
                center: center,
                path: path
            });

            return true;
        }
        return false;
    }
    
    render() {
        return (
            <div className="myRides">
                <div>
                    <GoogleMap
                        defaultZoom={17}
                        center={this.state.center}
                    >
                        <Marker position={center} />
                        <Polyline path={this.state.path} options={{ strokeColor: "#FF0000 " }} />

                    </GoogleMap>
                </div>

            </div>
        );
      }
}

const MapComponent = compose(withScriptjs, withGoogleMap) (MapForProfile);

export default class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            center: {},
            path: [],
            date: new Date(),
            selectedDriving: 'none',
            allDriving: '',
            showRides: true
        };

        this.showDrive = this.showDrive.bind(this);
        this.showAllDrive = this.showAllDrive.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDriving = this.handleDriving.bind(this);
    }
    
    componentDidMount() {
        center = {
            lat: 44.787197,
            lng: 20.457273
        };

        this.setState({
            center: center,
            path: []
        });
    }

    showDrive() {
        if (this.state.selectedDriving!== 'none') {
            path = [
                { lat: 18.558908, lng: -68.389916 },
                { lat: 18.558853, lng: -68.389922 },
                { lat: 18.558375, lng: -68.389729 },
                { lat: 18.558032, lng: -68.389182 },
                { lat: 18.55805, lng: -68.388613 },
                { lat: 18.558256, lng: -68.388213 },
                { lat: 18.558744, lng: -68.387929 }
            ];
            center = {
                lat: path[0].lat,
                lng: path[0].lng
            }
            this.setState({
                center: center,
                path: path
            });
            let infoForDrive = document.getElementById("infoForDrive");
            infoForDrive.style.display = "block";

        } else {
            window.alert("Niste izabrali vožnju");
        }
    }

    handleDate(date) {
        console.log(date);
        this.setState({
            date: date
        });
    }

    handleDriving(driving) {
        this.setState({
            selectedDriving: driving.target.value
        });
        console.log(driving.target.value)
    }

    showAllDrive() {
        let showDriving = document.getElementById("showRides");
        showDriving.style.disabled = false;
        let allDriving = [];
        for (let i = 0; i<3; i++) {
            allDriving.push(<option key={i} value="medakoviceva">Medakoviceva 95 - Trg Republike</option>);
        }
        this.setState({
            allDriving: allDriving,
            showRides: false
        });
    }

    render() {
        return (
            <div className="mapForProfile">
                <h2 className="titleMyDriving">Moje vožnje</h2>

                <div className="options">
                    <div className="dateOfDrive">
                        <DatePicker
                            selected={this.state.date}
                            onChange={this.handleDate}
                            height="38px"
                        />
                        <button type="button" id="showAllRides" onClick={this.showAllDrive} className="btn btn-success">Prikažite vožnje</button>

                        <select className="browser-default custom-select" name="size" id="selectDriving" onChange={this.handleDriving}>
                            <option value="none">Izaberite vožnju</option>
                            {this.state.allDriving}
                        </select>

                        <button type="button" id="showRides" disabled={this.state.showRides} onClick={this.showDrive} className="btn btn-success">Prikažite vožnju</button>
                    </div>
                    
                </div>
                <div className="map">
                <MapComponent
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAeN0p_YCJ6boBl5Wv-IzYLd4i8da12iH4&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px`, width: '100%' }} />}
                    mapElement={<div style={{ height: `100%` }} 
                    />}
                />
                </div>

                    <div className="infoForDrive" id="infoForDrive">
                    <div className="table-responsive" style={{width: "95%"}}>
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">Status vožnje</th>
                            <th scope="col">Ocena vožnje</th>
                            <th scope="col">Prva kilometraža</th>
                            <th scope="col">Druga kilometraža</th>
                            <th scope="col">Prvo vreme</th>
                            <th scope="col">Drugo vreme</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row"></th>
                            <td>Lorem ipsum</td>
                            <td>Lorem ipsum</td>
                            <td>Lorem ipsum</td>
                            <td>Lorem ipsum</td>
                            <td>Lorem ipsum</td>
                            <td>Lorem ipsum</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    </div>
            </div>
        );
    }
}
