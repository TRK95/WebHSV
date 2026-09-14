import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import EventsService from "../../services/eventsService";

const Router = express.Router();
const eventsService = new EventsService();

Router.post(
  "/events/getEventsByDate",
  asyncHandler(async (req, res) => {
    const _limit = req.query.limit;
    const _offset = req.query.offset;
    const _status = req.query.status;

    const limit = typeof _limit !== "string" ? undefined : +_limit;
    const offset = typeof _offset !== "string" ? undefined : +_offset;
    const status = typeof _status !== "string" ? undefined : +_status;

    const result = await eventsService.getEventsByDate({
      limit,
      offset,
      status,
    });

    return res.status(200).json(result);
  })
);

Router.post(
  "/events/updateEvent",
  asyncHandler(async (req, res) => {
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
    } = <
      {
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
      }
      >req.body;

    const result = await eventsService.updateEvent({
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
    });

    return res.status(200).json(result);
  })
);

Router.get(
  "/events/getEventsBySlug",
  asyncHandler(async (req, res) => {
    const _slug = req.query.slug;

    const slug = typeof _slug !== "string" ? undefined : _slug;

    const result = await eventsService.getEventsBySlug({
      slug,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/events/joinEvent",
  asyncHandler(async (req, res) => {
    const _user = req.body;
    const _eventId = req.query.eventId;
    const _note = req.query.note;
    const _status = req.query.status;

    const user = _user?.user ? _user.user : null;
    const eventId = typeof _eventId !== "string" ? undefined : _eventId;
    const note = typeof _note !== "string" ? undefined : _note;
    const status = typeof _status !== "string" ? undefined : +_status;

    const result = await eventsService.joinEvent({
      user,
      eventId,
      note,
      status
    });
    return res.status(200).json(result);
  })
);

// Router.post(
//   "/events/approveEvent",
//   asyncHandler(async (req, res) => {
//     const _studentId = req.query.studentId;
//     const _eventId = req.query.eventId;
//     const _status = req.query.status;

//     const studentId = typeof _studentId !== "string" ? undefined : +_studentId;
//     const eventId = typeof _eventId !== "string" ? undefined : _eventId;
//     const status = typeof _status !== "string" ? undefined : +_status;

//     const result = await eventsService.approveEvent({
//       studentId,
//       eventId,
//       status,
//     });
//     return res.status(200).json(result);
//   })
// );

Router.post(
  "/events/approveEvent",
  asyncHandler(async (req, res) => {
    const _userId = req.query.userId;
    const _eventId = req.query.eventId;
    const _status = req.query.status;

    const userId = typeof _userId !== "string" ? undefined : _userId;
    const eventId = typeof _eventId !== "string" ? undefined : _eventId;
    const status = typeof _status !== "string" ? undefined : +_status;

    const result = await eventsService.approveEvent({
      userId,
      eventId,
      status,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/events/getMemberEvents",
  asyncHandler(async (req, res) => {
    const _eventId = req.query.eventId;
    const _offset = req.query.offset;
    const _limit = req.query.limit;

    const eventId = typeof _eventId !== "string" ? undefined : _eventId;
    const offset = typeof _offset !== "string" ? undefined : +_offset;
    const limit = typeof _limit !== "string" ? undefined : +_limit;

    const result = await eventsService.getMemberEvents({
      eventId,
      offset,
      limit,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/events/getMemberInfoEvents",
  asyncHandler(async (req, res) => {
    const _eventId = req.query.eventId;
    const _offset = req.query.offset;
    const _limit = req.query.limit;

    const eventId = typeof _eventId !== "string" ? undefined : _eventId;
    const offset = typeof _offset !== "string" ? undefined : +_offset;
    const limit = typeof _limit !== "string" ? undefined : +_limit;

    const result = await eventsService.getMemberInfoEvents({
      eventId,
      offset,
      limit,
    });
    return res.status(200).json(result);
  })
);

Router.post(
  "/events/getMyEvents",
  asyncHandler(async (req, res) => {
    const _userId = req.query.userId;
    const _status = req.query.status;

    const userId = typeof _userId !== "string" ? undefined : _userId;
    const status = typeof _status !== "string" ? undefined : +_status;
    const result = await eventsService.getUserEvent({ userId, status });
    return res.status(200).json(result);
  })
);

export { Router as eventsRouters };