import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserModel } from "./schemas/users";
import { MONGO_URL, firstPassword, firstEmail, saltRounds } from "./setting";
import { UserRole } from "./schemas/enum";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

export const createFirstUser = async () => {
  const user = await UserModel.find();
  if (user.length > 0) {
    console.log("first user created, skipped!");
    return user;
  }
  const newUser = new UserModel({
    email: firstEmail,
    codeName: "ADM" + Date.now().toString().slice(3),
    hashedPassword: await bcrypt.hash(firstPassword, +saltRounds),
    displayName: "Admin",
    role: UserRole.ADMIN,
    image: "admin.png",
  });

  await newUser.save();

  return newUser;
};

createFirstUser().then(() => process.exit(0));
