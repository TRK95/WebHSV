import { CategoryModel } from "../database/mongo/Category";
import { NewModel } from "../database/mongo/New";
import { NewInCategoryModel } from "../database/mongo/NewInCategory";
import New from "../models/New";
import NewInCategory from "../models/NewInCategory";
export default class NewsService {
  async getNewsByDate(args: {
    limit?: number;
    offset?: number;
    status?: number;
    contentType?: number;
  }) {
    const { limit, offset, status, contentType } = args;

    if (limit && offset !== undefined) {
      const newsList = await NewModel.find({
        status: status,
        contentType: contentType,
      })
        .sort({ createDate: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
      const total = await (
        await NewModel.find({
          status: status,
          contentType: contentType,
        })
      ).length;
      const result = {
        data: await Promise.all(
          newsList.map(async (item) => {
            const newsInCategory = await NewInCategoryModel.find({
              newsId: item._id,
            });

            const news = new New(item);
            return { ...news, inCategories: newsInCategory };
          })
        ),
        total: total,
        status: 0,
      };
      return result;
    }
    return { data: [], total: 0, status: -1 };
  }

  async apiUpdateNews(args: {
    _id?: string;
    title: string;
    content: string;
    contentType: number;
    shortDes: string;
    createDate: number;
    avatar: string;
    slug: string;
    writer: string;
    status: number;
    docUrl: string;
  }) {
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
      docUrl,
    } = args;

    const time = new Date();
    if (_id) {
      const updateNews = await NewModel.findByIdAndUpdate(
        _id,
        {
          title: title,
          content: content,
          contentType: contentType,
          shortDes: shortDes,
          avatar: avatar,
          slug: slug,
          status: status,
          writer: writer,
          docUrl: docUrl,
          lastUpdate: time.getTime(),
        },
        {
          new: true,
        }
      );
      const result = {
        data: updateNews,
        status: 0,
      };

      return result;
    }
    const news = new NewModel({
      title: title,
      content: content,
      contentType: contentType,
      shortDes: shortDes,
      createDate: createDate || time.getTime(),
      avatar: avatar,
      slug: slug,
      status: status,
      writer: writer,
      docUrl: docUrl,
    });
    const data = await news.save();
    const result = {
      data: data,
      status: 0,
    };
    return result;
  }

  async apiGetNewsCategory(args: {
    parentId?: string;
    status?: number;
    type?: number;
  }) {
    const { parentId, status, type } = args;
    if (parentId === "-1" || parentId === "0" || parentId === undefined) {
      const newsCategory = await CategoryModel.find({
        status: status,
        type: type,
        parentId: undefined,
      });
      const result = {
        data: newsCategory,
        status: 0,
      };
      return result;
    }
    const newsCategory = await CategoryModel.find({
      parentId,
      status,
    });
    const result = {
      data: newsCategory,
      status: 0,
    };
    return result;
  }

  async apiUpdateNewsCategory(args: {
    _id?: string;
    title: string;
    des: string;
    slug: string;
    status: number;
    parentId: string;
    type: number;
    key?: string;
  }) {
    const {
      _id,
      title,
      des,
      slug,
      status,
      parentId,
      type,
      key
    } = args;
    const parent_id =
      parentId === "-1" || parentId === "0" ? undefined : parentId;
    if (_id) {
      const createdAt = new Date();
      const updateNewsCategory = await CategoryModel.findByIdAndUpdate(
        _id,
        {
          title: title,
          des: des,
          slug: slug,
          createDate: createdAt.getTime(),
          status: status,
          parentId: parent_id,
          type: type,
        },
        {
          new: true,
        }
      );
      if (key) {
        await CategoryModel.updateMany({ parentId: _id }, { status: -1 });
      }
      const result = {
        data: updateNewsCategory,
        status: 0,
      };

      return result;
    }
    const createdAt = new Date();
    const newsCategory = new CategoryModel({
      title: title,
      des: des,
      slug: slug,
      createDate: createdAt.getTime(),
      status: status,
      parentId: parent_id,
      type: type,
    });
    const data = await newsCategory.save();

    const result = {
      data: data,
      status: 0,
    };
    return result;
  }

  async apiAddOrRemoveNewFromCategory(args: {
    newsId?: string;
    adds?: string;
    removes?: string;
  }) {
    const { newsId, adds, removes } = args;
    try {
      if (adds) {
        const adds_arr = adds.split(",");
        const time = new Date();
        adds_arr.forEach(async (addCate) => {
          const newsInCategory = new NewInCategoryModel({
            newsId: newsId,
            categoryId: addCate,
            date: time.getTime(),
          });
          await newsInCategory.save();
        });
      }
      if (removes) {
        const removes_arr = removes.split(",");
        removes_arr.forEach(async (removeCate) => {
          await NewInCategoryModel.findOneAndDelete({
            newsId: newsId,
            categoryId: removeCate,
          });
        });
      }
      const result = {
        status: 0,
      };
      return result;
    } catch (err) {
      const result = {
        status: -1,
      };
      return result;
    }
  }

  async apiGetNewsBySlug(args: { slug?: string }) {
    const { slug } = args;

    const news = await NewModel.findOne({
      slug: slug,
    });

    if (news) {
      const result = {
        data: news,
        status: 0,
      };
      return result;
    }
    const result = {
      data: null,
      status: 0,
    };
    return result;
  }

  async apiGetCategoryNewsBySlug(args: { slug?: string }) {
    const { slug } = args;
    const news = await CategoryModel.findOne({
      slug: slug,
    });

    if (news) {
      const result = {
        data: news,
        status: 0,
      };
      return result;
    }
    const result = {
      data: null,
      status: 0,
    };
    return result;
  }

  async apiGetNewsInCategory(args: {
    limit?: number;
    offset?: number;
    status?: number;
    categoryId?: string;
  }) {
    const { categoryId, offset, limit, status } = args;

    if (limit && offset !== undefined && categoryId) {
      const NewsInCategoryList = await NewInCategoryModel.find({
        categoryId: categoryId,
      })
        .populate("newsId")
        .sort({ date: -1 })
        .skip(offset)
        .limit(limit)
        .exec();

      const newsInCategories = NewsInCategoryList.map((item) => {
        return new NewInCategory(item);
      }).filter((item) => item.news?.status === status);

      const total = await (
        await NewInCategoryModel.find({
          categoryId: categoryId,
        })
      ).length;
      const result = {
        data: newsInCategories,
        total: total,
        status: 0,
      };
      return result;
    }
    return { data: [], total: 0, status: -1 };
  }

  async apiGetNewsByType(args: {
    limit?: number;
    offset?: number;
    status?: number;
    contentType?: number;
  }) {
    const { contentType, offset, limit, status } = args;

    if (limit && offset !== undefined && contentType) {
      const newsByTypeList = await NewModel.find({
        contentType: contentType
      })
        .sort({ date: -1 })
        .skip(offset)
        .limit(limit)
        .exec();

      const total = await (
        await NewModel.find({
          contentType: contentType
        })
      ).length;
      const result = {
        data: newsByTypeList,
        total: total,
        status: 0,
      };
      return result;
    }

    return { data: [], total: 0, status: -1 };
  }

  async apiGetcategoryOfNews(args: { newId?: string }) {
    const { newId } = args;
    const newsInCateogryList = await NewInCategoryModel.find({
      newsId: newId,
    }).populate("categoryId");
    const result = {
      data: await Promise.all(
        newsInCateogryList.map(async (item) => {
          const newsCategory = item.category;
          return newsCategory;
        })
      ),
      status: 0,
    };
    return result;
  }
}
