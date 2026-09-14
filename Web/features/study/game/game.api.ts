import { Card } from "../../../modules/share/model/card";
import Skill from "../../../modules/share/model/skill";
import { get, post } from "../../../utils/fetcher";

export type StatisticCart = {
  _id: number & {
    _id: string,
    value: string,
    name: string
  },
  cards: Array<{
    cardId: string,
    correct: number
  }>,
  label?: string,
  data?: any
}

export const apiGetCardsByTopicId = async (args: { topicId: string; cardTypes?: number[]; typeQuery?: string; questionTotal?: number, level?: number }): Promise<Card[]> => {
  const { data, error } = await post({
    endpoint: "/api/get-card-by-topic-id",
    params: args.typeQuery ? { typeQuery: args.typeQuery } : {},
    body: { topicId: args.topicId, type: args.cardTypes ?? [], questionTotal: args.questionTotal ?? null, level: args.level ?? 0 }
  });
  return error ? [] : data
}

export const apiGetCardsByIds = async (args: { cardIds: string[] }): Promise<Card[]> => {
  const { data, error } = await post({
    endpoint: "/api/get-card-by-ids",
    body: args
  });
  return error ? [] : data;
}

export const apiGetSkillsByExamType = async (args: { examType: number }): Promise<Skill[]> => {
  const { data, error } = await get({ endpoint: "/api/get-skills", params: { examType: args.examType } });
  return error ? [] : data;
}

export const apiGetStatisticCardsDoneByLevel = async (args: { userId: string, topicId?: string, studyScoreDataId?: string, courseId?: string }): Promise<Array<StatisticCart>> => {
  const { data, error } = await post({ endpoint: "/api/get-statistic-cards-done-by-level", body: args });
  return error ? [] : data;
}

export const apiGetStatisticCardsDoneByTagId = async (args: { userId: string, topicId?: string, studyScoreDataId?: string, courseId?: string }): Promise<Array<StatisticCart>> => {
  const { data, error } = await post({ endpoint: "/api/get-statistic-cards-done-by-tagid", body: args });
  return error ? [] : data;
}

export const apiGetNumTagCardByTopicId = async (args: { topicId: string }): Promise<Array<{ _id: string, count: number }>> => {
  const { data, error } = await post({ endpoint: "/api-cms/count-tags-by-topic-id", body: args });
  return error ? [] : data;
}

// export const apiUpdateCardProgress = async (args: { }) => {

// }