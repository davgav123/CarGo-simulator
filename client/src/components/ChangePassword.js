import React, { Component } from 'react';
import '../css/ChangePassword.css';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
          forUser: {
              oldPassword: '',
              newPassword: '',
              confirmPassword: ''
          }
      };

      this.onOldPasswordChange = this.onOldPasswordChange.bind(this);
      this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
      this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
      this.submitChangePassword = this.submitChangePassword.bind(this);
    }

    checkValidityPassword(entity) {
        const validationPasswordRegex = new RegExp("^(?=.*\\d).{4,12}$");

        if (entity.password === '' || !validationPasswordRegex.test(entity.password)) {
            window.alert("Please insert valid password!");
            return false;
        }

        return true;
    }

    onOldPasswordChange(password) {
        const forUser = {
            oldPassword: password.target.value,
            newPassword: this.state.forUser.newPassword,
            confirmPassword: this.state.forUser.confirmPassword
        };
        this.setState({
            forUser
        });
    }

    onNewPasswordChange(password) {
        const forUser = {
            oldPassword: this.state.forUser.oldPassword,
            newPassword: password.target.value,
            confirmPassword: this.state.forUser.confirmPassword
        };
        this.setState({
            forUser
        });
    }

    onConfirmPasswordChange(password) {
        const forUser = {
            oldPassword: this.state.forUser.oldPassword,
            newPassword: this.state.forUser.confirmPassword,
            confirmPassword: password.target.value
        };
        this.setState({
            forUser
        });
    }

    submitChangePassword() {
        const forUser = this.state.forUser;

        let valid = this.checkValidityPassword(forUser);
        if (!valid) {
            return ;
        }

        document.getElementById("formUser").reset();
        console.log(forUser);
    }

    render() {
        return (
        <div className="changePassword">
            <h2 className="titleChangepassword">Promenite šifru</h2>

            <div className="formularChangePassword">
                <div className="container" id="changePassword">

                    <form id="formChangePassword">
                        <div className="form-group">
                            <label htmlFor="pwd">Stara šifra:</label>
                            <input type="password" className="form-control" id="oldPwd" placeholder="Unesite staru šifru" name="pwd" onChange={this.onOldPasswordChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwdNew">Nova šifra:</label>
                            <input type="password" className="form-control" id="newPwd" placeholder="Unesite novu šifru" name="pwdNew" onChange={this.onNewPasswordChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwdConfirm">Potvrdite šifru:</label>
                            <input type="password" className="form-control" id="confirmPwd" placeholder="Unesite novu šifru" name="pwdConfirm" onChange={this.onConfirmPasswordChange}/>
                        </div>

                        <button type="button" onClick={this.submitChangePassword} id="submitChangePassword" className="btn btn-success">Promenite</button>
                    </form>
                </div>
            </div>
        </div>
    );
  }
}