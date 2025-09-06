import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    imagePath: {type: String, required: true},
    storedPath: {type: String, required: true},
    link: {type: String, required: true},
    publishedOn: {type: String, required: true},
    uniqueId: {type: String, required: true},
    userEmail: {type: String, required: true},
    userName: {type: String, required: true},
}, {timestamps: true});

export const Podcast = mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema);