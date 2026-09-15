import { Container, CircularProgress } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Image from "next/image";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import EventModel from "../../../models/eventModel";
import BreadCrumb from "../../breadcrumb/BreadCrumb";
import { useDispatch, useSelector } from "../../../app/hooks";
import {
  JOIN_STATUS_ACCEPTED,
  JOIN_STATUS_WAITING,
  STATUS_NO_REGISTER,
  STATUS_REGISTER,
  STATUS_REGISTER_JOIN,
} from "../../../utils/constraint";
import ModalJoin from "../../../features/common/ModalJoin";
import { setShowLoginPopup } from "../../../features/auth/auth.slice";
import "./style.scss";
import { apiGetEventBySlug, apiGetMembersEvent, joinEvent } from "../../../utils/api/eventsApi";
import { useSnackbar } from "notistack";
import { useForm } from "antd/lib/form/Form";
import { getDisplayImage } from "../../../utils/image";

enum StatusJoinEvent {
  FAILED = -1,
  PENDING = 0,
  SUCCESS = 1,
}

function DetailEventsPageView({
  detailEvent,
  slugs,
  membersEvent,
}: {
  detailEvent: EventModel;
  slugs?: string[];
  membersEvent: any;
}) {
  const dispatch = useDispatch();
  // const paths = [{ label: "Sự kiện", slug: "su-kien/tat-ca-su-kien" }];
  const { student } = useSelector((state) => state.authState);
  const [registerStatus, setRegisterStatus] = useState(STATUS_NO_REGISTER);
  const [isOpenModalJoinEvent, setIsOpenModalJoinEvent] = useState(false);
  const [noteJoinEvent, setNoteJoinEvent] = useState('');
  const [isJoinEvent, setIsJoinEvent] = useState<number>(StatusJoinEvent.FAILED)
  const [paths, setPaths] = useState([{ label: "Sự kiện", slug: "su-kien/tat-ca-su-kien" }])
  const [loadingJoinEvent, setLoadingJoinEvent] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (detailEvent._id && slugs.length > 0)
      setPaths((prev) => {
        return [
          ...prev,
          { label: detailEvent.title, slug: `su-kien/${slugs?.[0]}/${detailEvent.slug}` }
        ]
      })
  }, [detailEvent, slugs])

  useEffect(() => {
    if (detailEvent.settingStatus === STATUS_NO_REGISTER) {
      setRegisterStatus(STATUS_NO_REGISTER);
    } else if (detailEvent.settingStatus === STATUS_REGISTER) {
      if (
        detailEvent.registerFromDate === 0 &&
        detailEvent.registerToDate === 0
      ) {
        setRegisterStatus(STATUS_REGISTER);
      } else if (detailEvent.registerToDate < moment().valueOf()) {
        setRegisterStatus(STATUS_NO_REGISTER);
      } else {
        setRegisterStatus(STATUS_REGISTER);
      }
    } else {
      if (
        detailEvent.registerFromDate === 0 &&
        detailEvent.registerToDate === 0
      ) {
        setRegisterStatus(STATUS_REGISTER_JOIN);
      } else if (detailEvent.registerToDate < moment().valueOf()) {
        setRegisterStatus(STATUS_NO_REGISTER);
      } else {
        setRegisterStatus(STATUS_REGISTER_JOIN);
      }
    }
  }, [detailEvent]);

  console.log("membersEvent: ", membersEvent)

  useEffect(() => {
    if (student?._id) {
      if (membersEvent?.length > 0) {
        if (!membersEvent?.find(item => (item?.userId == student?._id))) {
          setIsJoinEvent(StatusJoinEvent.FAILED)
          console.log("fgdf")
        }
        if (membersEvent?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_WAITING))) {
          setIsJoinEvent(StatusJoinEvent.PENDING)
          console.log("09")
        }
        if (membersEvent?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_ACCEPTED))) {
          setIsJoinEvent(StatusJoinEvent.SUCCESS)
          console.log("dfgdfg575675674")
        }
      }
    }
  }, [membersEvent, student])

  useEffect(() => {
    if (loadingJoinEvent) {
      setTimeout(() => {
        setLoadingJoinEvent(false)
      }, 1000)
    }
  }, [student, slugs, isJoinEvent])

  const onJoinEvent = async () => {
    if (student?._id) {
      const joinEventRes = await joinEvent({
        reqQuery: {
          eventId: detailEvent?._id,
          note: noteJoinEvent ?? '',
          status: detailEvent?.settingStatus === STATUS_REGISTER ? 1 : 0
        }, reqBody: {
          user: student
        }
      })

      if (joinEventRes?.data?._id) {
        const detailEventRes = await apiGetEventBySlug({
          reqQuery: {
            slug: slugs?.[slugs?.length - 1]
          }
        })

        const dataMemberEventRes = await apiGetMembersEvent({
          reqQuery: {
            limit: 100,
            offset: 0,
            eventId: detailEventRes?.data?._id ?? ''
          }
        })

        if (dataMemberEventRes.data.length > 0) {
          if (detailEvent?.settingStatus === STATUS_REGISTER) {
            if (dataMemberEventRes.data?.find(item => (item?.userId == student?._id.toString()) && (item?.status === JOIN_STATUS_ACCEPTED))) {
              setIsJoinEvent(StatusJoinEvent.SUCCESS)
              const msg = "Bạn đã tham gia thành công!"
              enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2000 })
            }
          } else if (detailEvent?.settingStatus === STATUS_REGISTER_JOIN) {
            if (dataMemberEventRes.data?.find(item => (item?.userId == student?._id.toString()) && (item?.status === JOIN_STATUS_WAITING))) {
              setIsJoinEvent(StatusJoinEvent.PENDING)
              const msg = "Bạn đã gửi yêu cầu tham gia, vui lòng chờ quản trị viên phê duyệt!"
              enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2000 })
            }
          }
        }
      }
    } else {
      dispatch(setShowLoginPopup(true));
    }
  };

  const handleSubmit = () => {
    if (!!noteJoinEvent.trim()) {
      setLoadingJoinEvent(true)
      setIsOpenModalJoinEvent(false);
      onJoinEvent()
    } else {
      const msg = "Vui lòng nhập thông tin cá nhân!"
      enqueueSnackbar(msg, { variant: "warning", autoHideDuration: 2000 })
    }
  };

  const handleChange = (value) => {
    setNoteJoinEvent(value)
  };

  const handleCancelJoinClub = () => {
    setIsOpenModalJoinEvent(false);
  };

  const handleJoinStatusEvent = () => {
    if (student?._id) {
      if (detailEvent?.settingStatus === STATUS_REGISTER) {
        setLoadingJoinEvent(true)
        setIsOpenModalJoinEvent(false)
        onJoinEvent()
      } else if (detailEvent?.settingStatus === STATUS_REGISTER_JOIN) {
        setIsOpenModalJoinEvent(true)
      }
    } else {
      dispatch(setShowLoginPopup(true))
    }
  }

  console.log("isJoinEvent: ", isJoinEvent)

  return (
    <div
      id="detail-event-page-view"
      style={{ padding: "20px 0", color: "var(--textColor)" }}
    >
      <Container maxWidth={customMaxWidthContainer()}>
        <BreadCrumb path={paths} />
        {detailEvent ? (
          <div className="detail-event-page-view-content">
            <div className="detail-event-page-view-header">
              <div className="detail-event-page-view-header-image">
                <Image src={getDisplayImage(detailEvent?.avatar)} layout='responsive' width={119} height={119} objectFit="cover" />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h2
                  className="detail-event-header-title"
                  style={{ marginBottom: "8px", color: 'var(--primary-color-main)' }}
                >
                  {detailEvent?.title ?? "Không có tiêu đề"}
                </h2>
                <div
                  className="detail-event-header-date"
                  style={{ fontWeight: 600 }}
                >
                  {`Thời gian: ${moment(detailEvent?.fromDate).format(
                    "DD/MM/YYYY"
                  )} đến ${moment(detailEvent?.toDate).format("DD/MM/YYYY")}`}
                </div>
              </div>
            </div>
            <div className="detail-event-page-view-info" >
              <span className="detail-event-page-view-info-title">Ban Tổ Chức: </span>
              {detailEvent?.hostBy ? (
                <div
                  className="detail-event-page-view-body"
                  dangerouslySetInnerHTML={{ __html: detailEvent?.hostBy }}
                ></div>
              ) : (
                <div className="detail-event-page-view-body">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
            <div className="detail-event-page-view-info detail-event-page-view-info-criteria">
              <span className="detail-event-page-view-info-title">Tiêu chí: </span>
              {detailEvent?.criteria ? (
                <div
                  className="detail-event-page-view-body"
                  dangerouslySetInnerHTML={{ __html: detailEvent?.criteria }}
                ></div>
              ) : (
                <div className="detail-event-page-view-body">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
            <div>
              <span className="detail-event-page-view-info-title">Nội dung chi tiết:</span>
              {detailEvent?.content ? (
                <div
                  className="detail-event-page-view-body"
                  dangerouslySetInnerHTML={{ __html: detailEvent?.content }}
                ></div>
              ) : (
                <div className="detail-event-page-view-body">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
            {!(detailEvent.toDate < moment().valueOf()) && detailEvent.registerFromDate <= moment().valueOf() && detailEvent.registerToDate >= moment().valueOf()
              && registerStatus !== STATUS_NO_REGISTER &&
              <div className="event-actions">
                {
                  loadingJoinEvent
                    ? <CircularProgress color="inherit" />
                    : <>
                      {isJoinEvent === StatusJoinEvent.FAILED
                        && <button
                          style={{ backgroundColor: 'var(--primary-color-main)' }}
                          onClick={handleJoinStatusEvent}
                        >
                          Tham gia ngay
                        </button>
                      }
                      {
                        isJoinEvent === StatusJoinEvent.PENDING
                        && <button style={{ backgroundColor: '#007FFF', userSelect: 'none' }} >
                          Chờ xác nhận ...
                        </button>
                      }
                      {
                        isJoinEvent === StatusJoinEvent.SUCCESS
                        && <button style={{ backgroundColor: '#2e7d32', userSelect: 'none' }} >
                          Đã tham gia
                        </button>
                      }
                    </>
                }
              </div>
            }
          </div>
        ) : (
          <h3>Không có dữ liệu</h3>
        )}
        {
          <ModalJoin
            open={isOpenModalJoinEvent}
            title={`Tham gia sự kiện ${detailEvent?.title}`}
            handleChange={handleChange}
            handleCancel={handleCancelJoinClub}
            handleSubmit={handleSubmit}
          />
        }
      </Container>
    </div>
  );
}

export default DetailEventsPageView;
