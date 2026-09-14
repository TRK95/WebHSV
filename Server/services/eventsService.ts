import { EventModel } from "../database/mongo/Event";
import { EventMemberModel } from "../database/mongo/EventMember";
import { UserInfoModel } from "../database/mongo/UserInfo";
import { UserInfoI } from "../models/UserInfo";

export default class EventsService {
  async getEventsByDate(args: {
    limit?: number;
    offset?: number;
    status?: number;
  }) {
    const { limit, offset, status } = args;

    if (limit && offset !== undefined) {
      const eventsList = await EventModel.find({
        status: status,
      })
        .sort({ createDate: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
      const total = await (
        await EventModel.find({ status: status })
      ).length;

      const result = {
        data: eventsList,
        total: total,
        status: 0,
      };

      return result;
    }
    return { data: [], total: 0, status: -1 };
  }

  async updateEvent(args: {
    _id?: string;
    title: string;
    content: string;
    criteria: string;
    avatar: string;
    slug: string;
    hostBy: string;
    status: number;
    fromDate: number;
    toDate: number;
    registerFromDate: number;
    registerToDate: number;
    settingStatus: number;
    memNum: number;
  }) {
    const {
      _id,
      title,
      criteria,
      avatar,
      slug,
      status,
      fromDate,
      toDate,
      content,
      registerFromDate,
      registerToDate,
      settingStatus,
      hostBy,
      memNum,
    } = args;

    const time = new Date();
    if (_id) {
      const updateEvents = await EventModel.findByIdAndUpdate(
        _id,
        {
          title,
          criteria,
          avatar,
          slug,
          status,
          fromDate,
          toDate,
          content,
          registerFromDate,
          registerToDate,
          settingStatus,
          hostBy,
          memNum,
        },
        {
          new: true,
        }
      );
      const result = {
        data: updateEvents,
        status: 0,
      };

      return result;
    }

    const events = new EventModel({
      title,
      criteria,
      avatar,
      slug,
      status,
      createDate: time.getTime(),
      fromDate,
      toDate,
      content,
      registerFromDate,
      registerToDate,
      settingStatus,
      hostBy,
      memNum
    });
    const data = await events.save();

    const result = {
      data: data,
      status: 0,
    };
    return result;
  }

  async getEventsBySlug(args: { slug?: string }) {
    const { slug } = args;
    const news = await EventModel.findOne({
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

  async joinEvent(args: {
    user?: any;
    eventId?: string;
    note?: string;
    status?: number
  }) {
    const { user, eventId, note, status } = args;
    const time = new Date();
    try {
      const checkUserInfo = await UserInfoModel.findOne({ userId: user?.userId });
      if (checkUserInfo) {
        const checkEventMember = await EventMemberModel.findOne({ userId: checkUserInfo?._id, eventId: eventId, status: { $ne: -1 } });
        if (checkEventMember) {
          return { data: null, status: 2 };
        }
        const eventMember = new EventMemberModel({
          userId: checkUserInfo?._id,
          eventId: eventId,
          note: note,
          joinDate: time.getTime(),
          status: status,
          student: checkUserInfo
        });
        await eventMember.save();
        if (status === 1) {
          await EventModel.findByIdAndUpdate(eventId, { $inc: { memNum: 1 } });
        }
        return {
          data: eventMember,
          status: 0,
        };
      }

      const userInfoNew = new UserInfoModel({
        ...user,
        password: user?.userId,
        createDate: time.getTime(),
        lastCheckin: -1,
      });
      await userInfoNew.save();
      const eventMember = new EventMemberModel({
        userId: userInfoNew?._id,
        eventId: eventId,
        note: note,
        joinDate: time.getTime(),
        status: status,
        student: userInfoNew
      });

      await eventMember.save();

      if (status === 1) {
        await EventModel.findByIdAndUpdate(eventId, { $inc: { memNum: 1 } });
      }

      const result = {
        data: eventMember,
        status: 0,
      };
      return result;
    } catch (err) {
      const result = {
        data: null,
        status: -1,
      };
      return result;
    }
  }

  async approveEvent(args: {
    userId?: string;
    eventId?: string;
    status?: number;
  }) {
    const { userId, eventId, status } = args;
    const time = new Date();
    try {
      const oldEventMember = await EventMemberModel.findOne({ userId: userId, eventId: eventId });
      const oldStatus = oldEventMember?.status;
      const eventMember = await EventMemberModel.findOneAndUpdate(
        { userId: userId, eventId: eventId },
        { status: status, joinDate: time.getTime() },
        { new: true }
      );

      if (status === -1)
        await EventMemberModel.findOneAndDelete({ userId: userId, eventId: eventId });

      if ((oldStatus === 0 || oldStatus === -1) && status === 1)
        await EventModel.findByIdAndUpdate(eventId, { $inc: { memNum: 1 } });
      if (oldStatus === 1 && status === -1)
        await EventModel.findByIdAndUpdate(eventId, { $inc: { memNum: -1 } });
      if ((oldStatus === 1 || oldStatus === -1) && status === 0)
        await EventModel.findByIdAndUpdate(eventId, { $inc: { memNum: -1 } });

      if (eventMember) {
        const result = {
          data: eventMember,
          status: 0,
        };
        return result;
      }
      const result = {
        status: -1,
      };
      return result;
    } catch (err) {
      const result = {
        status: -1,
      };
      return result;
    }
  }

  async getMemberEvents(args: {
    eventId?: string;
    offset?: number;
    limit?: number;
  }) {
    const { eventId, offset, limit } = args;

    if (limit && offset !== undefined && eventId) {
      const eventMemberList = await EventMemberModel.find({
        eventId: eventId,
        status: { $ne: -1 }
      })
        .sort({ createDate: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
      const total = await (
        await EventMemberModel.find({ eventId: eventId, status: { $ne: -1 } })
      ).length;

      const result = {
        data: eventMemberList,
        total: total,
        status: 0,
      };
      return result;
    }
    const result = {
      data: [],
      total: 0,
      status: 0,
    };
    return result;
  }

  async getMemberInfoEvents(args: {
    eventId?: string;
    offset?: number;
    limit?: number;
  }) {
    const { eventId, offset, limit } = args;

    if (limit && offset !== undefined && eventId) {
      const eventMemberList = await EventMemberModel.find({
        eventId: eventId,
      })
        .sort({ createDate: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
      const userIds = eventMemberList.map((member) => member.userId);
      const userInfoList = await UserInfoModel.find({ _id: { $in: userIds } });

      const total = await (
        await EventMemberModel.find({ eventId: eventId })
      ).length;

      const result = {
        data: userInfoList,
        total: total,
        status: 0,
      };
      return result;
    }
    const result = {
      data: [],
      total: 0,
      status: 1,
    };
    return result;
  }

  async getUserEvent(args: { userId?: string, status?: number }) {
    const { userId, status } = args;
    if (userId && status) {
      const matchEventMember = await EventMemberModel.find({ userId: userId, status: status });
      if (matchEventMember) {
        const matchEventId = matchEventMember.map(item => item.eventId);
        const matchEvent = await EventModel.find({ _id: { $in: matchEventId } });
        if (matchEvent) {
          return {
            data: matchEvent,
            total: matchEventId.length,
            status: 0
          };
        }
      }
    }
    return {
      data: null,
      total: 0,
      status: 0
    };
  }
}
