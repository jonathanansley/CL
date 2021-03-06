import React from 'react';
import {HeaderNavigation} from "./";
import './Header.css';
import logo from './clLogo.svg';

class Header extends React.Component {
  render(){
    return (
      <div className="Header">
        <div className="Header-logo-block">
          <img src={logo} className="Header-logo" alt="logo" />
          <p><a href="/">CRAIGSLIST</a> </p>
        </div>
        <HeaderNavigation />
      </div>
    )
  }
}

export default Header;
