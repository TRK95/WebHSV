import { SharedModel } from "./base";

export default class StudyScoreDetail extends SharedModel {
  _id: string;
  studyScoreDataId: string;
  cardId: string;
  userId: string;
  topicId: string;
  status: number;
  correct: boolean;

  constructor(args: Partial<StudyScoreDetail> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.studyScoreDataId = args.studyScoreDataId ?? "";
    this.cardId = args.cardId ?? "";
    this.userId = args.userId ?? "";
    this.topicId = args.topicId ?? "";
    this.status = args.status ?? 0;
    this.correct = args.correct ?? false;
  }
}
