import { Container, Grid, Button, CircularProgress } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import EditClubIcon from "./EditClubIcon";
import MembersClubIcon from "./MemberClubsIcon";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './style.scss'
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import Club from "../../../models/clubsModel";
import { useEffect, useState, useRef, useMemo } from "react";
import { apiGetClubBySlug } from "../../../utils/api/clubsApi";
import { JOIN_STATUS_ACCEPTED, JOIN_STATUS_WAITING, STATUS_NO_REGISTER, TYPE_CLUB, STATUS_REGISTER, STATUS_REGISTER_JOIN, HIDE_MEMBER, SHOW_MEMBER } from "../../../utils/constraint";
import { useSnackbar } from "notistack";
import BreadCrumb from "../../breadcrumb/BreadCrumb";
import { setShowLoginPopup } from "../../../features/auth/auth.slice";
import { loadCLubMember } from "../../../app/redux/reducers/clubMemberSlice";
import { useForm } from 'antd/lib/form/Form';
import { resetIsNotification, setStatus, updateClub } from "../../../app/redux/reducers/clubSlice";
import ModalJoin from "../../../features/common/ModalJoin";
import { notification } from "antd";
import { useDispatch, useSelector } from "../../../app/hooks";
import { apiGetMemberClubs, apijoinClub } from "../../../utils/api/clubMembersApi";

enum StatusJoinClub {
    FAILED = -1,
    PENDING = 0,
    SUCCESS = 1
}

function DetailClubPageView({ clubDetail, memberClubs, slugs }: { clubDetail: Club, memberClubs?: any, slugs: string[] }) {
    const [categoryForm] = useForm();
    const { enqueueSnackbar } = useSnackbar()
    const { student } = useSelector((state) => state.authState);
    const [dataPresident, setDataPresident] = useState<any>()
    const [dataMembers, setDataMembers] = useState<any>([])
    const dispatch = useDispatch()
    const [paths, setPaths] = useState([
        { label: 'Tổ chức', slug: 'to-chuc/tat-ca-to-chuc' }
    ])

    const [isJoinedClub, setIsJoinedClub] = useState<number>(StatusJoinClub.FAILED)
    const [isOpenModalMember, setIsOpenModalMember] = useState<boolean>(false);
    const [valueEdit, setValueEdit] = useState<Club>();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOpenModalUpdateClub, setIsOpenModalUpdateClub] = useState<boolean>(false);
    const [isOpenModalJoinClub, setIsOpenModalJoinClub] = useState(false)
    const [noteJoinClub, setNoteJoinClub] = useState('')
    const [dataUpload, setDataupload] = useState<string>()
    const [presidentId, setPresidentId] = useState<string>('')
    const [isShowMember, setIsShowMember] = useState<number>(HIDE_MEMBER);
    const [loadingJoinClub, setLoadingJoinClub] = useState(false)
    const descRef = useRef<any>();
    const clubsReducer = useSelector(state => state.clubsReducer);
    const clubCategorysReducer = useSelector((state) => state.categoryClubsReducer);
    const notificationClubs = clubsReducer.notifications;
    const notificationCategory = clubCategorysReducer.notifications;
    const membersClubWaitting = memberClubs?.filter(item => item?.status === 0)?.length

    useEffect(() => {
        if (slugs.length > 1) {
            setPaths(prev => {
                return [
                    ...prev,
                    { label: clubDetail?.name ?? "", slug: `to-chuc/${slugs?.[0]}/${clubDetail?.slug}` }
                ]
            })
        }
    }, [clubDetail, slugs])

    useEffect(() => {
        if (memberClubs?.length) {
            setDataPresident(memberClubs?.find(item => item?.role === 1)?.student)
            setDataMembers(memberClubs)
        }
    }, [memberClubs, slugs])

    useEffect(() => {
        if (student?._id) {
            if (memberClubs?.length > 0) {
                if (!memberClubs?.find(item => (item?.userId == student?._id))) {
                    setIsJoinedClub(StatusJoinClub.FAILED)
                } else if (memberClubs?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_WAITING))) {
                    setIsJoinedClub(StatusJoinClub.PENDING)
                } else if (memberClubs?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_ACCEPTED))) {
                    setIsJoinedClub(StatusJoinClub.SUCCESS)
                }
            }
        }
    }, [memberClubs, student, slugs])

    useEffect(() => {
        if (notificationCategory.message) {
            if (notificationCategory.isError) {
                // notification.error({
                //     message: notificationCategory.message,
                //     duration: 1.5
                // })
                enqueueSnackbar(notificationCategory.message, { variant: "error", autoHideDuration: 2000 })
            }
        }
        if (notificationClubs.message) {
            if (notificationClubs.isError) {
                // notification.error({
                //     message: notificationClubs.message,
                //     duration: 1.5
                // })
                enqueueSnackbar(notificationClubs.message, { variant: "error", autoHideDuration: 2000 })
            } else {
                // notification.success({
                //     message: notificationClubs.message,
                //     duration: 1.5
                // })
                enqueueSnackbar(notificationClubs.message, { variant: "success", autoHideDuration: 2000 })
            }
            dispatch(resetIsNotification())
        }
    }, [notificationClubs])

    useEffect(() => {
        if (loadingJoinClub) {
            setTimeout(() => {
                setLoadingJoinClub(false)
            }, 1000)
        }
    }, [student, slugs, isJoinedClub])

    const onJoinClub = async () => {
        if (student?._id) {
            const joinClubRes = await apijoinClub({
                reqQuery: {
                    studentId: student?._id,
                    clubId: clubDetail?._id,
                    note: noteJoinClub ?? ''
                }
            })

            if (joinClubRes?.data?._id) {
                const detailClubRes = await apiGetClubBySlug({
                    reqQuery: {
                        slug: slugs?.[slugs?.length - 1]
                    }
                })

                const dataMemberClubsRes = await apiGetMemberClubs({
                    reqQuery: {
                        slug: slugs?.[slugs?.length - 1] ?? '',
                        limit: 100,
                        offset: 0,
                        clubId: detailClubRes?.data?._id ?? ''
                    }
                })

                setDataPresident(dataMemberClubsRes?.data?.find(item => item?.role === 1)?.student)
                setDataMembers(dataMemberClubsRes?.data)
                if (dataMemberClubsRes.data.length > 0) {
                    if (clubDetail?.settingStatus === STATUS_REGISTER) {
                        if (dataMemberClubsRes.data?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_WAITING))) {
                            // setIsJoinedClub(StatusJoinClub.SUCCESS)
                            // const msg = "Bạn đã tham gia thành công!"
                            setIsJoinedClub(StatusJoinClub.PENDING)
                            const msg = "Bạn đã gửi yêu cầu tham gia, vui lòng chờ quản trị viên phê duyệt!"
                            enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2000 })
                        }
                    } else if (clubDetail?.settingStatus === STATUS_REGISTER_JOIN) {
                        if (dataMemberClubsRes.data?.find(item => (item?.userId == student?._id) && (item?.status === JOIN_STATUS_WAITING))) {
                            setIsJoinedClub(StatusJoinClub.PENDING)
                            const msg = "Bạn đã gửi yêu cầu tham gia, vui lòng chờ quản trị viên phê duyệt!"
                            enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2000 })
                        }
                    }
                }
            }

        }
    }

    const handleJoinStatusClub = () => {
        if (student?._id) {
            if (clubDetail?.settingStatus === STATUS_REGISTER) {
                setLoadingJoinClub(true)
                setIsOpenModalJoinClub(false)
                onJoinClub()
            } else if (clubDetail?.settingStatus === STATUS_REGISTER_JOIN) {
                setIsOpenModalJoinClub(true)
            }
        } else {
            dispatch(setShowLoginPopup(true))
        }
    }

    const handleSubmit = () => {
        if (!!noteJoinClub.trim()) {
            setLoadingJoinClub(true)
            setIsOpenModalJoinClub(false)
            onJoinClub()
        } else {
            const msg = "Vui lòng nhập thông tin cá nhân!"
            enqueueSnackbar(msg, { variant: "warning", autoHideDuration: 2000 })
        }
    }

    const handleChange = (value) => {
        setNoteJoinClub(value)
    }

    const handleCancelJoinClub = () => {
        setIsOpenModalJoinClub(false)
    }

    const handleOk = () => {
        categoryForm.validateFields()
            .then(value => {
                const avatar = dataUpload ?? ""

                if (isEdit) {
                    if (valueEdit?._id) {
                        // update
                        dispatch(updateClub({
                            ...value,
                            id: valueEdit?._id,
                            memNum: valueEdit?.memNum,
                            type: TYPE_CLUB,
                            avatar,
                            des: descRef?.current?.getContent(),
                            presidentId,
                            showMem: isShowMember
                        }))
                    } else {
                        // không có id 
                        notification.error({
                            message: 'Không thể cập nhật CLB này',
                            duration: 1.5
                        })
                    }
                }
                setStatus(-1)
                // reset
                handleCancelUpdateClub();

                setTimeout(() => {
                    window.location.replace('/to-chuc/tat-ca-to-chuc')
                }, 1000)
            })
    }

    const handleCancelUpdateClub = () => {
        setPresidentId('')
        setIsOpenModalUpdateClub(false)
        categoryForm.resetFields();
        setValueEdit(undefined);
    }

    const isAdmin = student?.fullName?.toLowerCase() === "admin"

    const renderActions = useMemo(() => {
        if (isAdmin) {
            return <div className="detail-network-club-header-actions">
                <Button
                    startIcon={<div>{<MembersClubIcon />}</div>}
                    color="inherit"
                    onClick={() => {
                        setIsOpenModalMember(true);
                        dispatch(loadCLubMember({
                            limit: 100,
                            offset: 0,
                            clubId: clubDetail?._id || 0
                        }))
                    }}
                >
                    Thành viên
                    {membersClubWaitting ? ' chờ duyệt:' : ''}
                    {<span className="text-members-waitting">&nbsp;{membersClubWaitting ? `${membersClubWaitting}` : ''}</span>}
                </Button>
                <Button
                    startIcon={<EditClubIcon />}
                    color="inherit"
                    endIcon={<KeyboardArrowRightIcon />}
                    onClick={() => {
                        setValueEdit(clubDetail);
                        setIsOpenModalUpdateClub(true)
                        setIsEdit(true)
                        categoryForm.resetFields();
                        dispatch(loadCLubMember({
                            limit: 100,
                            offset: 0,
                            clubId: clubDetail?._id || 0
                        }))
                    }}
                >
                    Chỉnh sửa thông tin
                </Button>
            </div>
        } else if (student?._id && !isAdmin) {
            return <div className="detail-network-club-header-actions">
                {(dataMembers?.find(member => member?.userId == student?._id && dataPresident?.studentId !== student?.userId && member?.status === JOIN_STATUS_ACCEPTED) && clubDetail.showMem === SHOW_MEMBER) &&
                    <Button
                        startIcon={<MembersClubIcon />}
                        color="inherit"
                        onClick={() => {
                            setIsOpenModalMember(true);
                            dispatch(loadCLubMember({
                                limit: 100,
                                offset: 0,
                                clubId: clubDetail?._id || 0
                            }))
                        }}
                    >
                        Thành viên
                    </Button>
                }

                {(dataPresident?.studentId === student?.userId) &&
                    <>
                        <Button
                            startIcon={<div>{<MembersClubIcon />}</div>}
                            color="inherit"
                            onClick={() => {
                                setIsOpenModalMember(true);
                                dispatch(loadCLubMember({
                                    limit: 100,
                                    offset: 0,
                                    clubId: clubDetail?._id || 0
                                }))
                            }}
                        >
                            Thành viên
                            {membersClubWaitting ? ' chờ duyệt:' : ''}
                            {<span className="text-members-waitting">&nbsp;{membersClubWaitting ? `${membersClubWaitting}` : ''}</span>}
                        </Button>
                        <Button
                            startIcon={<EditClubIcon />}
                            color="inherit"
                            endIcon={<KeyboardArrowRightIcon />}
                            onClick={() => {
                                setValueEdit(clubDetail);
                                setIsOpenModalUpdateClub(true)
                                setIsEdit(true)
                                categoryForm.resetFields();
                                dispatch(loadCLubMember({
                                    limit: 100,
                                    offset: 0,
                                    clubId: clubDetail?._id || 0
                                }))
                            }}
                        >
                            Chỉnh sửa thông tin
                        </Button>
                    </>
                }
            </div>
        }
    }, [student])

    return (
        <Container maxWidth={customMaxWidthContainer()}>
            {clubDetail &&
                <div id="detail-network-club">
                    <BreadCrumb path={paths} />
                    {/* <button className="detail-network-club-button" onClick={onClickBack}>Trờ về</button> */}
                    <div className="detail-network-club-header">
                        <div>
                            <h1 className="detail-network-club-title title-h1">
                                {`Tổ chức: ${clubDetail?.name}`}
                            </h1>
                            <div className="detail-network-club-desc">
                                {`Ngày thành lập: ${clubDetail?.createDate ? moment(Number(clubDetail?.createDate)).format('DD/MM/YYYY') : 'Chưa có'}`}
                            </div>
                        </div>
                        {renderActions}
                    </div>
                    <div className="detail-network-club-body">
                        <div className="detail-network-club-headquaters">
                            <Grid container spacing={4}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <div className={`detail-network-club-headquater-member${clubDetail.settingStatus === STATUS_NO_REGISTER ? ' no-register' : ''}`} data-aos="fade-right">
                                        <div className="headquater-member-image">
                                            <Image objectFit="cover" src={dataPresident?.avatarUrl ? dataPresident?.avatarUrl : '/images/huy-hieu-hoi.png'} layout='responsive' width={119} height={119} />
                                        </div>
                                        <div className="headquater-member-text name dot-2">
                                            {`Chủ tịch: ${dataPresident?.fullName ?? 'Chưa có'}`}
                                        </div>
                                        <div className="headquater-member-text number">
                                            {`Sđt: ${dataPresident?.phoneNumber ?? 'Chưa có'}`}
                                        </div>
                                        <div className="headquater-member-text email">
                                            {`Email: ${dataPresident?.email ?? 'Chưa có'}`}
                                        </div>
                                        {/* {clubDetail?.settingStatus !== STATUS_NO_REGISTER &&
                                            <div className="headquater-member-actions">
                                                <button style={{ backgroundColor: 'var(--secondaryColor)' }}>
                                                    Connect to Linked-in
                                                </button>
                                            </div>
                                        } */}
                                    </div>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <div className="detail-network-club-headquater-member" data-aos="fade-left">
                                        <div className="headquater-member-image">
                                            <Image src={clubDetail?.avatar?.includes('http') ? clubDetail?.avatar : "/images/huy-hieu-hoi.png"} layout='responsive' width={119} height={119} objectFit="cover" />
                                        </div>
                                        <div className="headquater-member-text name">
                                            {clubDetail?.settingStatus === STATUS_NO_REGISTER ? `${clubDetail?.name}` : `Đăng ký tham gia ${clubDetail?.name}`}
                                        </div>
                                        <div className="headquater-member-text number">
                                            {`Thành viên: ${clubDetail?.memNum}`}
                                        </div>
                                        <div className="headquater-member-text birth-day">
                                            {`Ngày thành lập: ${clubDetail?.createDate ? moment(Number(clubDetail?.createDate)).format('DD/MM/YYYY') : 'Chưa có'}`}
                                        </div>
                                        {!isAdmin && clubDetail?.settingStatus !== STATUS_NO_REGISTER &&
                                            <div className="headquater-member-actions">
                                                {loadingJoinClub
                                                    ? <CircularProgress color="inherit" />
                                                    : <>
                                                        {isJoinedClub === StatusJoinClub.FAILED
                                                            && <button
                                                                style={{ backgroundColor: 'var(--primary-color-main)' }}
                                                                onClick={handleJoinStatusClub}
                                                            >
                                                                Tham gia ngay
                                                            </button>
                                                        }
                                                        {
                                                            isJoinedClub === StatusJoinClub.PENDING
                                                            && <button style={{ backgroundColor: '#007FFF', userSelect: 'none' }} >
                                                                Chờ xác nhận ...
                                                            </button>
                                                        }
                                                        {
                                                            isJoinedClub === StatusJoinClub.SUCCESS
                                                            && <button style={{ backgroundColor: '#2e7d32', userSelect: 'none' }} >
                                                                Đã tham gia
                                                            </button>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="detail-network-club-content">
                            <div dangerouslySetInnerHTML={{ __html: clubDetail.des ?? '' }} />
                        </div>
                    </div>
                </div>
            }
            {<ModalJoin
                open={isOpenModalJoinClub}
                title={`Tham gia ${clubDetail?.name}`}
                handleChange={handleChange}
                handleCancel={handleCancelJoinClub}
                handleSubmit={handleSubmit}
            />}
        </Container >
    );
}

export default DetailClubPageView;