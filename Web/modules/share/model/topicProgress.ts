import { SharedModel } from "./base";

export default class TopicProgress extends SharedModel {
  _id: string;
  topicId: string;
  userId: string;
  status: number;
  progress: number;
  score: number;
  totalTime: number;

  constructor(args: Partial<TopicProgress> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.topicId = args.topicId ?? "";
    this.userId = args.userId ?? "";
    this.status = args.status ?? 0;
    this.progress = args.progress ?? 0;
    this.score = args.score ?? 0;
    this.totalTime = args.totalTime ?? 0;
  }
}
