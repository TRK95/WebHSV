import { useEffect } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { checkLogin, setAuthLoading } from "../features/auth/auth.slice";
import { useRouter } from "next/router";

const AUTH_RECHECK_INTERVAL = 5 * 60 * 1000;
let lastCheckedToken: string | null = null;
let lastCheckedAt = 0;

const usePageAuth = (redirectAuth?: string) => {
  const router = useRouter()
  const { loading, student } = useSelector((state) => state.authState);
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
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      dispatch(setAuthLoading(false));
      return;
    }

    if (student) {
      if (loading) dispatch(setAuthLoading(false));
      return;
    }

    if (lastCheckedToken === storedToken && Date.now() - lastCheckedAt < AUTH_RECHECK_INTERVAL) {
      dispatch(setAuthLoading(false));
      return;
    }

    lastCheckedToken = storedToken;
    lastCheckedAt = Date.now();
    dispatch(setAuthLoading(true));
    dispatch(checkLogin({ token: storedToken }));
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
