import ProfilePageView from "../../components/profile-page-view";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from 'react'
import { apiGetMyClubs } from "../../utils/api/clubsApi";
import { DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS, STATUS_PUBLIC } from "../../utils/constraint";
import { useSelector } from "../../app/hooks";
import { apiGetMyEvents } from "../../utils/api/eventsApi";

function ProfilePage() {
    const student = useSelector(state => state.authState.student)
    const [myClubsData, setMyClubsData] = useState([])
    const [myEventsData, setMyEventsData] = useState([])

    usePageAuth()
    useEffect(() => {
        (async () => {
            if (student?.userId) {
                const myClubsRes = await apiGetMyClubs({
                    reqQuery: {
                        userId: student?._id
                    }
                })

                if (myClubsRes.status === RESPONSE_SUCCESS) {
                    setMyClubsData(myClubsRes.data)
                }
            }
        })()
    }, [student])

    useEffect(() => {
        (async () => {
            if (student?.userId) {
                const myEventsDataRes = await apiGetMyEvents({
                    reqQuery: {
                        userId: student?._id,
                        // eventId: ''
                        // status: STATUS_PUBLIC
                    }
                })

                if (myEventsDataRes.status === RESPONSE_SUCCESS) {
                    setMyEventsData(myEventsDataRes.data?.filter(item => item.status === STATUS_PUBLIC))
                }
            }
        })()
    }, [student])

    useEffect(() => {
        Aos.init({ duration: 1000 })
    })

    return (
        <Layout>
            <ProfilePageView myClubsData={myClubsData} myEventsData={myEventsData} />
        </Layout>
    )
}

export default ProfilePage;
