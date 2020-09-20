import React, { Component } from 'react';
import '../css/Register.css';
import Slideshow from './Slideshow';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forUser: {
                Email: '',
                FirstName: '',
                LastName: '',
                PhoneNumber: '',
                Password: '',
                ConfirmPassword: ''
            },
            forDriver: {
                Email: '',
                FirstName: '',
                LastName: '',
                RealId: '', 
                City: '', 
                PhoneNumber: '',
                VehiclePlateId: '',
                VehicleModel: '',
                Address: '',
                Password: '',
                ConfirmPassword: '',
                DateOfBirth: ''
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
        this.onDateOfBirthChange = this.onDateOfBirthChange.bind(this);

        this.onRealIdChange = this.onRealIdChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        
        this.onVehicleModelChange = this.onVehicleModelChange.bind(this);
        this.onVehiclePlateIdChange = this.onVehiclePlateIdChange.bind(this);
         

        this.handleSubmitForDriver = this.handleSubmitForDriver.bind(this);
    }
    
    checkFormValidity(entity) {
        const validationEmailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");
        const validationNameRegex = new RegExp("[A-Za-z]+");
        const validationPasswordRegex = new RegExp("^(?=.*\\d).{4,12}$");

        if (entity.Email === '' || !validationEmailRegex.test(entity.Email)) {
            window.alert("Please insert valid Email!");
            return false;
        } else if (entity.Name === '' || !validationNameRegex.test(entity.Name)) {
            window.alert("Name must contain only letters!");
            return false;
        } else if (entity.LastName === '' || !validationNameRegex.test(entity.LastName)) {
            window.alert("Last name must contain only letters!");
            return false;
        } else if (entity.Password === '' || !validationPasswordRegex.test(entity.Password)) {
            window.alert("Password must contain between 4-12 characters and at least one digit!");
            return false;
        } else if (entity.Password !== entity.ConfirmPassword) {
            window.alert("Passwords do not match!");
            return false;
        } else if (entity.PhoneNumber === '') {
            window.alert("PhoneNumber is empty!");
            return false;
        }

        return true;
    }

    checkFormValidityForDriver(entity) {
        const validationRealIdRegex = new RegExp("[0-9]{13}");
        const validationAddressRegex = new RegExp("[A-Za-z ]+\\s*[0-9]+");
        const validationVehiclePlateIdRegex = new RegExp("[A-Z]{2}[0-9]{4}[A-Z]{2}");
        const validationVehicleModelRegex = new RegExp("[A-Za-z ]+");
        const validationPhoneNumberRegex = new RegExp("[0-9]{10}");
        
        if (entity.RealId === '' || !validationRealIdRegex.test(entity.RealId)) {
            window.alert("Please insert valid personal id!");
            return false;
        } else if (entity.Address === '' || !validationAddressRegex.test(entity.Address)) {
            window.alert("Please insert valid address!");
            return false;
        } else if (entity.PhoneNumber === '' || !validationPhoneNumberRegex.test(entity.PhoneNumber)) {
            window.alert("Please insert valid phone number!");
            return false;
        } else if (entity.VehiclePlateId === '' || !validationVehiclePlateIdRegex.test(entity.VehiclePlateId)) {
            window.alert("Please insert valid vehicle id!");
            return false;
        } else if (entity.VehicleModel === '' || !validationVehicleModelRegex.test(entity.VehicleModel)) {
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
                Email: '',
                FirstName: '',
                LastName: '',
                Password: '',
                ConfirmPassword: ''
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

    onEmailChangeForUser(Email) {
        const forUser = {
            Email: Email.target.value,
            FirstName: this.state.forUser.FirstName,
            LastName: this.state.forUser.LastName,
            Password: this.state.forUser.Password,
            ConfirmPassword: this.state.forUser.confirmPassword
        }
        this.setState({
            forUser
        });
    }

    onEmailChangeForDriver(Email) {
        const forDriver = {
            Email: Email.target.value,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onNameChangeForUser(nameOfInput, input) {
        let FirstName;
        let LastName;
        let PhoneNumber;
        if (nameOfInput === "Name") {
            FirstName = input.target.value;
            LastName = this.state.forUser.LastName;
            PhoneNumber = this.state.forUser.PhoneNumber;
        } else if (nameOfInput === "LastName") {
            FirstName = this.state.forUser.FirstName;
            LastName = input.target.value;
            PhoneNumber = this.state.forUser.PhoneNumber;
        } else if (nameOfInput === "PhoneNumber") {
            FirstName = this.state.forUser.FirstName;
            LastName =  this.state.forUser.LastName;
            PhoneNumber = input.target.value;
        }
        
        const forUser = {
            Email: this.state.forUser.Email,
            FirstName: FirstName,
            LastName: LastName,
            PhoneNumber: PhoneNumber,
            Password: this.state.forUser.Password,
            ConfirmPassword: this.state.forUser.ConfirmPassword
        };

        this.setState({
            forUser
        });
    }

    onNameChangeForDriver(nameOfInput, input) {
        let FirstName;
        let LastName;
        if (nameOfInput === "Name") {
            FirstName = input.target.value;
            LastName = this.state.forDriver.LastName;
        } else if (nameOfInput === "LastName") {
            FirstName = this.state.forDriver.FirstName;
            LastName = input.target.value;
        } 

        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName,
            LastName,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        };

        this.setState({
            forDriver
        });
    }

    onPasswordChangeForUser(Password) {
        const forUser = {
            Email: this.state.forUser.Email,
            FirstName: this.state.forUser.FirstName,
            LastName: this.state.forUser.LastName,
            PhoneNumber: this.state.forUser.PhoneNumber,
            Password: Password.target.value,
            ConfirmPassword: this.state.forUser.ConfirmPassword
        };
        this.setState({
            forUser
        });
    }

    onPasswordChangeForDriver(Password) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: Password.target.value,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        };
        this.setState({
            forDriver
        });
    }

    onPasswordConfirmChangeForUser(PasswordConfirm) {
        const forUser = {
            Email: this.state.forUser.Email,
            FirstName: this.state.forUser.FirstName,
            LastName: this.state.forUser.LastName,
            PhoneNumber: this.state.forUser.PhoneNumber,
            Password: this.state.forUser.Password,
            ConfirmPassword: PasswordConfirm.target.value
        };
        this.setState({
            forUser
        });
    }

    onPasswordConfirmChangeForDriver(PasswordConfirm) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: PasswordConfirm.target.value
        };
        this.setState({
            forDriver
        });
    }

    onRealIdChange(RealId) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: RealId.target.value,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onDateOfBirthChange(DateOfBirth) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: DateOfBirth.target.target,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onCityChange(City) {
        console.log(City.target.value);
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: City.target.value,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onAddressChange(Address) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: Address.target.value,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onPhoneNumberChange(PhoneNumber) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: PhoneNumber.target.value,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onVehiclePlateIdChange(VehiclePlateId) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: VehiclePlateId.target.value,
            VehicleModel: this.state.forDriver.VehicleModel,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
        }
        this.setState({
            forDriver
        });
    }

    onVehicleModelChange(VehicleModel) {
        const forDriver = {
            Email: this.state.forDriver.Email,
            FirstName: this.state.forDriver.FirstName,
            LastName: this.state.forDriver.LastName,
            RealId: this.state.forDriver.RealId,
            DateOfBirth: this.state.forDriver.DateOfBirth,
            City: this.state.forDriver.City,
            Address: this.state.forDriver.Address,
            PhoneNumber: this.state.forDriver.PhoneNumber,
            VehiclePlateId: this.state.forDriver.VehiclePlateId,
            VehicleModel: VehicleModel.target.value,
            Password: this.state.forDriver.Password,
            ConfirmPassword: this.state.forDriver.ConfirmPassword
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
        axios.post('http://localhost:49943/api/Registration/Customer', forUser)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });

        document.getElementById("formUser").reset();
    }

    handleSubmitForDriver() {
        const forDriver = this.state.forDriver;
        console.log(forDriver);
        if (!this.checkFormValidity(forDriver)) {
            return;
        }

        if (!this.checkFormValidityForDriver(forDriver)) {
            return;
        }

        axios.post('http://localhost:49943/api/Registration/Driver', forDriver)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
        document.getElementById("formDriver").reset();
    }

    render() {

        return (
            <div className="signin">
                <div className="slider">
                    <Slideshow />
                </div>
                <div className="formular">
                    <a href='/' className="back"><FontAwesomeIcon icon={faAngleLeft} className="fi_menu"/> Vratite se na početnu</a>
                    <div className="buttonsReg">
                        <button type="button" disabled={this.state.disabledUser} onClick={this.showFormForUser} id="btnSignInUser" className="btn btn-success">Korisnik</button>
                        <button type="button" disabled={this.state.disabledDriver} onClick={this.showFormForDriver} id="btnSignInDriver" className="btn btn-success">Vozač</button>
                    </div>

                    <div className="container" id="registerUser">
                        <h2 className="titleForm">Registrujte se kao korisnik</h2>
                        <form id="formUser">
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="email" className="form-control" id="emailUser" placeholder="Unesite email" name="email" onChange={this.onEmailChangeForUser}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Ime:</label>
                                <input type="text" className="form-control" id="nameUser" placeholder="Unesite ime" name="name" onChange={this.onNameChangeForUser.bind(this, "Name")}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Prezime:</label>
                                <input type="text" className="form-control" id="lastnameUser" placeholder="Unesite prezime" name="lastName" onChange={this.onNameChangeForUser.bind(this, "LastName")}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Broj telefona:</label>
                                <input type="text" className="form-control" id="phoneNumberUser" placeholder="Unesite broj telefona" name="phoneNumber" onChange={this.onNameChangeForUser.bind(this, "PhoneNumber")}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="pwd">Šifra:</label>
                                <input type="password" className="form-control" id="pwdUser" placeholder="Unesite šifru" name="pwd" onChange={this.onPasswordChangeForUser}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="pwd">Potvrdite šifru:</label>
                                <input type="password" className="form-control" id="pwdUserConfirm" placeholder="Unesite šifru" name="pwd" onChange={this.onPasswordConfirmChangeForUser}/>
                            </div>

                            <button type="button" onClick={this.handleSubmitForUser} id="submit" className="btn btn-success">Kreirajte nalog</button>
                            <p className="goToLogin">Već imate nalog? <a href='/prijavljivanje'>Prijavite se!</a></p>
                        </form>
                    </div>

                    <div className="container" id="registerDriver">
                        <h2 className="titleForm">Registrujte se kao vozač</h2>
                        <form id="formDriver">
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="email" className="form-control" id="emailDriver" placeholder="Unesite email" name="email" onChange={this.onEmailChangeForDriver}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Ime:</label>
                                <input type="text" className="form-control" id="nameDriver" placeholder="Unesite ime" name="name" onChange={this.onNameChangeForDriver.bind(this, "Name")}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Prezime:</label>
                                <input type="text" className="form-control" id="lastnameDriver" placeholder="Unesite prezime" name="lastName" onChange={this.onNameChangeForDriver.bind(this, "LastName")}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="personalId">JMGB:</label>
                                <input type="text" className="form-control" id="personalId" placeholder="Unesite jmbg" name="personalId" onChange={this.onRealIdChange.bind(this)}/>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Datum rodjenja:</label>
                                <input type="text" className="form-control" id="dateOfBirth" placeholder="Unesite datum rodjenja" name="dateOfBirth" onChange={this.onDateOfBirthChange.bind(this)}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">Grad:</label>
                                <select id="selectCity" className="form-control" onChange={this.onCityChange.bind(this)}>
                                    <option value="Beograd">Beograd</option>
                                    <option value="Novi Sad">Novi Sad</option>
                                    <option value="Kraljevo">Kraljevo</option>
                                    <option value="Čačak">Čačak</option>
                                    <option value="Nis">Nis</option>
                                    <option value="Kragujevac">Kragujevac</option>
                                    <option value="Subotica">Subotica</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="address">Adresa:</label>
                                <input type="text" className="form-control" id="address" placeholder="Simina 5, 11000 Belgrade" name="address" onChange={this.onAddressChange.bind(this)}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Broj telefona:</label>
                                <input type="text" className="form-control" id="phoneNumber" placeholder="Unesite broj telefona" name="phoneNumber" onChange={this.onPhoneNumberChange.bind(this)} />
                            </div> 

                            <div className="form-group">
                                <label htmlFor="vehicleId">Broj tablica vozila:</label>
                                <input type="text" className="form-control" id="vehicleId" placeholder="Unesite broj tablica" name="vehicleId" onChange={this.onVehiclePlateIdChange.bind(this)} />
                            </div> 

                            <div className="form-group">
                                <label htmlFor="vehicleModel">Model vozila:</label>
                                <input type="text" className="form-control" id="vehicleModel" placeholder="Unesite model vozila" name="vehicleModel" onChange={this.onVehicleModelChange.bind(this)} />
                            </div> 

                            <div className="form-group">
                                <label htmlFor="pwd">Šifra:</label>
                                <input type="password" className="form-control" id="pwdDriver" placeholder="Unesite šifru" name="pwd" onChange={this.onPasswordChangeForDriver}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="pwd">Potvrdite šifru:</label>
                                <input type="password" className="form-control" id="pwdDriverConfirm" placeholder="Unesite šifru" name="pwd" onChange={this.onPasswordConfirmChangeForDriver}/>
                            </div>

                            <button type="button" onClick={this.handleSubmitForDriver} id="submitDriver" className="btn btn-success">Kreirajte nalog</button>
                            <p className="goToLogin">Već imate nalog? <a href='/login'>Prijavite se!</a></p>
                        </form>
                    </div>
                </div>
            </div>
    );
  }
}

export default Register;