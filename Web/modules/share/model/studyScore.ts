import { SharedModel } from "./base";
import StudyScoreData from "./studyScoreData";

export class StudyScore extends SharedModel {
  _id: string;
  topicId: string;
  userId: string;
  status: number;
  progress: number;
  score: number;
  totalTime: number;
  studyScoreData?: StudyScoreData;

  constructor(args: Partial<StudyScore> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.topicId = args.topicId ?? "";
    this.userId = args.userId ?? "";
    this.status = args.status ?? 0;
    this.progress = args.progress ?? 0;
    this.score = args.score ?? 0;
    this.totalTime = args.totalTime ?? 0;
    this.studyScoreData = args.studyScoreData ? new StudyScoreData(args.studyScoreData) : undefined;
  }
}

export default StudyScore;
