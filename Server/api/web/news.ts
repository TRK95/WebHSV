import express from "express";
import NewsService from "../../services/newsService";
import asyncHandler from "../../utils/asyncHandler";

const Router = express.Router();
const newsService = new NewsService();

Router.post(
  "/news/getNewsByDate",
  asyncHandler(async (req, res) => {
    const _limit = req.query.limit;
    const _offset = req.query.offset;
    const _status = req.query.status;
    const _contentType = req.query.contentType;

    const limit = typeof _limit !== "string" ? undefined : +_limit;
    const offset = typeof _offset !== "string" ? undefined : +_offset;
    const status = typeof _status !== "string" ? undefined : +_status;
    const contentType = typeof _contentType !== "string" ? 0 : +_contentType;

    const result = await newsService.getNewsByDate({
      limit,
      offset,
      status,
      contentType,
    });

    return res.status(200).json(result);
  })
);

Router.post(
  "/news/updateNews",
  asyncHandler(async (req, res) => {
    const {
      _id,
      title,
      content,
      contentType,
      shortDes,
      createDate,
      avatar,
      slug,
      writer,
      status,
      docUrl
    } = <
      {
        _id?: string;
        title: string;
        content: string;
        contentType: number;
        shortDes: string;
        createDate: number;
        avatar: string;
        slug: string;
        writer: string;
        docUrl: string;
        status: number;
      }
      >req.body;
    const result = await newsService.apiUpdateNews({
      _id,
      title,
      content,
      contentType,
      shortDes,
      createDate,
      avatar,
      slug,
      writer,
      status,
      docUrl
    });

    return res.status(200).json(result);
  })
);

Router.post(
  "/news/getNewsCategory",
  asyncHandler(async (req, res) => {
    const _parentId = req.query.parentId;
    const _status = req.query.status;
    const _type = req.query.type;

    const parentId = typeof _parentId !== "string" ? undefined : _parentId;
    const status = typeof _status !== "string" ? undefined : +_status;
    const type = typeof _type !== "string" ? 0 : +_type;

    const result = await newsService.apiGetNewsCategory({
      parentId,
      status,
      type,
    });

    return res.status(200).json(result);
  })
);

Router.post(
  "/news/updateNewsCategory",
  asyncHandler(async (req, res) => {
    const {
      _id,
      title,
      des,
      slug,
      status,
      parentId,
      type,
      key,
    } = <
      {
        _id?: string;
        title: string;
        des: string;
        slug: string;
        status: number;
        parentId: string;
        type: number;
        key?: string;
      }
      >req.body;

    const result = await newsService.apiUpdateNewsCategory({
      _id,
      title,
      des,
      slug,
      status,
      parentId,
      type,
      key,
    });

    return res.status(200).json(result);
  })
);

Router.post(
  "/news/addOrRemoveNewFromCategory",
  asyncHandler(async (req, res) => {
    const _newsId = req.query.newsId;
    const _adds = req.query.adds;
    const _removes = req.query.removes;

    const newsId = typeof _newsId !== "string" ? undefined : _newsId;
    const adds = typeof _adds !== "string" ? undefined : _adds;
    const removes = typeof _removes !== "string" ? undefined : _removes;

    const result = await newsService.apiAddOrRemoveNewFromCategory({
      newsId,
      adds,
      removes,
    });

    return res.status(200).json(result);
  })
);

Router.get(
  "/news/getNewsBySlug",
  asyncHandler(async (req, res) => {
    const _slug = req.query.slug;

    const slug = typeof _slug !== "string" ? undefined : _slug;

    const result = await newsService.apiGetNewsBySlug({
      slug,
    });
    return res.status(200).json(result);
  })
);

Router.get(
  "/news/getCategoryNewsBySlug",
  asyncHandler(async (req, res) => {
    const _slug = req.query.slug;

    const slug = typeof _slug !== "string" ? undefined : _slug;

    const result = await newsService.apiGetCategoryNewsBySlug({
      slug,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/news/getNewsInCategory",
  asyncHandler(async (req, res) => {
    const _limit = req.query.limit;
    const _offset = req.query.offset;
    const _status = req.query.status;
    const _categoryId = req.query.categoryId;

    const limit = typeof _limit !== "string" ? undefined : +_limit;
    const offset = typeof _offset !== "string" ? undefined : +_offset;
    const status = typeof _status !== "string" ? undefined : +_status;
    const categoryId =
      typeof _categoryId !== "string" ? undefined : _categoryId;

    const result = await newsService.apiGetNewsInCategory({
      limit,
      offset,
      status,
      categoryId,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/news/getNewsByType",
  asyncHandler(async (req, res) => {
    const _limit = req.query.limit;
    const _offset = req.query.offset;
    const _status = req.query.status;
    const _contentType = req.query.contentType;

    const limit = typeof _limit !== "string" ? undefined : +_limit;
    const offset = typeof _offset !== "string" ? undefined : +_offset;
    const status = typeof _status !== "string" ? undefined : +_status;
    const contentType = typeof _contentType !== "string" ? undefined : +_contentType;

    const result = await newsService.apiGetNewsByType({
      limit,
      offset,
      status,
      contentType,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/news/getCategoriesOfNew",
  asyncHandler(async (req, res) => {
    const _newId = req.query.newId;

    const newId = typeof _newId !== "string" ? undefined : _newId;

    const result = await newsService.apiGetcategoryOfNews({
      newId,
    });
    return res.status(200).json(result);
  })
);
export { Router as newsRouters };
