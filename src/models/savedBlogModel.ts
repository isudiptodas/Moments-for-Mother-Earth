import mongoose from "mongoose";

const savedBlogSchema = new mongoose.Schema({
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
    savedBy: {type: String, required: true},
}, {timestamps: true});

export const SavedBlog = mongoose.models.Saved_Blog || mongoose.model("Saved_Blog", savedBlogSchema);