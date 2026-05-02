import mongoose from "mongoose";

const revokedTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const revokedTokenModel = mongoose.model("RevokedToken", revokedTokenSchema);

export default revokedTokenModel;
