import mongoose from "mongoose";

export interface ISubject extends mongoose.Document {
  codeName: string;
  name: string;
  description: string;
}

export const SubjectSchema = new mongoose.Schema<ISubject>({
  codeName: { type: String, unique: true },
  name: { type: String, require: true },
  description: { type: String, require: true },
});

export const SubjectModel = mongoose.model("Subject", SubjectSchema);
