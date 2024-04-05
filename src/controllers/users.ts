import express from "express";

import Authentication from "../utils/authentication";
import { UserRole } from "../schemas/enum";
import { AlreadyExist, NotFound } from "../exc/others";
import { PasswordNotMatch } from "../exc/auth";
import { UserRepository } from "../repo/users";
import { sendMail } from "../service/mail";
import { ControllerBase } from "./base";
import { IUser } from "../schemas/users";

export class UserController extends ControllerBase<IUser, UserRepository> {
  constructor() {
    super(new UserRepository(), "user");
  }

  async create(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    let { email, displayName, role } = req.body;
    let userExist = await this.repo.FindByEmail(email);
    if (userExist) {
      throw new AlreadyExist("user", JSON.stringify({ email }));
    }

    const password = Math.random().toString(36).slice(3);
    const hashedPassword = await Authentication.hashPassword(password);
    if (!role) role = UserRole.STUDENT;
    if (!displayName) displayName = email;
    let code_name = "";
    switch (role) {
      case UserRole.ADMIN:
        code_name = "ADM" + Date.now().toString().slice(3);
        break;
      case UserRole.TEACHER:
        code_name = "TCH" + Date.now().toString().slice(3);
        break;
      default:
        code_name = "STU" + Date.now().toString().slice(3);
    }
    const data = {
      code_name,
      email,
      hashedPassword,
      role,
      displayName,
      image: role + ".png",
    };
    const user = await this.repo.create(data);
    delete user.hashedPassword;
    sendMail(email, displayName, password);
    return res.status(201).json(user).end();
  }

  async list(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const filter = (req.query.filter as string) || "{}";
    const users = await this.repo.find(JSON.parse(filter));
    const resUsers = users.map((user: any) => {
      delete user.hashedPassword;
      return user;
    });
    return res.status(200).json(resUsers);
  }

  async update(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { id } = req.params;
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFound("user", id);
    }
    const updateData: any = {};
    if (req.body.password) {
      updateData.hashedPassword = await Authentication.hashPassword(
        req.body.password
      );
    }
    if (req.body.displayName) {
      updateData.displayName = req.body.displayName;
    }
    if (req.body.role) {
      updateData.role = req.body.role;
    }
    await this.repo.update(id, updateData);
    const userUpdated = await this.repo.findById(id);
    delete userUpdated.hashedPassword;
    return res.status(200).json(userUpdated).end();
  }

  async updateMe(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { currentPassword, newPassword, displayName } = req.body;
    const updateData: any = {};
    if (displayName) {
      updateData.displayName = displayName;
    }
    if (currentPassword && newPassword) {
      if (
        !(await Authentication.verifyPassword(
          currentPassword,
          req.body.user.hashedPassword
        ))
      ) {
        throw new PasswordNotMatch();
      }
      updateData.hashedPassword = await Authentication.hashPassword(
        newPassword
      );
    }

    await this.repo.update(req.body.user._id, updateData);
    const userUpdated = await this.repo.findById(req.body.user._id);
    delete userUpdated.hashedPassword;
    return res.status(200).json(userUpdated).end();
  }
}
