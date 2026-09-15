import { Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "../../../app/hooks";
import Club from "../../../models/clubsModel";
import './style.scss'
import { getDisplayImage } from "../../../utils/image";

function ClubsParticipant({ title, myClubsData }: { title?: string, myClubsData: Array<Club> }) {
    const router = useRouter()
    const student = useSelector(state => state.authState.student)
    return (
        <div id="clubs-participant" data-aos="fade-right">
            <div className="clubs-participant-header">
                <div className="clubs-participant-header-title title-h1">
                    <div className="title-h1-icon">
                        <Image src='/images/icon-head-subject.svg' layout='responsive' width={20} height={20} />
                    </div>
                    {title}
                </div>
            </div>
            {myClubsData?.length > 0
                ? <div className="clubs-participant-body">
                    <Grid container spacing={2}>
                        {myClubsData?.map(item => (
                            <Grid item md={3} sm={6} xs={6} key={item?.name}>
                                <div className="clubs-participant-body-item">
                                    <div className="clubs-participant-body-item-image">
                                        <Image src={getDisplayImage(item?.avatar, '/images/e-hust-clubs.jpg')} layout="responsive" width={280} height={146} />
                                    </div>
                                    <div className="clubs-participant-body-item-content">
                                        <div className="clubs-participant-item title small-size-text">
                                            {item?.name}
                                        </div>
                                        <div className="clubs-participant-item members small-size-text">
                                            {`Thành viên: ${item?.memNum ?? 0}`}
                                        </div>
                                        <div className="clubs-participant-item headquater small-size-text" style={{ color: student._id === item?.presidentId && 'var(--secondaryColor)', fontWeight: 600 }}>
                                            {`Chủ tịch: ${student?.fullName ?? ''}`}
                                        </div>
                                        <Link href={`/to-chuc/${item?.categoryName}/${item?.slug}`}>
                                            <div className="clubs-participant-item actions small-size-text">
                                                <button>Xem chi tiết</button>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
                : <h3>
                    Không có tổ chức
                </h3>
            }
        </div>
    );
}

export default ClubsParticipant;
