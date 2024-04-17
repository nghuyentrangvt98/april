import mongoose from "mongoose";
import { UserRole } from "./enum";
import { setTokenAutoRefreshEnabled } from "firebase/app-check";

export interface IUser extends mongoose.Document {
  codeName: string;
  email: string;
  hashedPassword: string;
  displayName: string;
  role: UserRole;
  image: string;
}

export const UserSchema = new mongoose.Schema<IUser>({
  codeName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: UserRole, default: UserRole.STUDENT },
  image: { type: String },
});

export const UserModel = mongoose.model("User", UserSchema);
