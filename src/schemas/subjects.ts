import mongoose from "mongoose";

export interface ISubject extends mongoose.Document {
  code_name: string;
  name: string;
  description: string;
}

export const SubjectSchema = new mongoose.Schema<ISubject>({
  code_name: {
    type: String,
    default: "SUB" + Date.now().toString().slice(3),
  },
  name: { type: String, require: true },
  description: { type: String, require: true },
});

export const SubjectModel = mongoose.model("Subject", SubjectSchema);
