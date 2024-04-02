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
}
