import { useEffect } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { checkLogin, fetchUserByToken, setAuthLoading } from "../features/auth/auth.slice";
import { useRouter } from "next/router";

const usePageAuth = (redirectAuth?: string) => {
  const router = useRouter()
  const { token, loading, user, student } = useSelector((state) => state.authState);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setAuthLoading(true));
  //   dispatch(fetchUserByToken(token));
  // }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (router.query.yourClub && !student) {
        router.push('/');
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [router, student]);

  useEffect(() => {
    dispatch(setAuthLoading(true));
    dispatch(checkLogin({ token: localStorage.getItem("token") }))
  }, [])

  useEffect(() => {
    if (!loading) {
      if (!!student && redirectAuth) {
        window.location.replace(redirectAuth);
      }
    }
  }, [loading]);
}

export default usePageAuth;