import React, { Component } from 'react';
import '../css/Login.css';

export default class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          forUser: {
              email: '',
              password: ''
          },
          forDriver: {
              email: '',
              password: ''
          },
          disabledUser: true,
          disabledDriver: false
      };

      this.showFormForUser = this.showFormForUser.bind(this);
      this.onEmailChangeForUser = this.onEmailChangeForUser.bind(this);
      this.onPasswordChangeForUser = this.onPasswordChangeForUser.bind(this);
      this.handleSubmitForUser = this.handleSubmitForUser.bind(this);

      this.showFormForDriver = this.showFormForDriver.bind(this);
      this.onEmailChangeForDriver = this.onEmailChangeForDriver.bind(this);
      this.onPasswordChangeForDriver = this.onPasswordChangeForDriver.bind(this);
      this.handleSubmitForDriver = this.handleSubmitForDriver.bind(this);
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

    showFormForUser() {
      const formUser = document.getElementById("logInUser");
      const formDriver = document.getElementById("logInDriver");

      formUser.style.display = "block";
      formDriver.style.display = "none";

      this.setState({
          disabledUser: true,
          disabledDriver: false,
          forUser: {
              email: '',
              password: ''
          }
      });
      document.getElementById("formDriver").reset();
    }

    showFormForDriver() {
        const formUser = document.getElementById("logInUser");
        const formDriver = document.getElementById("logInDriver");

        formUser.style.display = "none";
        formDriver.style.display = "block";

        this.setState({
            disabledUser: false,
            disabledDriver: true,
            forDriver: {
                email: '',
                password: ''
            }
        });
        document.getElementById("formUser").reset();
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

    onEmailChangeForDriver(email) {
        const forDriver = {
            email: email.target.value,
            password: this.state.forDriver.password
        }
        this.setState({
            forDriver
        });
    }

    onPasswordChangeForDriver(password) {
        const forDriver = {
            email: this.state.forDriver.email,
            password: password.target.value
        };
        this.setState({
            forDriver
        });
    }

    handleSubmitForDriver() {
        const forDriver = this.state.forDriver;

        let valid = this.checkValidityOfEmailAndPassword(forDriver);
        if (!valid) {
            return ;
        }

        document.getElementById("formDriver").reset();
        console.log(forDriver);
    }

    render() {
        return (
        <div className="login">

            <div className="buttons">
                <button type="button" disabled={this.state.disabledUser} onClick={this.showFormForUser} id="btnLogInUser" className="btn btn-success">Log in as a user</button>
                <button type="button" disabled={this.state.disabledDriver} onClick={this.showFormForDriver} id="btnLogInDriver" className="btn btn-success">Log in as a driver</button>
            </div>

            <div className="container" id="logInUser">
                <h2>Log in as a user</h2>
                <form id="formUser">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="emailUser" placeholder="Enter email" name="email" onChange={this.onEmailChangeForUser}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" id="pwdUser" placeholder="Enter password" name="pwd" onChange={this.onPasswordChangeForUser}/>
                    </div>

                    <button type="button" onClick={this.handleSubmitForUser} className="btn btn-success">Log In</button>
                </form>
            </div>

            <div className="container" id="logInDriver">
                <h2>Log in as a driver</h2>
                <form id="formDriver">
                <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="emailDriver" placeholder="Enter email" name="email" onChange={this.onEmailChangeForDriver}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" id="pwdDriver" placeholder="Enter password" name="pwd" onChange={this.onPasswordChangeForDriver}/>
                    </div>

                    <button type="button" onClick={this.handleSubmitForDriver} className="btn btn-success">Log In</button>
                </form>
            </div>

        </div>
    );
  }
}