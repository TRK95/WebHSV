import { Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import BreadCrumb from "../../breadcrumb/BreadCrumb";
import { useDispatch, useSelector } from "../../../app/hooks";
import {
  JOIN_STATUS_ACCEPTED,
  JOIN_STATUS_WAITING,
  RESPONSE_SUCCESS,
  STATUS_NO_REGISTER,
  STATUS_REGISTER,
  STATUS_REGISTER_JOIN,
} from "../../../utils/constraint";
import ModalJoin from "../../../features/common/ModalJoin";
import { setShowLoginPopup } from "../../../features/auth/auth.slice";
import "./style.scss";
import { useSnackbar } from "notistack";
import Club from "../../../models/clubsModel";
import ClubFeatureDetail from "../../../models/ClubFeatureDetail";
import ClubFeatureChild from "../../../models/ClubFeatureChild";
import { apiGetMemberFeatureDetail, apiJoinClubFeature } from "../../../utils/api/clubFeatureApi";

enum StatusJoinEvent {
  FAILED = -1,
  PENDING = 0,
  SUCCESS = 1,
}

function EventFeaturePageView(
  { featureDetail, club, membersEvent }:
    { featureDetail: ClubFeatureDetail, club: Club, featureSlug?: string, featureId?: string, featureCategories: Array<ClubFeatureChild>, membersEvent: any }) {
  const dispatch = useDispatch();
  const { student } = useSelector((state) => state.authState);
  const [registerStatus, setRegisterStatus] = useState(STATUS_NO_REGISTER);
  const [isOpenModalJoinEvent, setIsOpenModalJoinEvent] = useState(false);
  const [noteJoinEvent, setNoteJoinEvent] = useState('');
  const [isJoinEvent, setIsJoinEvent] = useState<number>(StatusJoinEvent.FAILED)
  const [paths, setPaths] = useState([{ label: "Sự kiện", slug: "su-kien/tat-ca-su-kien" }])
  const [loadingJoinEvent, setLoadingJoinEvent] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (featureDetail.settingStatus === STATUS_NO_REGISTER) {
      setRegisterStatus(STATUS_NO_REGISTER);
    } else if (featureDetail.settingStatus === STATUS_REGISTER) {
      if (
        featureDetail.registerFromDate === 0 &&
        featureDetail.registerToDate === 0
      ) {
        setRegisterStatus(STATUS_REGISTER);
      } else if (featureDetail.registerToDate < moment().valueOf()) {
        setRegisterStatus(STATUS_NO_REGISTER);
      } else {
        setRegisterStatus(STATUS_REGISTER);
      }
    } else {
      if (
        featureDetail.registerFromDate === 0 &&
        featureDetail.registerToDate === 0
      ) {
        setRegisterStatus(STATUS_REGISTER_JOIN);
      } else if (featureDetail.registerToDate < moment().valueOf()) {
        setRegisterStatus(STATUS_NO_REGISTER);
      } else {
        setRegisterStatus(STATUS_REGISTER_JOIN);
      }
    }
  }, [featureDetail]);

  useEffect(() => {
    if (student?._id) {
      if (membersEvent?.length > 0) {
        if (!membersEvent?.find(item => (item?.userId == student?._id))) {
          setIsJoinEvent(StatusJoinEvent.FAILED)
        } else if (membersEvent?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_WAITING))) {
          setIsJoinEvent(StatusJoinEvent.PENDING)
        } else if (membersEvent?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_ACCEPTED))) {
          setIsJoinEvent(StatusJoinEvent.SUCCESS)
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
  }, [student, isJoinEvent])

  const onJoinEvent = async () => {
    if (student?._id) {
      const joinEventRes = await apiJoinClubFeature({
        featureDetailId: featureDetail?._id,
        note: noteJoinEvent ?? '',
        status: featureDetail?.settingStatus === STATUS_REGISTER ? 1 : 0
      }, { user: student })

      if (joinEventRes?.status === RESPONSE_SUCCESS) {
        const dataMemberEventRes = await apiGetMemberFeatureDetail({
          limit: 100,
          offset: 0,
          featureDetailId: featureDetail?._id ?? ''
        })

        if (dataMemberEventRes.data.length > 0) {
          if (featureDetail?.settingStatus === STATUS_REGISTER) {
            if (dataMemberEventRes.data?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_ACCEPTED))) {
              setIsJoinEvent(StatusJoinEvent.SUCCESS)
              const msg = "Bạn đã tham gia thành công!"
              enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2000 })
            }
          } else if (featureDetail?.settingStatus === STATUS_REGISTER_JOIN) {
            if (dataMemberEventRes.data?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_WAITING))) {
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
      if (featureDetail?.settingStatus === STATUS_REGISTER) {
        setLoadingJoinEvent(true)
        setIsOpenModalJoinEvent(false)
        onJoinEvent()
      } else if (featureDetail?.settingStatus === STATUS_REGISTER_JOIN) {
        setIsOpenModalJoinEvent(true)
      }
    } else {
      dispatch(setShowLoginPopup(true))
    }
  }

  return (
    <div
      id="detail-event-page-view"
      style={{ padding: "20px 0", color: "var(--textColor)" }}
    >
      <Container maxWidth={customMaxWidthContainer()}>
        <BreadCrumb path={paths} />
        {featureDetail ? (
          <div className="detail-event-page-view-content">
            <div className="detail-event-page-view-header">
              <div className="detail-event-page-view-header-image">
                <Image src={featureDetail?.avatar?.includes('http') ? featureDetail?.avatar : "/images/huy-hieu-hoi.png"} layout='responsive' width={119} height={119} objectFit="cover" />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h2
                  className="detail-event-header-title"
                  style={{ marginBottom: "8px", color: 'var(--primary-color-main)' }}
                >
                  {featureDetail?.title ?? "Không có tiêu đề"}
                </h2>
                <div
                  className="detail-event-header-date"
                  style={{ fontWeight: 600 }}
                >
                  {`Thời gian: ${moment(featureDetail?.fromDate).format(
                    "DD/MM/YYYY"
                  )} đến ${moment(featureDetail?.toDate).format("DD/MM/YYYY")}`}
                </div>
              </div>
            </div>
            <div className="detail-event-page-view-info" >
              <span className="detail-event-page-view-info-title">Ban Tổ Chức: </span>
              {club?.name ? (
                <div
                  className="detail-event-page-view-body"
                  dangerouslySetInnerHTML={{ __html: club?.name }}
                ></div>
              ) : (
                <div className="detail-event-page-view-body">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
            <div className="detail-event-page-view-info">
              <span className="detail-event-page-view-info-title">Tiêu chí: </span>
              {featureDetail?.criteria ? (
                <div
                  className="detail-event-page-view-body"
                  dangerouslySetInnerHTML={{ __html: featureDetail?.criteria }}
                ></div>
              ) : (
                <div className="detail-event-page-view-body">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
            <div>
              <span className="detail-event-page-view-info-title">Nội dung chi tiết:</span>
              {featureDetail?.content ? (
                <div
                  className="detail-event-page-view-body"
                  dangerouslySetInnerHTML={{ __html: featureDetail?.content }}
                ></div>
              ) : (
                <div className="detail-event-page-view-body">
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
            {!(featureDetail.toDate < moment().valueOf()) && featureDetail.registerFromDate <= moment().valueOf() && featureDetail.registerToDate >= moment().valueOf()
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
            title={`Tham gia sự kiện ${featureDetail?.title}`}
            handleChange={handleChange}
            handleCancel={handleCancelJoinClub}
            handleSubmit={handleSubmit}
          />
        }
      </Container>
    </div>
  );
}

export default EventFeaturePageView;
