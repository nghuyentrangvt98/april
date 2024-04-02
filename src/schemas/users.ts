import mongoose from "mongoose";
import { UserRole } from "./enum";
import { setTokenAutoRefreshEnabled } from "firebase/app-check";

export interface IUser extends mongoose.Document {
  code_name: string;
  email: string;
  hashedPassword: string;
  displayName: string;
  role: UserRole;
  image: string;
}

export const UserSchema = new mongoose.Schema<IUser>({
  code_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: UserRole, default: UserRole.STUDENT },
  image: { type: String },
});

export const UserModel = mongoose.model("User", UserSchema);
