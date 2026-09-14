import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/redux/reducer";
import moment from "moment";
import { useHistory } from "react-router-dom";

const usePageAuth = (redirectAuth?: string) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const { token, loading, userInfo } = useSelector((state: AppState) => state.userInfoReducer);

  useEffect(() => {
    if (userInfo && token) {
      const presidentInfo = {
        userId: userInfo.student.userId,
        fullName: userInfo.student.fullName,
        email: userInfo.student.email,
      };
      localStorage.setItem('sessionId', 'A2299F8F-386E-476C-AA1C-42227C54F478-1672740676352_1672740676352');
      localStorage.setItem('presidentInfo', JSON.stringify(presidentInfo));
      localStorage.setItem('presidentToken', token);
      // window.location.href = process.env.PATH_NAME || '/to-chuc';
      history.push("/to-chuc")
    }
  }, [userInfo, token, redirectAuth]);

  useEffect(() => {
    if (!loading && !userInfo && redirectAuth) {
      window.location.replace(redirectAuth);
    }
  }, [loading, userInfo, redirectAuth]);
};

export default usePageAuth;
