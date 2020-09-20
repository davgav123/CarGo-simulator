import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Homepage from './components/Homepage';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ForgotPasswordAgain from './components/ForgotPasswordAgain';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import OrderDrive from './components/OrderDrive';
import LoginFirst from './components/LoginFirst';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/registracija" exact component={Register} />
        <Route path="/prijavljivanje" exact component={Login} />
        <Route path="/prijavljivanjePrvo/:userid/:token" exact component={LoginFirst} />  
  
        <Route path="/zaboravljenaSifra" exact component={ForgotPassword} />
        <Route path="/forgotPasswordAgain" exact component={ForgotPasswordAgain} />     
        <Route path="/resetPassword" exact component={ResetPassword} /> 
        <Route path="/profil" exact component={Profile} /> 
        <Route path="/narucivanjeVoznje" exact component={OrderDrive} /> 

      </Switch>
    </BrowserRouter>
  );
}

export default App;