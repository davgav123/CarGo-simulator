import React, { Component } from 'react';
import '../css/Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          forUser: {
              email: '',
              password: ''
          }
      };

      this.onEmailChangeForUser = this.onEmailChangeForUser.bind(this);
      this.onPasswordChangeForUser = this.onPasswordChangeForUser.bind(this);
      this.handleSubmitForUser = this.handleSubmitForUser.bind(this);
    }

    checkValidityOfEmailAndPassword(entity) {
        const validationEmailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");
        const validationPasswordRegex = new RegExp("^(?=.*\\d).{4,12}$");

        if (entity.email === '' || !validationEmailRegex.test(entity.email)) {
            window.alert("Please insert valid email!");
            return false;
        } else if (entity.password === '' || !validationPasswordRegex.test(entity.password)) {
            window.alert("Please insert valid password!");
            return false;
        }

        return true;
    }

    onEmailChangeForUser(email) {
        const forUser = {
            email: email.target.value,
            password: this.state.forUser.password
        }
        this.setState({
            forUser
        });
    }

    onPasswordChangeForUser(password) {
        const forUser = {
            email: this.state.forUser.email,
            password: password.target.value
        };
        this.setState({
            forUser
        });
    }

    handleSubmitForUser() {
        const forUser = this.state.forUser;

        let valid = this.checkValidityOfEmailAndPassword(forUser);
        if (!valid) {
            return ;
        }

        document.getElementById("formUser").reset();
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

                    <h2 className="titleFormLogin">Prijavite se na svoj nalog</h2>
                    <form id="formUser">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="emailUser" placeholder="Unesite email" name="email" onChange={this.onEmailChangeForUser}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Šifra:</label>
                            <input type="password" className="form-control" id="pwdUser" placeholder="Unesite šifru" name="pwd" onChange={this.onPasswordChangeForUser}/>
                        </div>

                        <button type="button" onClick={this.handleSubmitForUser} id="submitLogin" className="btn btn-success">Prijavite se</button>
                        <div className="goToForgotPassword"> 
                            <a href="/forgotPassword">Zaboravili ste šifru?</a>
                        </div>
                        <p className="goToLogin">Nemate svoj nalog? <a href='/register'>Kreirajte ga!</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
  }
}