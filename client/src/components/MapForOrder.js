import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import '../css/MapForOrder.css';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from 'react-google-maps';
import { compose } from "recompose";
import axios from 'axios';


let path = [];
let center = {};
let initialDate = new Date();
let pathDist = [];
let dist = 0;



class MapForOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: [],
            center: center,
            path: path
        };
    }

    velocity = 10;

    getDistance = () => {
        const differentInTime = (new Date() - initialDate) / 1000;
        return differentInTime * this.velocity;
    }

    componentWillUnmount = () => {
        window.clearInterval(this.interval);
    }

    moveObject = () => {
        const distance = this.getDistance();
        if (!distance) {
            return;
        }

        let progress = pathDist.filter(coordinates => coordinates.distance < distance);
        const nextLine = pathDist.find(coordinates => coordinates.distance > distance);
        if (!nextLine) {
            if (dist === 0) {
                path = [
                    { lat: 18.558744, lng: -68.387929 },
                    { lat: 18.558256, lng: -68.388213 },
                    { lat: 18.55805, lng: -68.388613 },
                    { lat: 18.558032, lng: -68.389182 }
                ];
                window.clearInterval(this.interval);
                this.setState({ progress: [] });
                dist += 1;
            } else {
                dist += 1;
                window.clearInterval(this.interval);
                let dialog = document.getElementById("dialog");
                dialog.style.display = "block";
                this.setState({ progress });
            }

            return;
        }

        let point1, point2;

        if (nextLine) {
            point1 = progress[progress.length - 1];
            point2 = nextLine;
        } else {
            point1 = progress[progress.length - 2];
            point2 = progress[progress.length - 1];
        }

        const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
        const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);

        const angle = window.google.maps.geometry.spherical.computeHeading(
            point1LatLng,
            point2LatLng
        );

        const actualAngle = angle - 90;

        const markerUrl =
            "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png";
        const marker = document.querySelector(`[src="${markerUrl}"]`);

        if (marker) {
            marker.style.transform = `rotate(${actualAngle}deg)`;
        }

        const lastLine = progress[progress.length - 1];

        const lastLineLatLng = new window.google.maps.LatLng(
            lastLine.lat,
            lastLine.lng
        );

        const nextLineLatLng = new window.google.maps.LatLng(
            nextLine.lat,
            nextLine.lng
        );

        // distance of this line 
        const totalDistance = nextLine.distance - lastLine.distance;
        const percentage = (distance - lastLine.distance) / totalDistance;

        const position = window.google.maps.geometry.spherical.interpolate(
            lastLineLatLng,
            nextLineLatLng,
            percentage
        );

        progress = progress.concat(position);
        this.setState({ progress });
    }

    componentDidUpdate() {
        if (path !== this.state.path && path !== [] && dist <= 1) {
            pathDist = path.map((coordinates, i, array) => {
                if (i === 0) {
                    return { ...coordinates, distance: 0 };
                }

                const { lat: lat1, lng: lng1 } = coordinates;
                const latLong1 = new window.google.maps.LatLng(lat1, lng1);
    
                const { lat: lat2, lng: lng2 } = array[0];
                const latLong2 = new window.google.maps.LatLng(lat2, lng2);
    
                const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    latLong1,
                    latLong2
                );
    
                return { ...coordinates, distance };
            });

            this.setState({
                path: path
            });
            initialDate = new Date();

            this.interval = window.setInterval(this.moveObject, 10);
            
            return true;
        }
        return false;
    }

    render = () => {
        const icon = {
            url: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png',
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: { x: 10, y: 10 }
        }
        return (
            <GoogleMap
                defaultZoom={18}    
                center={center}
            >
                { this.state.progress && (
                    <>
                    <Polyline path={this.state.path} options={{ strokeColor: "#FF0000 "}} />
                    <Marker position={this.state.progress[this.state.progress.length - 1]} icon={icon}/>
                    </>
                )}
            </GoogleMap>
        )
    }
}

const MapComponent = compose(withScriptjs, withGoogleMap) (MapForOrder);

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: {},
            path: [],
            addressStart: '',
            city: 'none',
            addressEnd: '',
            open: true,
            mark: 3,
            infoForDrive: false
        };
        this.submitOrder = this.submitOrder.bind(this);
        this.onAddressStartChange = this.onAddressStartChange.bind(this);
        this.onAddressEndChange = this.onAddressEndChange.bind(this);
        this.handleCity = this.handleCity.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.changeMark = this.changeMark.bind(this);

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

    onAddressStartChange(addressStart) {
        this.setState({
            addressStart: addressStart.target.value
        });
    }

    handleCity(city) {
        this.setState({
            city: city.target.value
        });
    }

    onAddressEndChange(addressEnd) {
        this.setState({
            addressEnd: addressEnd.target.value
        });
    }

    submitOrder() {
        if (this.state.city !== 'none' || this.state.addressStart !== '' || this.state.addressEnd !== '') {
            let accessToken = localStorage.getItem("accessToken");
            // let refreshToken = localStorage.getItem("refreshToken");
            const body = {
                StartAddress: this.state.addressStart,
                Locality: this.state.city,
                EndAddress: this.state.addressEnd
            }
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };

            axios.post('http://localhost:49943/api/Drive/Customer', body, config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
            // const tokens = {
            //     AccessToken: accessToken,
            //     RefreshToken: refreshToken
            // };

            // axios.post('http://localhost:49943/api/Token/Refresh', tokens)
            // .then((response) => {
            //     accessToken = response.data.accessToken;
            //     refreshToken = response.data.refreshToken;
            //     localStorage.setItem("accessToken", accessToken);
            //     localStorage.setItem("refreshToken", refreshToken);
                
            //     const body = {
            //         StartAddress: this.state.addressStart,
            //         Locality: this.state.city,
            //         EndAddress: this.state.addressEnd
            //     }
            //     const config = {
            //         headers: { Authorization: `Bearer ${accessToken}` }
            //     };
    
            //     axios.post('http://localhost:49943/api/Drive/Customer', body, config)
            //     .then((response) => {
            //         console.log(response);
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
            // })
            // .catch((error) => {
            //     console.log(error);
            // });
            
            // path = [
            //     { lat: 18.558908, lng: -68.389916 },
            //     { lat: 18.558853, lng: -68.389922 },
            //     { lat: 18.558375, lng: -68.389729 },
            //     { lat: 18.558032, lng: -68.389182 },
            //     { lat: 18.55805, lng: -68.388613 },
            //     { lat: 18.558256, lng: -68.388213 },
            //     { lat: 18.558744, lng: -68.387929 }
            // ];

            // center = {
            //     lat: path[0].lat,
            //     lng: path[0].lng
            // };

            // initialDate = new Date();
            // dist = 0;
            // this.setState({
            //     center: center,
            //     path: path,
            //     open: true,
            //     indForOrder: true
            // });
            // let dialog = document.getElementById("dialog");
            // dialog.style.display = "none";
            // let table = document.getElementById("infoForDrive");
            // table.style.display = "block";
            
        } else {
            window.alert("Niste uneli adresu");
        }
    }

    closeDialog() {
        this.setState({
            open: true
        });
        let dialog = document.getElementById("dialog");
        dialog.style.display = "none";
    }
    changeMark(event) {
        this.setState({
            mark: event.target.value,
            indForOrder: false,
            open: true,
            addressStart: '',
            city: 'none',
            addressEnd: ''
        });
        let dialog = document.getElementById("dialog");
        dialog.style.display = "none";
        document.getElementById("order").reset();
        
    }
    render() {

        return (
            <div className="mapForOrder">
            <form id="order">

                <div className="order">
                    <label htmlFor="addressStart" id="labelStart">Adresa početka:</label>
                    <input type="text" className="form-control" id="addressStart" placeholder="Unesite adresu" name="addressStart" onChange={this.onAddressStartChange}/>

                    <select className="browser-default custom-select" name="size" id="selectCity" onChange={this.handleCity}>
                        <option value="none">Izaberite grad</option>
                        <option value="beograd">Beograd</option>
                        <option value="novi sad">Novi Sad</option>
                    </select>

                    <label htmlFor="addressEnd" id="labelEnd">Izaberite destinaciju:</label>
                    <input type="text" className="form-control" id="addressEnd" placeholder="Unesite adresu" name="addressEnd" onChange={this.onAddressEndChange}/>
                    <button type="button" id="submitOrderDrive" disabled={this.state.indForOrder} onClick={this.submitOrder} className="btn btn-success">Naručite vožnju</button>
                </div>
                </form>
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
                                <th scope="col">Ime vozača</th>
                                <th scope="col">Broj telefona</th>
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
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.closeDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        id="dialog"
                    >
                        <DialogTitle id="alert-dialog-title">{"OCENITE VOŽNJU"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Hvala što ste koristili naše usluge!
                            </DialogContentText>
                        </DialogContent>   
                        <Rating
                            name="hover-feedback"
                            id="rating"
                            onChange={this.changeMark}
                            // value={value}
                            defaultValue={2}
                            precision={0.5}
                        />
                        {<Box ml={2}></Box>}

                    </Dialog>
                </div>

            </div>
        );
    }
}
