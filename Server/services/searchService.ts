import { NewModel } from "../database/mongo/New";
import { EventModel } from "../database/mongo/Event";

export default class SearchService {
  async searchNewEvents(args: { keyword: string, limit: number, offset: number, status: number }) {
    const { keyword, limit, offset, status } = args;
    const newSearch = await NewModel.find({
      title: { $regex: keyword, $options: "i" },
      status: status
    })
      .sort({ createDate: -1 })
      .skip(offset)
      .limit(limit);

    const total = await (await NewModel.find({
      title: { $regex: keyword, $options: "i" },
      status: status
    })).length;


    const result = {
      data: newSearch,
      total: total,
      status: 0,
    };
    return result;
  }
  async searchEvents(args: { keyword: string, limit: number, offset: number, status: number }) {
    const { keyword, limit, offset, status } = args;
    const eventSearch = await EventModel.find({
      title: { $regex: keyword, $options: "i" },
      status: status
    })
      .sort({ createDate: -1 })
      .skip(offset)
      .limit(limit);

    const total = await (await EventModel.find({
      title: { $regex: keyword, $options: "i" },
      status: status
    })).length;


    const result = {
      data: eventSearch,
      total: total,
      status: 0,
    };
    return result;
  }
}
