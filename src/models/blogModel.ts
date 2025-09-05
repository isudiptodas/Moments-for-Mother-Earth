import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    linkedIn: {type: String, required: false},
    medium: {type: String, required: false},
    publishedOn: {type: String, required: true},
    imagePath: {type: String, required: true},
    storedPath: {type: String, required: true},
    userEmail: {type: String, required: true},
    userName: {type: String, required: true},
    uniqueId: {type: String, required: true},
}, {timestamps: true});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);