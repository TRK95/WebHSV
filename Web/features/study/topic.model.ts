import MyCardData from "../../modules/share/model/myCardData";
import { StudyScore } from "../../modules/share/model/studyScore";
import Topic, { ITopic } from "../../modules/share/model/topic";
import TopicExercise from "../../modules/share/model/topicExercise";
import TopicProgress from "../../modules/share/model/topicProgress";

export class ClientTopicProgress {
  id: string;
  studyTime: number;
  topicId: string;
  skillId: string;
  userId: string;
  progress: number;
  score: number;
  status: number;
  totalCardNum: number;
  correctNum: number;
  incorrectNum: number;
  totalTime: number;
  cardOrder: string[];
  boxCard: {
    [cardId: string]: number;
  };
  cardBookmarks: string[];
  constructor(args: {
    [key in keyof ClientTopicProgress]?: any;
  } = {}) {
    [
      "studyTime",
      "topicId",
      "userId",
      "progress",
      "score",
      "status",
      "totalCardNum",
      "correctNum",
      "incorrectNum",
      "cardOrder",
      "boxCard",
      "cardBookmarks",
      "totalTime"
    ].forEach((key) => {
      if (args.hasOwnProperty(key)) this[key] = args[key];
      this.id = `${args.topicId}${args.skillId ? `_${args.skillId}` : ''}`;
    });
  }

  static clone(args: ClientTopicProgress) {
    return new ClientTopicProgress({ ...args });
  }

  static fromServerTopicProgress(args: TopicProgress & { score?: number; totalTime?: number }) {
    const clientTopicProgress = new ClientTopicProgress({
      topicId: args.topicId, status: args.status, progress: args.progress, userId: args.userId, score: args.score, totalTime: args.totalTime
    });
    return clientTopicProgress;
  }

  static fromServerStudyScore(args: StudyScore & { myCardData?: MyCardData }) {
    const studyData = args.studyScoreData;
    const clientTopicProgress = new ClientTopicProgress({
      topicId: args.topicId, status: args.status, progress: args.progress, userId: args.userId,
      cardOrder: studyData?.shuffleQuestionOrder ?? [],
      correctNum: studyData?.correctNum, incorrectNum: studyData?.incorrectNum, totalCardNum: studyData?.totalCardNum,
      studyTime: studyData?.studyTime,
      boxCard: args.myCardData?.boxCard ?? {},
      cardBookmarks: args.myCardData?.cardBookmarks ?? [],
      score: args.score,
      totalTime: args.totalTime
      // skillId: studyData?.skillId,
    });
    return clientTopicProgress;
  }

  setProgress(progress: number) {
    this.progress = progress;
  }
  setScore(score: number) {
    this.score = score;
  }
  setQuestionStats(args: {
    totalQuestions?: number;
    totalCorrect?: number;
    totalIncorrect?: number;
  }) {
    if (typeof args.totalQuestions !== "undefined") {
      this.totalCardNum = args.totalQuestions;
    }
    if (typeof args.totalCorrect !== "undefined") {
      this.correctNum = args.totalCorrect;
    }
    if (typeof args.totalIncorrect !== "undefined") {
      this.incorrectNum = args.totalIncorrect;
    }
  }
  setCardOrder(cardOrder: string[]) {
    this.cardOrder = cardOrder;
  }

  setStatus(status: number) {
    this.status = status;
  }

  increaseStudyTime() {
    this.studyTime = (this.studyTime || 0) + 1;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setStudyData(args: {
    [key in keyof Omit<ClientTopicProgress,
      "studyTime" | "topicId" | "userId" | "id" | "skillId" |
      "setProgress" | "setScore" | "setQuestionStats" | "setCardOrder" | "setStatus" | "increaseStudyTime" | "setStudyData" | "setTotalTime" | "setUserId"
    >]?: any;
  }) {
    [
      "progress",
      "score",
      "status",
      "totalCardNum",
      "correctNum",
      "incorrectNum",
      "cardOrder",
      "boxCard"
    ].forEach((key) => {
      if (args.hasOwnProperty(key) && typeof args[key] !== "undefined") this[key] = args[key];
    })
  }

  setTotalTime(second: number) {
    this.totalTime = second;
  }
}

export type CreateAppPracticeDataArgs = {
  [key in keyof Pick<
    ClientTopicProgress,
    "userId" | "topicId" | "cardOrder" | "studyTime"
  >]?: any
} & { courseId?: string; parentId?: string; gameType?: number }

export type UpdateAppPracticeDataArgs = {
  studyScoreId?: string;
  studyScoreDataId?: string;
  topicProgressId?: string;
  progress?: number;
  totalCorrect?: number;
  totalIncorrect?: number;
  totalQuestions?: number;
  cardOrder?: string[];
  studyTime?: number;
  status?: number;
  totalTime?: number;
  score?: number;
}

export type UpdateAppPracticeResultArgs = {
  studyScoreDataProgress: UpdateAppPracticeDataArgs,
  studyScoreProgress?: {
    cardId: string,
    studyScoreTotalCorrect: number,
    totalStorage: number,
    userId: string,
    topicId: string
  }
}

export type OffsetTopicsByParentIdArgs = {
  parentId: string | null;
  courseId: string;
  field?: keyof ITopic;
  limit?: number;
  asc?: boolean;
  skip?: number;
  userId?: string;
  private?: boolean;
  topicTypes?: number[];
  topicFields?: Array<keyof Topic>;
  exerciseFields?: Array<keyof TopicExercise>;
  serverSide?: boolean;
}

export type GetTopicsByParentSlugArgs = {
  courseId: string;
  field?: keyof ITopic;
  asc?: boolean;
  baseSlug?: string;
  slug: string | string[];
  skip?: number;
  limit?: number;
  topicFields?: Array<keyof Topic>;
  exerciseFields?: Array<keyof TopicExercise>;
  topicTypes?: number[];
  local?: boolean;
}

export type GetTopicsBySlugsArgs = {
  courseId: string;
  slug: string | string[];
  topicFields?: Array<keyof Topic>;
  exerciseFields?: Array<keyof TopicExercise>;
  local?: boolean;
}