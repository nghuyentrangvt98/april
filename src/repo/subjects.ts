import { ISubject, SubjectModel } from "../schemas/subjects";
import { RepositoryBase } from "./base";

export class SubjectRepository extends RepositoryBase<ISubject> {
  constructor() {
    super(SubjectModel);
  }
}
