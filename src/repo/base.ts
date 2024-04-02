import * as mongoose from "mongoose";

export class RepositoryBase<T extends mongoose.Document> {
  public _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  getName(): string {
    return "Base";
  }

  async create(item: Record<string, any>): Promise<T | null> {
    let p = new this._model(item);
    await p.save();
    return p.toObject();
  }

  async findById(id: string): Promise<T | null> {
    let p = await this._model.findById(id);
    if (!p) {
      return null;
    }
    return p.toObject();
  }

  async findByIds(ids: string[]): Promise<T[]> {
    let p = await this._model.find({ _id: { $in: ids } });
    return p.map((item) => {
      return item.toObject();
    });
  }

  async find(filter: any = {}): Promise<T[]> {
    let p = await this._model.find(filter);
    return p.map((item) => {
      return item.toObject();
    });
  }

  async findOne(filter: any = {}): Promise<T | null> {
    let p = await this._model.findOne(filter);
    if (!p) {
      return null;
    }
    return p.toObject();
  }

  async update(id: string, item: Record<string, any>): Promise<T> {
    let p = await this._model.findByIdAndUpdate(id, item);
    return p.toObject();
  }

  async delete(_id: string): Promise<T> {
    let p = await this._model.findOneAndDelete({ _id });
    return p.toObject();
  }
}

export class RepositoryBaseWithPopulate<
  T extends mongoose.Document
> extends RepositoryBase<T> {
  public _model: mongoose.Model<mongoose.Document>;
  public _populateFields: string[];

  constructor(
    schemaModel: mongoose.Model<mongoose.Document>,
    _populateFields: string[]
  ) {
    super(schemaModel);
    this._populateFields = _populateFields;
  }

  getName(): string {
    return "Base";
  }

  async create(item: Record<string, any>): Promise<T> {
    let p = new this._model(item);
    await p.save();
    return p.toObject();
  }

  async findById(id: string): Promise<T | null> {
    console.log(id);
    let p = await this._model.findById(id).populate(this._populateFields);
    if (!p) {
      return null;
    }
    return p.toObject();
  }

  async findByIds(ids: string[]): Promise<T[]> {
    let p = await this._model
      .find({ _id: { $in: ids } })
      .populate(this._populateFields);
    return p.map((item) => {
      return item.toObject();
    });
  }

  async find(filter: any = {}): Promise<T[]> {
    let p = await this._model.find(filter).populate(this._populateFields);
    return p.map((item) => {
      return item.toObject();
    });
  }

  async findOne(filter: any = {}): Promise<T | null> {
    let p = await this._model.findOne(filter).populate(this._populateFields);
    if (!p) {
      return null;
    }
    return p.toObject();
  }

  async update(id: string, item: Record<string, any>): Promise<T> {
    let p = await this._model.findByIdAndUpdate(id, item);
    return p.toObject();
  }

  async delete(_id: string): Promise<T> {
    let p = await this._model.findOneAndDelete({ _id });
    return p.toObject();
  }
}
