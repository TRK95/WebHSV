import { KeyboardArrowRight } from "@mui/icons-material";
import { Button, Container, Grid } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "../../app/hooks";
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
import ClubsParticipant from "../club/clubs-participant";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { EventComponent } from "../events/event-component";
import './style.scss';
import EventModel from "../../models/eventModel";
import ChangeAvatar from "../common/ChangeAvatar";
import { setCheckUpdateCode, setShowChangePassWord, updateUser } from '../../features/auth/auth.slice';
import { useRouter } from "next/router";
import Club from "../../models/clubsModel";
import { useSnackbar } from "notistack";

type AuthFormUpdateInfor = {
  name: string,
  birth: string | null,
  phoneNumber: string,
  email: string,
  school: string,
  studentClassName?: string,
  studentId?: string,
  year?: number,
  avatarUrl?: string,
}

function ProfilePageView({
  myClubsData,
  myEventsData
}: {
  myClubsData: Array<Club>,
  myEventsData: Array<EventModel>
}) {
  const dispatch = useDispatch();
  const { query } = useRouter()
  const { enqueueSnackbar } = useSnackbar();

  const [editState, setEditState] = useState(false)
  const { student, updateCode } = useSelector(state => state.authState)
  const [uploadData, setUploadData] = useState(student?.avatarUrl)
  const defaultValue = useMemo(() => {
    return {
      name: student?.fullName,
      email: student?.email,
      birth: moment(student?.birthdate).format('DD/MM/YYYY'),
      phoneNumber: student?.phoneNumber,
      studentClassName: student?.className,
      studentId: student?.userId,
      year: student?.year,
      avatarUrl: student?.avatarUrl
    }
  }, [student])

  const { setValue } = useForm<AuthFormUpdateInfor>({
    defaultValues: defaultValue,
  });

  useEffect(() => {
    if (uploadData === student?.avatarUrl)
      setEditState(false)
    else
      setEditState(true)
  }, [uploadData, student])

  useEffect(() => {
    if (!!student?._id)
      (async function () {
        setValue("email", student?.email)
        setValue("name", student?.fullName)
        setValue("phoneNumber", student?.phoneNumber)
        setValue("birth", student?.birthdate ? `${moment(student?.birthdate).format('DD/MM/YYYY')}` : null)
        setValue('studentClassName', student?.className)
        setValue('studentId', student?.userId)
        setValue('year', student?.year)
        setValue('avatarUrl', student?.avatarUrl ? student?.avatarUrl : '/images/user-avatar.svg')
      })()
  }, [student?._id])

  const handleChangeAvt = async () => {
    dispatch(updateUser({
      _id: student?._id,
      userId: student?.userId,
      status: student?.status,
      fullName: student?.fullName,
      birthdate: student?.birthdate,
      className: student?.className,
      schoolName: student?.schoolName,
      year: student?.year,
      phoneNumber: student?.phoneNumber,
      email: student?.email,
      studentYear: student?.studentYear,
      avatarUrl: uploadData,
      homeProvince: student?.homeProvince,
      password: student?.password
    }))
  }

  useEffect(() => {
    if (updateCode === 1) {
      enqueueSnackbar("Thay đổi avatar thành công!", { variant: "success", autoHideDuration: 2000, onClose: () => dispatch(setCheckUpdateCode(null)) })
      setUploadData(student?.avatarUrl)
      setEditState(false)
    }
  }, [updateCode])

  return (<>
    <div className="xxxx" style={{ width: "100%", paddingTop: "27.5%", position: "relative" }}>
      <Image
        src="/images/profile-banner.png"
        className="profile-banner-image"
        layout="fill"
        objectFit="fill"
        objectPosition="center center"
        // objectPosition={`center ${isLgDesktopUI ? '55px' : '78px'}`}
        quality={80}
      />
    </div>
    <Container maxWidth={customMaxWidthContainer()}>
      <div id="profile-page">
        <div className="profile-page-infor">
          <div className="profile-page-infor-header">
            <Grid container spacing={{ xs: 4 }}>
              <Grid item xs={12} md={4}>
                <div className="profile-page-infor-header-avatar">
                  <div className="profile-page-infor-header-avatar-box">
                    <div className="profile-image-container">
                      <Image
                        className="profile-image"
                        src={uploadData?.includes('http') ? uploadData : "/images/user-avatar.svg"}
                        width={170}
                        height={170}
                      />
                      <div className="overlay">
                        <span>
                          <p>Thay đổi avatar</p>
                          <ChangeAvatar
                            defaultUrl={student?.avatarUrl}
                            onChangeUrl={(value) => {
                              setUploadData(value)
                              // setEditState(true)
                            }}
                          />
                        </span>

                      </div>
                    </div>
                  </div>
                </div>
                {
                  editState && <div className="profile-page-infor-header-first-actions">
                    <Button startIcon={<CameraAltIcon />} endIcon={<KeyboardArrowRight />} onClick={handleChangeAvt}>
                      Xác nhận thay đổi
                    </Button>
                  </div>
                }

              </Grid>
              <Grid item md={8}>
                <div className="profile-page-infor-header-actions-edit">
                  <div className="profile-page-infor-header-title">
                    Thông tin cá nhân
                  </div>
                  <div className="profile-page-infor-header-actions">
                    <button onClick={() => { dispatch(setShowChangePassWord(true)) }}>
                      Thay đổi mật khẩu
                    </button>
                  </div>
                </div>

                <div className="profile-page-infor-header-body">
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={6} xs={12}>
                      <div className="profile-page-form-item">
                        <div className="input-item">
                          <Image width={16} height={16} src="/images/icon/user-profile-icon.svg" alt="username" />
                          <div className="input-item-text">{query?.fullName ?? student?.fullName}</div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <div className="profile-page-form-item">
                        <div className="input-item">
                          <Image width={16} height={16} src="/images/icon/email-icon.svg" alt="email" />
                          <div className="input-item-text">{student?.email}</div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <div className="profile-page-form-item">
                        <div className="input-item">
                          <Image width={16} height={16} src="/images/icon/birth-icon.svg" alt="birth" />
                          <div className="input-item-text">{moment((query?.birthdate || undefined) ?? student?.birthdate).format('DD/MM/YYYY')}</div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <div className="profile-page-form-item">
                        <div className="input-item">
                          <Image width={16} height={16} src="/images/icon/phone-icon.svg" alt="phone" />
                          <div className="input-item-text">{query?.phoneNumber ?? student?.phoneNumber}</div>
                        </div>
                      </div>
                    </Grid>
                    {!query?.className && !query?.homeProvince && !query?.userId && !query?.year && <>
                      <Grid item md={6} sm={6} xs={12}>
                        <div className="profile-page-form-item">
                          <div className="input-item">
                            <Image width={16} height={16} src="/images/icon/triangle-icon.svg" alt="triangle" />
                            <div className="input-item-text">Lớp:&ensp; <span style={{ fontWeight: '300' }}>{student?.className ?? 'Chưa có'}</span></div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <div className="profile-page-form-item">
                          <div className="input-item">
                            <Image width={16} height={16} src="/images/icon/triangle-icon.svg" alt="triangle" />
                            <div className="input-item-text">Quê quán:&ensp; <span style={{ fontWeight: '300' }}>{student?.homeProvince ?? ''}</span></div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <div className="profile-page-form-item">
                          <div className="input-item">
                            <Image width={16} height={16} src="/images/icon/triangle-icon.svg" alt="triangle" />
                            <div className="input-item-text">Mã số sinh viên:&ensp; <span style={{ fontWeight: '300' }}>{student?.userId}</span></div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <div className="profile-page-form-item">
                          <div className="input-item">
                            <Image width={16} height={16} src="/images/icon/triangle-icon.svg" alt="triangle" />
                            <div className="input-item-text">Khóa:&ensp; <span style={{ fontWeight: '300' }}>K{student?.studentYear}</span></div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <div className="profile-page-form-item">
                          <div className="input-item">
                            <Image width={16} height={16} src="/images/icon/school-icon.svg" alt="username" />
                            <div className="input-item-text">{student?.schoolName}</div>
                          </div>
                        </div>
                      </Grid>
                    </>}
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        </div >
      </div >
      <ClubsParticipant myClubsData={myClubsData} title="Tổ chức đã tham gia" />
    </Container >
    <div style={{ paddingBottom: '80px' }}>
      <EventComponent title="Sự kiện đã tham gia" eventsData={myEventsData} isProfile />
    </div>
  </>);
}

export default ProfilePageView;