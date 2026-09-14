import { SharedModel } from "./base";

export default class TopicExercise extends SharedModel {
  _id: string;
  topicId: string;
  contentType: number;
  duration: number;

  constructor(args: Partial<TopicExercise> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.topicId = args.topicId ?? "";
    this.contentType = args.contentType ?? 0;
    this.duration = args.duration ?? 0;
  }
}
