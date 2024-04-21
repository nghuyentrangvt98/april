import express from "express";
import { IClassDetail } from "../schemas/classDetails";
import { ControllerBase } from "./base";
import { ClassDetailRepository } from "../repo/classDetails";
import { ClassRepository } from "../repo/classes";
import { UserRepository } from "../repo/users";
import { UserRole } from "../schemas/enum";
import { AlreadyExist, NotFound } from "../exc/others";
import { InvalidClass, InvalidScore } from "../exc/classDetails";

export class classDetailController extends ControllerBase<
  IClassDetail,
  ClassDetailRepository
> {
  constructor() {
    super(new ClassDetailRepository(), "classDetail");
  }
  async validate_student(student_id: string) {
    const userRepo = new UserRepository();
    const student = await userRepo.findById(student_id);
    if (!student || student.role != UserRole.STUDENT) {
      throw new NotFound("student", JSON.stringify({ id: student_id }));
    }
  }

  async validate_class(classId: string) {
    const classRepo = new ClassRepository();
    const _class = await classRepo.findById(classId);
    if (!_class) {
      throw new NotFound("class", JSON.stringify({ id: classId }));
    }
    if (new Date(_class.registrationEndDate) <= new Date()) {
      throw new InvalidClass();
    }
  }

  validate_score(score: number) {
    if (!score) {
      return;
    }
    if (score > 10 || score < 0) {
      throw new InvalidScore();
    }
  }

  average(
    midTerm: number,
    practical: number,
    final: number,
    classDetail: IClassDetail
  ): number {
    const _class = classDetail.class;
    return (
      midTerm * _class.midTerm +
      practical * _class.practical +
      final * _class.final
    );
  }

  async update(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { id } = req.params;
    const obj = await this.repo.findById(id);
    if (!obj) {
      throw new NotFound(this.name, JSON.stringify({ id }));
    }
    let { midTerm, practical, final } = req.body;
    [midTerm, practical, final].map((score) => {
      this.validate_score(score);
    });
    req.body.average = this.average(midTerm, practical, final, obj);
    await this.repo.update(id, req.body);
    const dataUpdated = await this.repo.findById(id);
    return res.status(200).json(dataUpdated).end();
  }

  async updateBulk(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    for (const [id, score] of Object.entries(req.body)) {
      if (id == "user") {
        continue;
      }
      let obj = await this.repo.findById(id);
      if (!obj) {
        continue;
      }
      let _score = score as any;
      let { midTerm, practical, final } = _score;
      try {
        [midTerm, practical, final].map((score) => {
          this.validate_score(score);
        });
      } catch (e) {
        continue;
      }
      _score.average = this.average(midTerm, practical, final, obj);
      await this.repo.update(id, _score);
    }
    return res.status(200).json({ message: "data updated" }).end();
  }

  async create(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    let { student, classId } = req.body;
    if (req.body.user.role == UserRole.STUDENT) {
      student = req.body.user._id.toString();
    }
    await this.validate_student(student);
    await this.validate_class(classId);
    const payload = { student, class: classId };
    const obj = await this.repo.find(payload);
    if (obj.length > 0) {
      throw new AlreadyExist(this.name, JSON.stringify(payload));
    }
    const data = await this.repo.create(payload);
    return res.status(201).json(data).end();
  }

  async list(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const filter = JSON.parse((req.query.filter as string) || "{}");
    const data = await this.repo.find(filter);
    const user = req.body.user;
    let res_data: IClassDetail[] = [];
    switch (user.role) {
      case UserRole.STUDENT:
        data.map((item) => {
          if (item.student._id.toString() == user._id.toString()) {
            res_data.push(item);
          }
        });
        break;
      case UserRole.TEACHER:
        data.map((item) => {
          if (item.class.teacher.toString() == user._id.toString()) {
            res_data.push(item);
          }
        });
      case UserRole.ADMIN:
        res_data = data;
    }
    return res.status(200).json(res_data);
  }
}
