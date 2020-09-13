import React, { Component } from 'react';
import '../css/Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
          forUser: {
              password: '',
              confirmPassword: ''
          }
      };

      this.onPasswordChange = this.onPasswordChange.bind(this);
      this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
      this.handleSubmitForUser = this.handleSubmit.bind(this);
    }

    checkValidityOfPassword(entity) {
        const validationPasswordRegex = new RegExp("^(?=.*\\d).{4,12}$");

        if (entity.password === '' || !validationPasswordRegex.test(entity.password)) {
            window.alert("Please insert valid password!");
            return false;
        }

        return true;
    }

    onPasswordChange(password) {
        const forUser = {
            password: password.target.value,
            confirmPassword: this.state.forUser.confirmPassword,
        };
        this.setState({
            forUser
        });
    }

    onConfirmPasswordChange(password) {
        const forUser = {
            password: this.state.forUser.password,
            confirmPassword: password.target.value,
        }
        this.setState({
            forUser
        });
    }

    handleSubmit() {
        const forUser = this.state.forUser;

        let valid = this.checkValidityOfPassword(forUser);
        if (!valid) {
            return ;
        }

        document.getElementById("resetPassword").reset();
        console.log(forUser);
    }

    render() {
        return (
        <div className="login">
            <div className="imgLogin">
                <img src="/slika3.jpg" alt=''></img>
            </div>
            <div className="formular">

                <a href='/' className="back"><FontAwesomeIcon icon={faAngleLeft} className="fi_menu"/> Vratite se na početnu</a>
                <div className="container" id="logInUser">

                    <h2 className="titleFormLogin">Potvrdite šifru</h2>
                    <form id="resetPassword">

                        <div className="form-group">
                            <label htmlFor="pwd">Šifra:</label>
                            <input type="password" className="form-control" id="pwdUser" placeholder="Unesite šifru" name="pwd" onChange={this.onPasswordChangeForUser}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Potvrdite šifru:</label>
                            <input type="password" className="form-control" id="pwdUser" placeholder="Unesite šifru" name="pwd" onChange={this.onConfirmPasswordChange}/>
                        </div>

                        <button type="button" onClick={this.handleSubmit} id="submitLogin" className="btn btn-success">Sačuvajte</button>
                        
                        <p className="goToLogin">Nemate svoj nalog? <a href='/register'>Kreirajte ga!</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
  }
}