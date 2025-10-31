const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("This is not a valid email");
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        throw new Error("Password is not strong enough");
    }
};


// ----------------- Validate edit profile credential -----------------

const validateEditProfileData = (req) => {
    const allowedData = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>  allowedData.includes(field));

    return isEditAllowed;
}

module.exports = {validateSignUpData , validateEditProfileData};
