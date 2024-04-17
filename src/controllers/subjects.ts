import express from "express";
import { ISubject } from "../schemas/subjects";
import { ControllerBase } from "./base";
import { SubjectRepository } from "../repo/subjects";

export class SubjectController extends ControllerBase<
  ISubject,
  SubjectRepository
> {
  constructor() {
    super(new SubjectRepository(), "subject");
  }
  async create(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    req.body.codeName = "SUB" + Date.now().toString().slice(3);
    const data = await this.repo.create(req.body);
    return res.status(201).json(data).end();
  }
}
