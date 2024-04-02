import { ClassModel, IClass } from "../schemas/classes";
import { RepositoryBaseWithPopulate } from "./base";

export class ClassRepository extends RepositoryBaseWithPopulate<IClass> {
  constructor() {
    super(ClassModel, ["teacher", "subject"]);
  }
}
