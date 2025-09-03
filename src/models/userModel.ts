import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    dateCreated: {type: String, required: true},
    contact: {type: String, required: true},
    profilePhoto: {type: String, default: null, required: false}
}, {timestamps: true});

export const User = mongoose.models.User || mongoose.model("User", userSchema);