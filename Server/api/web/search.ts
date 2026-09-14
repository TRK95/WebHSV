import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import SearchService from "../../services/searchService";

const Router = express.Router();
const searchService = new SearchService();


Router.post("/search-new-events", asyncHandler(async (req, res) => {
  const reqBody = <{ keyword: string, limit: number, offset: number, status: number }>req.body;
  const result = await searchService.searchNewEvents(reqBody)
  return res.status(200).json(result);
})
);
Router.post("/search-events", asyncHandler(async (req, res) => {
  const reqBody = <{ keyword: string, limit: number, offset: number, status: number }>req.body;
  const result = await searchService.searchEvents(reqBody)
  return res.status(200).json(result);
})
);
export { Router as searchRouters };
