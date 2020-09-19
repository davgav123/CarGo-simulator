import React from 'react';
import '../css/Homepage.css'
import Header from './Header';
import ImgOnHomepage from './ImgOnHomepage';
import MiddleHomepage from './MiddleHomepage';


import Footer from './Footer';

class Homepage extends React.Component {

  render() {
    return (
      <div className="homepage">
        <Header />
        <ImgOnHomepage />
        <MiddleHomepage />
        <Footer />
      </div>
      );
  }

}

export default Homepage;