import { Schema, model } from "mongoose";

const CitizenSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name not provided"],
        minlength: [2, "First name must contain at least 2 characters"],
        maxlength: [50, "First name must not exceed 50 characters"]
    },
    middleName: {
        type: String,
        minlength: [2, "Middle name must contain at least 2 characters"],
        maxlength: [50, "Middle name must not exceed 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name not provided"],
        minlength: [2, "Last name must contain at least 2 characters"],
        maxlength: [50, "Last name must not exceed 50 characters"]
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth not provided"],
    },
    contactNumber: {
        type: String,
        required: [true, "Phone number not provided"],
        maxlength: 13,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: [true, "Address not provided"],
        minlength: [10, "Address must contain at least 10 characters"],
        maxlength: [90, "Address must not exceed 90 characters"]
    }
}, {
    timestamps: true,
});

const Citizen = model("Citizen", CitizenSchema);
export default Citizen;