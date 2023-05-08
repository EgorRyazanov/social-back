import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        secondName: {
            type: String,
            required: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        requests: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        outgoing: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        university: {
            type: String,
            default: "",
        },
        age: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", UserSchema);
