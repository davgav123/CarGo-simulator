import React, { Component } from 'react';
import '../css/Register.css';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forUser: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: ''
            },
            forDriver: {
                email: '',
                firstName: '',
                lastName: '',
                jmbg: '', 
                datumRodjenja: '', 
                drzava: '', 
                grad: '', 
                telefon: '',
                car: '',
                adresa: '',
                password: '',
                confirmPassword: ''
            },
            disabledUser: true,
            disabledDriver: false
        };
    
        this.showFormForUser = this.showFormForUser.bind(this);
        this.showFormForDriver = this.showFormForDriver.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onPasswordConfirmChange = this.onPasswordConfirmChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    showFormForUser() {
        const formUser = document.getElementById("registerUser");
        const formDriver = document.getElementById("registerDriver");
        formUser.style.display = "block";
        formDriver.style.display = "none";
        this.setState({
            disabledUser: true,
            disabledDriver: false,
            forUser: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: ''
            }
        });
    }

    showFormForDriver() {
        const formUser = document.getElementById("registerUser");
        const formDriver = document.getElementById("registerDriver");
        formUser.style.display = "none";
        formDriver.style.display = "block";

        this.setState({
            disabledUser: false,
            disabledDriver: true,
        });
        document.getElementById("formUser").reset();
    }

    onEmailChange(email) {
        const forUser = {
            email: email.target.value,
            firstName: this.state.forUser.firstName,
            lastName: this.state.forUser.lastName,
            password: this.state.forUser.password,
            confirmPassword: this.state.forUser.confirmPassword
        }
        this.setState({
            forUser
        });
    }

    onNameChange(nameOfInput, input) {
        let firstName;
        let lastName;

        if (nameOfInput === "name") {
            firstName = input.target.value;
            lastName = this.state.forUser.lastName;
        } else if (nameOfInput === "lastName") {
            firstName = this.state.forUser.firstName;
            lastName = input.target.value;
        }

        const forUser = {
            email: this.state.forUser.email,
            firstName,
            lastName,
            password: this.state.forUser.password,
            confirmPassword: this.state.forUser.confirmPassword
        };

        this.setState({
            forUser
        });
    }

    onPasswordChange(password) {
        const forUser = {
            email: this.state.forUser.email,
            firstName: this.state.forUser.firstName,
            lastName: this.state.forUser.lastName,
            password: password.target.value,
            confirmPassword: this.state.forUser.confirmPassword
        };
        this.setState({
            forUser
        });
    }

    onPasswordConfirmChange(passwordConfirm) {
        const forUser = {
            email: this.state.forUser.email,
            firstName: this.state.forUser.firstName,
            lastName: this.state.forUser.lastName,
            password: this.state.forUser.password,
            confirmPassword: passwordConfirm.target.value
        };
        this.setState({
            forUser
        });
    }

    handleSubmit() {
        const forUser = this.state.forUser;
        if (forUser.email === '' || forUser.firstName === '' || forUser.lastName === '' ||
            forUser.password === '' || forUser.confirmPassword === '') {
            window.alert("Pogresan unos!");
            return;
        } else if (forUser.password !== forUser.confirmPassword) {
            window.alert("Sifre se ne poklapaju!");
            return;
        }
        console.log(forUser);
    }

    render() {

        return (
            <div className="signin">

                <div className="buttons">
                    <button type="button" disabled={this.state.disabledUser} onClick={this.showFormForUser} id="btnSignInUser" className="btn btn-success">Register as a user</button>
                    <button type="button" disabled={this.state.disabledDriver} onClick={this.showFormForDriver} id="btnSignInDriver" className="btn btn-success">Register as a driver</button>
                </div>

                <div className="container" id="registerUser">
                    <h2>Register as a user</h2>
                    <form id="formUser">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="emailUser" placeholder="Enter email" name="email" onChange={this.onEmailChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">First name:</label>
                            <input type="text" className="form-control" id="nameUser" placeholder="Enter first name" name="name" onChange={this.onNameChange.bind(this, "name")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last name:</label>
                            <input type="text" className="form-control" id="nameUser" placeholder="Enter last name" name="lastName" onChange={this.onNameChange.bind(this, "lastName")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwdUser" placeholder="Enter password" name="pwd" onChange={this.onPasswordChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Confirm password:</label>
                            <input type="password" className="form-control" id="pwdUserConfirm" placeholder="Enter password" name="pwd" onChange={this.onPasswordConfirmChange}/>
                        </div>

                        <button type="button" onClick={this.handleSubmit} className="btn btn-success">Submit</button>
                    </form>
                </div>

                <div className="container" id="registerDriver">
                    <h2>Register as a driver</h2>
                    <form>
                    <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="emailUser" placeholder="Enter email" name="email" onChange={this.onEmailChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">First name:</label>
                            <input type="text" className="form-control" id="nameUser" placeholder="Enter first name" name="name" onChange={this.onNameChange.bind(this, "name")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last name:</label>
                            <input type="text" className="form-control" id="nameUser" placeholder="Enter last name" name="lastName" onChange={this.onNameChange.bind(this, "lastName")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwdUser" placeholder="Enter password" name="pwd" onChange={this.onPasswordChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Confirm password:</label>
                            <input type="password" className="form-control" id="pwdUserConfirm" placeholder="Enter password" name="pwd" onChange={this.onPasswordConfirmChange}/>
                        </div>

                        <button type="button" onClick={this.handleSubmit} className="btn btn-success">Submit</button>
                    </form>
                </div>

            </div>
    );
  }
}

export default Register;