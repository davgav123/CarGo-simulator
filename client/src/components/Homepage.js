import React from 'react';
import '../css/Homepage.css'
import Header from './Header';
import ImgOnHomepage from './ImgOnHomepage';

class Homepage extends React.Component {

  render() {
    return (
      <div className="homepage">
          <Header />
          <ImgOnHomepage />
      </div>
      );
  }

}

export default Homepage;