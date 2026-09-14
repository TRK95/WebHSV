import { Card } from "../../modules/share/model/card";
import { getEndpoint, post } from "../fetcher";

export const apiGetCardsByTopicId = async (args: { parentId: string }): Promise<Card[]> => {
  const { data, error } = await post({
    endpoint: "/api-cms/get-card-by-topic-id",
    body: args
  });
  return error ? [] : data;
}

export const apiGetCardsByIds = async (args: { cardIds: string[]; serverSide?: boolean }): Promise<Array<Card>> => {
  const { serverSide, ...payload } = args;
  const { data, error } = await post({
    endpoint: getEndpoint("/api/get-card-by-ids", serverSide),
    body: payload
  });
  return error ? [] : data;
}