import React, { Component } from 'react';
import '../css/ForgotPassword.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
          forUser: {
              email: ''
          }
      };

      this.onEmailChange = this.onEmailChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    checkValidityOfEmail(entity) {
        const validationEmailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");

        if (entity.email === '' || !validationEmailRegex.test(entity.email)) {
            window.alert("Please insert valid email!");
            return false;
        } 

        return true;
    }

    onEmailChange(email) {
        const forUser = {
            email: email.target.value,
            password: this.state.forUser.password
        }
        this.setState({
            forUser
        });
    }

    handleSubmit() {
        const forUser = this.state.forUser;

        let valid = this.checkValidityOfEmail(forUser);
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

                <a href='/login' className="back"><FontAwesomeIcon icon={faAngleLeft} className="fi_menu"/> Vratite se na prijavu</a>
                <div className="container">

                    <h2 className="titleFormForgotPassword">Promenite šifru</h2>
                        <p>Da biste promenili šifru potrebno je da unesete email sa kojim ste napravili nalog </p>
                
                    <form id="formUser">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="emailUser" placeholder="Unesite email" name="email" onChange={this.onEmailChangeForUser}/>
                        </div>

                        <button type="button" onClick={this.handleSubmit} id="submitLogin" className="btn btn-success">Potvrdite</button>
                        <p className="goToLogin">Nemate svoj nalog? <a href='/register'>Kreirajte ga!</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
  }
}