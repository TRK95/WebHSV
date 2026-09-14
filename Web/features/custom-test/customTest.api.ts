import MockTest from "../../modules/share/model/mockTest";
import { post } from "../../utils/fetcher";

export const apiGetMockTests = async (args: {
  courseId: string;
  fields?: Array<keyof MockTest>;
  limit?: number;
  skip?: number;
  userId: string;
}): Promise<{ data: MockTest[]; total: number; }> => {
  const { data, error } = await post({
    endpoint: "/api/get-mock-tests",
    body: args
  });
  return error ? { data: [], total: 0 } : data
}

export const apiCreateMockTest = async (args: {
  userId: string;
  courseId: string;
  duration: number;
  questionsNum: number;
  pass: number;
  cardStudyOrder: number;
  topicIds?: string[];
  offline?: boolean;
  excludedCardIds?: string[]
}): Promise<MockTest> => {
  const params: any = {};
  const { offline, ...payload } = args;
  if (offline) params.type = "offline";
  const { data, error } = await post({
    endpoint: "/api/create-mock-tests",
    body: payload,
    params
  });
  return error ? null : data;
}

export const apiGetMockTestById = async (args: { _id: string }): Promise<MockTest | null> => {
  const { data, error } = await post({
    endpoint: "/api/get-mock-test-by-id",
    body: args
  });
  return error ? null : data;
}