import mongoose, { Schema } from "mongoose";
import { IClass } from "./classes";
import { IUser } from "./users";

export interface IClassDetail extends mongoose.Document {
  class: IClass;
  student: IUser;
  midTerm: number;
  practical: number;
  final: number;
  average: number;
}

export const ClassDetailSchema = new mongoose.Schema<IClassDetail>({
  class: { type: Schema.ObjectId, ref: "Class", required: true },
  student: { type: Schema.ObjectId, ref: "User", required: true },
  midTerm: { type: Number, default: null },
  practical: { type: Number, default: null },
  final: { type: Number, default: null },
  average: { type: Number, default: null },
});

export const ClassDetailModel = mongoose.model(
  "ClassDetail",
  ClassDetailSchema
);
