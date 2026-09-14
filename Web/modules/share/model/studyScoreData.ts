import { SharedModel } from "./base";

export class StudyScoreData extends SharedModel {
  _id: string;
  shuffleQuestionOrder: string[];
  correctNum: number;
  incorrectNum: number;
  totalCardNum: number;
  studyTime: number;
  skillId?: string;

  constructor(args: Partial<StudyScoreData> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.shuffleQuestionOrder = args.shuffleQuestionOrder ?? [];
    this.correctNum = args.correctNum ?? 0;
    this.incorrectNum = args.incorrectNum ?? 0;
    this.totalCardNum = args.totalCardNum ?? 0;
    this.studyTime = args.studyTime ?? 0;
    this.skillId = args.skillId;
  }
}

export default StudyScoreData;
