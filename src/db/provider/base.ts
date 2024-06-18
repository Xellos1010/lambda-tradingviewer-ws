// src\db\provider\base.ts
import { v4 } from "uuid";
import { AnyItem } from "dynamoose/dist/Item";
import { Model } from "dynamoose/dist/Model";
import { Condition, ConditionInitializer } from "dynamoose/dist/Condition";
import config from "../../config";

export default class BaseProvider<
  BaseDocument extends AnyItem,
  Data extends {
    data?: string | object;
    id?: string;
    createdAt?: string | number;
    user?: string;
  }
> {
  model: Model;
  user: string;

  constructor(model: Model<BaseDocument>) {
    this.model = model;
    this.user = config.user.email;
  }

  addUserToFilter(filter: Partial<Data> | ConditionInitializer) {
    console.log("Input filter:", filter);

    if (filter instanceof Condition) {
      return filter;
    }

    const resultFilter = { ...(filter as Object), user: this.user };

    console.log("Result filter:", resultFilter);

    return resultFilter;
  }

  async count(filter: Partial<Data> | ConditionInitializer) {
    const res = await this.model
      .query(filter)
      // .query(this.addUserToFilter(filter))
      .count()
      .exec();
    return res.count;
  }

  async getList(
    filter: Partial<Data> | ConditionInitializer,
    options: { limit?: number; order?: "descending" | "ascending" } = {}
  ): Promise<Data[]> {
    const { limit, order } = options;
    // let query = this.model.query(this.addUserToFilter(filter));
    let query = this.model.query(filter);
    if (order) {
      // query.using('createdAt')
      query.filter("createdAt").ge(+new Date() - 365 * 24 * 60 * 60 * 1000);
      query.sort(order);
    }
    if (limit) {
      query.limit(limit);
    }

    console.log("Filter:", filter);
    const result = await query.exec();
    console.log("Result:", result);
    return result.toJSON().map((m: any) => this.dataFromDB(m as Data));
  }

  async getFirst(filter: Partial<Data>): Promise<Data | undefined> {
    // const filteredFilter = this.addUserToFilter(filter);
    // console.log('Filtered filter:', filteredFilter);
    
    // const resultList = await this.getList(filteredFilter, { limit: 1 });
    const resultList = await this.getList(filter, { limit: 1 });
    console.log('Result list:', resultList);
    
    return resultList[0];
  }

  dataFromDB(model: Data): Data {
    if (model?.data && typeof model?.data === "string") {
      try {
        model.data = JSON.parse(model.data);
      } catch (e) {
        console.error("Parse data error", e);
      }
    }
    return model;
  }

  dataToDB(model: Data) {
    if (model.data && typeof model.data === "object") {
      try {
        model.data = JSON.stringify(model.data);
      } catch (e) {
        console.error("Stringify data error", e);
      }
    }
    if (model?.createdAt && typeof model?.createdAt === "string") {
      model.createdAt = Number(new Date(model.createdAt));
    }
    return model;
  }

  async create(data: Data): Promise<Data> {
    const d = {
      id: this.getRandomId(),
      createdAt: this.getNowUnix(),
      user: this.user,
      ...this.dataToDB(data),
    };

    const s: BaseDocument = (await this.model.create(d)) as BaseDocument;

    return this.dataFromDB(s.toJSON() as Data) as Data;
  }

  async update({ id, ...data }: Data): Promise<Data> {
    await this.model.update(id as string, this.dataToDB(data as Data));
    return { id, ...data } as Data;
  }

  async removeFields(
    id: string | undefined,
    fieldList: string[]
  ): Promise<void> {
    if (id) {
      await this.model.update(id, { $REMOVE: fieldList });
    }
  }

  getRandomId(): string {
    return v4();
  }

  getNowUnix(): number {
    return parseInt(String(+new Date()));
  }

  async deleteById(id: string | undefined): Promise<void> {
    if (id) {
      const el = await this.getById(id);
      if (el && el?.user === this.user) {
        return this.model.delete(id);
      }
    }
  }

  async getById(id: string | undefined): Promise<Data | undefined> {
    if (!id) {
      return undefined;
    }
    const res = await this.model.get(id);
    if (!res) {
      return undefined;
    }
    return this.dataFromDB(res.toJSON() as Data);
  }
}
