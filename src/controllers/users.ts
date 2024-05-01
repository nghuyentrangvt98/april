import express from "express";
import admin from "firebase-admin";

import Authentication from "../utils/authentication";
import { UserRole } from "../schemas/enum";
import { AlreadyExist, NotFound } from "../exc/others";
import { PasswordNotMatch } from "../exc/auth";
import { UserRepository } from "../repo/users";
import { sendMail } from "../service/mail";
import { ControllerBase } from "./base";
import { IUser } from "../schemas/users";
import { getSignedUrl } from "../service/storage";

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
    let codeName = "";
    switch (role) {
      case UserRole.ADMIN:
        codeName = "ADM" + Date.now().toString().slice(3);
        break;
      case UserRole.TEACHER:
        codeName = "TCH" + Date.now().toString().slice(3);
        break;
      default:
        codeName = "STU" + Date.now().toString().slice(3);
    }
    const data = {
      codeName,
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
          req.user.hashedPassword
        ))
      ) {
        throw new PasswordNotMatch();
      }
      updateData.hashedPassword = await Authentication.hashPassword(
        newPassword
      );
    }

    await this.repo.update(req.user._id, updateData);
    const userUpdated = await this.repo.findById(req.user._id);
    delete userUpdated.hashedPassword;
    return res.status(200).json(userUpdated).end();
  }

  async get(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { id } = req.params;
    let data = await this.repo.findById(id);
    if (!data) {
      throw new NotFound(this.name, id);
    }
    data.image = (await getSignedUrl(data.image, 60))[0];
    delete data.hashedPassword;
    return res.status(200).json(data);
  }
  async updateImage(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const bucket = admin.storage().bucket();
    const extension = req.file.originalname.split(".")[1];
    const fileName = `${Date.now().toString()}.${extension}`;
    const blob = bucket.file(fileName);
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    blobWriter.end(req.file.buffer);
    await this.repo.update(req.user._id, { image: fileName });
    const userUpdated = await this.repo.findById(req.user._id);
    delete userUpdated.hashedPassword;
    return res.status(200).json(userUpdated).end();
  }
}
