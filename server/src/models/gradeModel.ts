import { Schema, model } from "dynamoose";

const gradeSchema = new Schema(
  {
    gradeId: {
      type: String,
      hashKey: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Grade = model("Grade", gradeSchema);
export default Grade;
