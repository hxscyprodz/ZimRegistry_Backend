import { Schema, model, Types } from "mongoose";

const BirthApplicationSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name not provided"],
        minlength: [5, "Full name must contain at least 5 characters"],
        maxlength: [50, "Full name must not exceed 50 characters"]
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth not provided"],
    },
    placeOfBirth: {
        type: String,
        required: [true, "Place of birth not provided"],
        minlength: [5, "Place of birth must contain at least 5 characters"],
        maxlength: [50, "Place of birth must not exceed 50 characters"]
    },
    motherDetails: {
        type: Types.ObjectId,
        ref: "Citizen",
    },
    fatherDetails: {
        type: Types.ObjectId,
        ref: "Citizen",
    },
    parentsContact: {
        type: String,
        required: [true, "Parents contact number not provided"],
        maxlength: 13
    },
    applicationStatus: {
        type: String,
        default: "PENDING"
    }
}, {
    timestamps: true,
});

const BirthApplication = model("BirthApplication", BirthApplicationSchema);
export default BirthApplication;