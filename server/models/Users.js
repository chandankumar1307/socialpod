import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 1024
    },
    picturePath: {
        type: String,
        default: "",
    },
    friends: {
        type: Array,
        default: []
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;