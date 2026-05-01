import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    theme: String,

    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
