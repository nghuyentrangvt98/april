import { NotFound } from "../exc/others";
import express from "express";
import mongoose from "mongoose";
import { RepositoryBase } from "repo/base";

export class ControllerBase<
  T extends mongoose.Document,
  X extends RepositoryBase<T>
> {
  public repo: X;
  public name: string;

  public constructor(repo: X, name: string) {
    this.repo = repo;
    this.name = name;
  }

  async list(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const filter = (req.query.filter as string) || "{}";
    const data = await this.repo.find(JSON.parse(filter));
    return res.status(200).json(data);
  }

  async get(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { id } = req.params;
    const data = await this.repo.findById(id);
    if (!data) {
      throw new NotFound(this.name, id);
    }
    return res.status(200).json(data);
  }

  async create(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const data = await this.repo.create(req.body);
    return res.status(201).json(data).end();
  }

  async delete(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const { id } = req.params;
    const data = await this.repo.delete(id);
    return res.json(data);
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
    await this.repo.update(id, req.body);
    const dataUpdated = await this.repo.findById(id);
    return res.status(200).json(dataUpdated).end();
  }
}
