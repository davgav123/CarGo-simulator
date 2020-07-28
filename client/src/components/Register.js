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
                personalId: '', 
                city: '', 
                phoneNumber: '',
                vehicleId: '',
                vehicleModel: '',
                address: '',
                password: '',
                confirmPassword: ''
            },
            disabledUser: true,
            disabledDriver: false
        };
    
        this.showFormForUser = this.showFormForUser.bind(this);
        this.onEmailChangeForUser = this.onEmailChangeForUser.bind(this);
        this.onPasswordChangeForUser = this.onPasswordChangeForUser.bind(this);
        this.onPasswordConfirmChangeForUser = this.onPasswordConfirmChangeForUser.bind(this);
        this.handleSubmitForUser = this.handleSubmitForUser.bind(this);

        this.showFormForDriver = this.showFormForDriver.bind(this);
        this.onEmailChangeForDriver = this.onEmailChangeForDriver.bind(this);
        this.onPasswordChangeForDriver = this.onPasswordChangeForDriver.bind(this);
        this.onPasswordConfirmChangeForDriver = this.onPasswordConfirmChangeForDriver.bind(this);
        this.handleSubmitForDriver = this.handleSubmitForDriver.bind(this);
    }
    
    checkFormValidity(entity) {
        const validationEmailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");
        const validationNameRegex = new RegExp("[a-zA-Z]+");
        const validationPasswordRegex = new RegExp("^(?=.*\\d).{4,12}$");

        if (entity.email === '' || !validationEmailRegex.test(entity.email)) {
            window.alert("Please insert valid email!");
            return false;
        } else if (entity.name === '' || !validationNameRegex.test(entity.name)) {
            window.alert("Name must contain only letters!");
            return false;
        } else if (entity.lastName === '' || !validationNameRegex.test(entity.lastName)) {
            window.alert("Last name must contain only letters!");
            return false;
        } else if (entity.password === '' || !validationPasswordRegex.test(entity.password)) {
            window.alert("Password must contain between 4-12 characters and at least one digit!");
            return false;
        } else if (entity.password !== entity.confirmPassword) {
            window.alert("Passwords do not match!");
            return false;
        }

        return true;
    }

    checkFormValidityForDriver(entity) {
        const validationPersonalIdRegex = new RegExp("[0-9]{13}");
        const validationAddressRegex = new RegExp("[A-Za-z ]+\\s*[0-9]+[,]\\s*[0-9]{5}\\s*[A-Za-z]+");
        const validationVehicleIdRegex = new RegExp("[A-Z]{2}[0-9]{4}[A-Z]{2}");
        const validationVehicleModelRegex = new RegExp("[A-Za-z ]+");
        const validationPhoneNumberRegex = new RegExp("[0-9]{10}");
        
        if (entity.personalId === '' || !validationPersonalIdRegex.test(entity.personalId)) {
            window.alert("Please insert valid personal id!");
            return false;
        } else if (entity.address === '' || !validationAddressRegex.test(entity.address)) {
            window.alert("Please insert valid address!");
            return false;
        } else if (entity.phoneNumber === '' || !validationPhoneNumberRegex.test(entity.phoneNumber)) {
            window.alert("Please insert valid phone number!");
            return false;
        } else if (entity.vehicleId === '' || !validationVehicleIdRegex.test(entity.vehicleId)) {
            window.alert("Please insert valid vehicle id!");
            return false;
        } else if (entity.vehicleModel === '' || !validationVehicleModelRegex.test(entity.vehicleModel)) {
            window.alert("Please insert valid vehicle model!");
            return false;
        }

        return true;
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
        document.getElementById("formDriver").reset();
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

    onEmailChangeForUser(email) {
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

    onEmailChangeForDriver(email) {
        const forDriver = {
            email: email.target.value,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onNameChangeForUser(nameOfInput, input) {
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

    onNameChangeForDriver(nameOfInput, input) {
        let firstName;
        let lastName;

        if (nameOfInput === "name") {
            firstName = input.target.value;
            lastName = this.state.forDriver.lastName;
        } else if (nameOfInput === "lastName") {
            firstName = this.state.forDriver.firstName;
            lastName = input.target.value;
        }

        const forDriver = {
            email: this.state.forDriver.email,
            firstName,
            lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        };

        this.setState({
            forDriver
        });
    }

    onPasswordChangeForUser(password) {
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

    onPasswordChangeForDriver(password) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: password.target.value,
            confirmPassword: this.state.forDriver.confirmPassword
        };
        this.setState({
            forDriver
        });
    }

    onPasswordConfirmChangeForUser(passwordConfirm) {
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

    onPasswordConfirmChangeForDriver(passwordConfirm) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: passwordConfirm.target.value
        };
        this.setState({
            forDriver
        });
    }

    onPersonalIdChange(personalId) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: personalId.target.value,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onCityChange(city) {
        console.log(city.target.value);
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: city.target.value,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onAddressChange(address) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: address.target.value,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onPhoneNumberChange(phoneNumber) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: phoneNumber.target.value,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onVehicleIdChange(vehicleId) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: vehicleId.target.value,
            vehicleModel: this.state.forDriver.vehicleModel,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onVehicleModelChange(vehicleModel) {
        const forDriver = {
            email: this.state.forDriver.email,
            firstName: this.state.forDriver.firstName,
            lastName: this.state.forDriver.lastName,
            personalId: this.state.forDriver.personalId,
            city: this.state.forDriver.city,
            address: this.state.forDriver.address,
            phoneNumber: this.state.forDriver.phoneNumber,
            vehicleId: this.state.forDriver.vehicleId,
            vehicleModel: vehicleModel.target.value,
            password: this.state.forDriver.password,
            confirmPassword: this.state.forDriver.confirmPassword
        }
        this.setState({
            forDriver
        });
    }

    handleSubmitForUser() {
        const forUser = this.state.forUser;
        if (!this.checkFormValidity(forUser)) {
            return;
        }

        console.log(forUser);
        document.getElementById("formUser").reset();
    }

    handleSubmitForDriver() {
        const forDriver = this.state.forDriver;
        if (!this.checkFormValidity(forDriver)) {
            return;
        }

        if (!this.checkFormValidityForDriver(forDriver)) {
            return;
        }

        console.log(forDriver);
        document.getElementById("formDriver").reset();
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
                            <input type="email" className="form-control" id="emailUser" placeholder="Enter email" name="email" onChange={this.onEmailChangeForUser}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">First name:</label>
                            <input type="text" className="form-control" id="nameUser" placeholder="Enter first name" name="name" onChange={this.onNameChangeForUser.bind(this, "name")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last name:</label>
                            <input type="text" className="form-control" id="lastnameUser" placeholder="Enter last name" name="lastName" onChange={this.onNameChangeForUser.bind(this, "lastName")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwdUser" placeholder="Enter password" name="pwd" onChange={this.onPasswordChangeForUser}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Confirm password:</label>
                            <input type="password" className="form-control" id="pwdUserConfirm" placeholder="Enter password" name="pwd" onChange={this.onPasswordConfirmChangeForUser}/>
                        </div>

                        <button type="button" onClick={this.handleSubmitForUser} className="btn btn-success">Submit</button>
                    </form>
                </div>

                <div className="container" id="registerDriver">
                    <h2>Register as a driver</h2>
                    <form id="formDriver">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="emailDriver" placeholder="Enter email" name="email" onChange={this.onEmailChangeForDriver}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">First name:</label>
                            <input type="text" className="form-control" id="nameDriver" placeholder="Enter first name" name="name" onChange={this.onNameChangeForDriver.bind(this, "name")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last name:</label>
                            <input type="text" className="form-control" id="lastnameDriver" placeholder="Enter last name" name="lastName" onChange={this.onNameChangeForDriver.bind(this, "lastName")}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="personalId">Personal id:</label>
                            <input type="text" className="form-control" id="personalId" placeholder="Enter personal id" name="personalId" onChange={this.onPersonalIdChange.bind(this)}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City:</label>
                            <select id="selectCity" className="form-control" onChange={this.onCityChange.bind(this)}>
                                <option value="bg">Belgrade</option>
                                <option value="ns">Novi Sad</option>
                                <option value="kv">Kraljevo</option>
                                <option value="ca">Cacak</option>
                                <option value="ni">Nis</option>
                                <option value="kg">Kragujevac</option>
                                <option value="su">Subotica</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input type="text" className="form-control" id="address" placeholder="Simina 5, 11000 Belgrade" name="address" onChange={this.onAddressChange.bind(this)}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone number:</label>
                            <input type="text" className="form-control" id="phoneNumber" placeholder="Enter phone number" name="phoneNumber" onChange={this.onPhoneNumberChange.bind(this)} />
                        </div> 

                        <div className="form-group">
                            <label htmlFor="vehicleId">Vehicle id:</label>
                            <input type="text" className="form-control" id="vehicleId" placeholder="Enter vehicle id" name="vehicleId" onChange={this.onVehicleIdChange.bind(this)} />
                        </div> 

                        <div className="form-group">
                            <label htmlFor="vehicleModel">Vehicle model:</label>
                            <input type="text" className="form-control" id="vehicleModel" placeholder="Enter vehicle model" name="vehicleModel" onChange={this.onVehicleModelChange.bind(this)} />
                        </div> 

                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwdDriver" placeholder="Enter password" name="pwd" onChange={this.onPasswordChangeForDriver}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Confirm password:</label>
                            <input type="password" className="form-control" id="pwdDriverConfirm" placeholder="Enter password" name="pwd" onChange={this.onPasswordConfirmChangeForDriver}/>
                        </div>

                        <button type="button" onClick={this.handleSubmitForDriver} className="btn btn-success">Submit</button>
                    </form>
                </div>

            </div>
    );
  }
}

export default Register;