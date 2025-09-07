import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventName: {type: String, required: true},
    eventDesc: {type: String, required: true},
    eventDate: {type: String, required: true},
    eventLocation: {type: String, required: true},
    occur: {type: String, required: true},
    userEmail: {type: String, required: true},
    uniqueId: {type: String, required: true}
}, {timestamps: true});

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);