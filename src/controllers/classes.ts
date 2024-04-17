import express from "express";
import { IClass } from "../schemas/classes";
import { ControllerBase } from "./base";
import { ClassRepository } from "../repo/classes";
import { UserRepository } from "../repo/users";
import { UserRole } from "../schemas/enum";
import { NotFound } from "../exc/others";
import { SubjectRepository } from "../repo/subjects";
import {
  InvalidFinalScore,
  InvalidScore,
  InvalidregistrationEndDate,
} from "../exc/classes";
import { NoPermission } from "../exc/auth";

export class ClassController extends ControllerBase<IClass, ClassRepository> {
  constructor() {
    super(new ClassRepository(), "class");
  }
  async validate_teacher(teacher_id: string) {
    const userRepo = new UserRepository();
    const teacher = await userRepo.findById(teacher_id);
    if (!teacher || teacher.role != UserRole.TEACHER) {
      throw new NotFound("teacher", JSON.stringify({ id: teacher_id }));
    }
  }

  async validate_subject(subjectId: string) {
    const subjectRepo = new SubjectRepository();
    const subject = await subjectRepo.findById(subjectId);
    if (!subject) {
      throw new NotFound("subject", JSON.stringify({ id: subjectId }));
    }
  }

  validate_score(midTerm: number, practical: number, final: number) {
    if (midTerm + practical + final != 1) {
      throw new InvalidScore();
    }
    if (midTerm > final || practical > final) {
      throw new InvalidFinalScore();
    }
  }

  validate_registrationEndDate(registrationEndDate: string): Date {
    const date = new Date(registrationEndDate);
    if (date < new Date()) {
      throw new InvalidregistrationEndDate();
    }
    return date;
  }

  async create(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { teacher, subject, final, midTerm, practical, registrationEndDate } =
      req.body;
    await this.validate_teacher(teacher);
    await this.validate_subject(subject);
    await this.validate_score(midTerm, practical, final);
    req.body.registrationEndDate =
      this.validate_registrationEndDate(registrationEndDate);
    req.body.codeName = "CLS" + Date.now().toString().slice(3);
    const data = await this.repo.create(req.body);
    return res.status(201).json(data).end();
  }

  async update(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { id } = req.params;
    const obj = await this.repo.findById(id);
    if (!obj) {
      throw new NotFound(this.name, id);
    }
    const { teacher, subject, final, midTerm, practical, registrationEndDate } =
      req.body;
    const user = req.body.user;
    if (
      user.role == UserRole.TEACHER &&
      user._id.toString() != obj.teacher._id.toString()
    ) {
      throw new NoPermission();
    }
    if (teacher) {
      await this.validate_teacher(teacher);
    }
    if (subject) {
      await this.validate_subject(subject);
    }
    if (final || midTerm || practical) {
      this.validate_score(midTerm, practical, final);
    }
    if (registrationEndDate) {
      this.validate_registrationEndDate(registrationEndDate);
    }
    await this.repo.update(id, req.body);
    const dataUpdated = await this.repo.findById(id);
    return res.status(200).json(dataUpdated).end();
  }
}
