import { Container } from "@mui/material";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useSelector } from "../../app/hooks";
import ClubsParticipant from "../../components/club/clubs-participant";
import Layout from "../../features/common/Layout";
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
import usePageAuth from "../../hooks/usePageAuth";
import Club from "../../models/clubsModel";
import { apiGetMyClubs } from "../../utils/api/clubsApi";
import { RESPONSE_SUCCESS } from "../../utils/constraint";

function MyClubsPage() {
  const student = useSelector((state) => state.authState.student);
  const [myClubsData, setMyClubsData] = useState<Array<Club>>([]);

  usePageAuth();

  useEffect(() => {
    (async () => {
      if (!student?._id) {
        setMyClubsData([]);
        return;
      }

      const myClubsRes = await apiGetMyClubs({
        reqQuery: {
          userId: student._id,
        },
      });

      if (myClubsRes.status === RESPONSE_SUCCESS) {
        setMyClubsData(myClubsRes.data as any);
      }
    })();
  }, [student?._id]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <Layout>
      <Container maxWidth={customMaxWidthContainer()} style={{ paddingTop: 32, paddingBottom: 60 }}>
        <ClubsParticipant myClubsData={myClubsData} title="Tổ chức của bạn" />
      </Container>
    </Layout>
  );
}

export default MyClubsPage;
