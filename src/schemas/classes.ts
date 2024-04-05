import mongoose, { Schema } from "mongoose";
import { IUser } from "./users";
import { ISubject } from "./subjects";

export interface IClass extends mongoose.Document {
  codeName: string;
  teacher: IUser;
  subject: ISubject;
  midTerm: number;
  practical: number;
  final: number;
  registrationEndDate: Date;
}

export const ClassSchema = new mongoose.Schema<IClass>({
  codeName: { type: String, default: "CLS" + Date.now().toString().slice(3) },
  teacher: { type: Schema.ObjectId, ref: "User", require: true },
  subject: { type: Schema.ObjectId, ref: "Subject", require: true },
  midTerm: { type: Number, required: true },
  practical: { type: Number, required: true },
  final: { type: Number, required: true },
  registrationEndDate: { type: Date, required: true },
});

export const ClassModel = mongoose.model("Class", ClassSchema);
