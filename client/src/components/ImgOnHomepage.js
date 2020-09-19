import React, { Component } from 'react';
import '../css/ImgOnHomepage.css';
import Particles from 'react-particles-js';

class ImgOnHomepage extends Component {
  
  render(){

    return (
        <div className="ImgOnHomepage">
            <Particles 
                height="100vh"
                params={{
                    "particles": {
                        "number": {
                            "value": 100
                        },
                        "size": {
                            "value": 3
                        },
                        "color": {
                            "value": "#146f88"
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#146f88",
                            "opacity": 0.4,
                            "width": 1
                          },
                          "move": {
                            "enable": true,
                            "speed": 1,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "bounce",
                            "bounce": false,
                            "attract": {
                              "enable": false,
                              "rotateX": 600,
                              "rotateY": 1200
                            }
                          }

                    },
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "repulse"
                            }
                        }
                    }
                }}
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: "rgb(15, 64, 82)",
                    marginTop: "50px"

                }}
                children={{
                    
                }}
            />
            <div className="text">
                <h1 id="titleCarGo">CarGo simulator</h1>
            </div>
        </div>
    );
  }
}

export default ImgOnHomepage;