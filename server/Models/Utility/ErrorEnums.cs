using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Utility
{
    public enum ErrorEnum
    {
        InvalidModelState = 0,
        EmailAlreadyRegistered = 1,
        EmailNotRegistered = 2,
        InvalidPassword = 3,
        EmailNotConfirmed = 4,
        InvalidEmailConfirmationToken = 5,
        InvalidPasswordResetToken = 6,
        NoUserLogIn = 7,
        InvalidAccessToken = 8,
        InvalidRefreshToken = 9,
        InvalidStartAddress = 10,
        InvalidEndAddress = 11,
        InvalidRoute = 12,
        InvalidDriverRating = 13,
        InvalidDeletePassword = 14,
        InvalidDriveRating = 15,
        DriveAlreadyOpen = 16,
        InvalidRequestCancellation = 17,
        InvalidDriveClose = 18,
        ConfirmationEmailBlock = 19,
        PasswordResetBlock = 20,
        DriveAlreadyRated = 21,
        RealIdAlreadyRegistered = 22,
        AccountActivationBlock = 23,
        InvalidDateFormat = 24,
        InvalidDriveId = 25
    }
}
