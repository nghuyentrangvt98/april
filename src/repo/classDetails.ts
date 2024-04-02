import { ClassDetailModel, IClassDetail } from "../schemas/classDetails";
import { RepositoryBaseWithPopulate } from "./base";

export class ClassDetailRepository extends RepositoryBaseWithPopulate<IClassDetail> {
  constructor() {
    super(ClassDetailModel, ["class", "student"]);
  }
}
