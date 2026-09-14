import MyCardData from "../../modules/share/model/myCardData";
import { StudyScore } from "../../modules/share/model/studyScore";
import { StudyScoreData } from "../../modules/share/model/studyScoreData";
import StudyScoreDetail from "../../modules/share/model/studyScoreDetail";
import Topic from "../../modules/share/model/topic";
import TopicProgress from "../../modules/share/model/topicProgress";
import { get, getEndpoint, post, postWithStatus } from "../../utils/fetcher";
import { CreateAppPracticeDataArgs, GetTopicsByParentSlugArgs, GetTopicsBySlugsArgs, OffsetTopicsByParentIdArgs, UpdateAppPracticeDataArgs, UpdateAppPracticeResultArgs } from "./topic.model";
import { TopicItem } from "./topic.slice";

export const apiGetEntryTopicsBySlugs = async (args: { slugs: string[]; courseIds?: string[]; entryTopicTypes?: number[]; local?: boolean }): Promise<{ notFound: boolean; data: TopicItem[]; error?: boolean }> => {
  const { local = false, slugs, courseIds, entryTopicTypes } = args;
  const { data, error } = await post({
    endpoint: getEndpoint('/api/get-entry-topics-by-slugs', local), body: {
      fields: ["_id", "avatar", "childType", "description", "name", "parentId", "slug", "type", "videoUrl", "shortDescription"],
      slugs,
      courseIds,
      maxDepth: 3,
      entryTopicTypes
    }
  });
  return error ? { notFound: true, data: [], error: true } : data;
}

export const apiOffsetTopicsByParentId = async (args: OffsetTopicsByParentIdArgs): Promise<TopicItem[]> => {
  const { field = "orderIndex", asc = true, skip = 0, serverSide = false, ...rest } = args;
  const { data, error } = await postWithStatus({ endpoint: getEndpoint('/api/offset-topics-by-parent-id', serverSide), body: { field, asc, skip, ...rest } });
  return error ? [] : data;
}

export const apiGetTopicByParentId = async (args: { parentId: string, local?: boolean }) => {
  const { parentId, local = true } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api-cms/get-topic-by-parent-id', local), body: { parentId } });
  return error ? [] : data;
}

export const apiGetTopicContentById = async (args: { id: string }) => {
  const { data, error } = await post({ endpoint: getEndpoint('/api-cms/get-topic-content-by-id'), body: args });
  return error ? [] : data;
}

export const apiGetCourseByCategoryId = async (args: { categoryId: string, local?: boolean }) => {
  const { categoryId, local = true } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api-cms/get-course-by-category-id', local), body: { categoryId } })
}

export const apiGetDifficultyByTopicId = async (args: { topicId: string }) => {
  const { data, error } = await post({ endpoint: "/api-cms/count-difficulty-by-topic-id", body: args });
  return error ? {} : data;
}

export const apiGetTopicPracticesHistory = async (args: { topicId: string, userId: string, studyScoreId: string }) => {
  const { data, error } = await post({ endpoint: "/api/get-practices-history", body: args });
  return error ? {} : data;
}

export const apiGetTopicsByParentSlug = async (args: GetTopicsByParentSlugArgs): Promise<Array<{ _id: string; name: string; slug: string; children: Topic[] }>> => {
  const { local = true, ...payload } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api/get-topics-by-parent-slug', local), body: payload })
  return error ? [{}] : data;
}

export const apiGetTopicsBySlugs = async (args: GetTopicsBySlugsArgs): Promise<Array<Topic>> => {
  const { local = true, ...payload } = args;
  const { data, error } = await post({ endpoint: getEndpoint('/api/get-topics-by-slugs', local), body: payload })
  return error ? [] : data;
}

export const apiGetTopicProgresses = async (args: { topicIds: string[]; userId: string }): Promise<TopicProgress[]> => {
  const { topicIds: ids, userId } = args;
  const topicIds = ids.join(",");
  const { data, error } = await get({ endpoint: "/api/topic-progresses", params: { topicIds, userId } });
  return error ? [] : data;
}

export const apiGetStudyData = async (args: { topicId: string, userId: string, studyScoreDataId?: string }): Promise<StudyScore & { myCardData?: MyCardData } | null> => {
  const { data, error } = await get({ endpoint: "/api/app-study-data", params: args });
  return error ? null : data;
}

export const apiGetTimeOnSiteStatistic = async (args: { userId: string }): Promise<Array<{ _id: string, totalTimeByDay: number }>> => {
  const { data, error } = await post({ endpoint: "/api/time-on-site-statistic", body: args });
  return error ? null : data;
}

export const apiCreateStudyData = async (args: CreateAppPracticeDataArgs): Promise<{
  studyScore: StudyScore, topicProgress: TopicProgress
}> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "create_practice_data" }, body: args });
  return error ? {} : data;
}

export const apiCreateStudyDataAgain = async (args: CreateAppPracticeDataArgs & { studyScoreId: string }): Promise<{
  studyScoreData: StudyScoreData
}> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "create_practice_again" }, body: args });
  return error ? {} : data;
}

export const apiUpdateStudyData = async (args: UpdateAppPracticeDataArgs): Promise<number> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "update_practice_data" }, body: args });
  return error ? 0 : data;
}

export const apiUpdateStudyResult = async (args: UpdateAppPracticeResultArgs): Promise<{ updated: number; studyScoreTotalCorrect: number }> => {
  const { data, error } = await post({ endpoint: "/api/app-study-data", params: { type: "update_practice_result" }, body: args });
  return error ? { updated: 0, studyScoreTotalCorrect: 0 } : data;
}

export const apiUpdateStudyScoreDetail = async (args: StudyScoreDetail & {
  updateCardData?: boolean;
  boxCardValue?: number;
}) => {
  await post({ endpoint: "/api/update-exam-score-detail", body: args });
}

export const apiBulkUpdateTopicProgresses = async (args: { topicProgresses: TopicProgress[]; }) => {
  await post({ endpoint: "/api/topic-progresses", params: { type: "bulk_update" }, body: { ...args, upsert: true } });
}

export const apiGetExamScoreDetails = async (args: { studyScoreDataId: string; userId: string }): Promise<StudyScoreDetail[]> => {
  const { data, error } = await post({ endpoint: "/api/get-exam-score-detail-by-parent-id", body: args });
  return error ? [] : data;
}

export const apiResetCardStudyData = async (args: { studyScoreDataId: string }) => {
  await post({ endpoint: "/api/app-study-data", params: { type: "reset_card_study_data" }, body: { ...args } })
}

export const apiGetTopicById = async (args: {
  topicId: string;
  withCourse?: boolean;
  withExercise?: boolean;
  populatePaths?: boolean;
  local?: boolean
}): Promise<TopicItem> => {
  const { data, error } = await post({ endpoint: getEndpoint("/api/get-topic-by-id", args.local), body: args });
  return error ? null : data;
}