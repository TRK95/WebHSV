import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "./style.scss";

const RouteLoading = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleStart = (url: string) => {
      if (url === router.asPath) return;
      clearTimer();
      timerRef.current = setTimeout(() => setLoading(true), 120);
    };

    const handleDone = () => {
      clearTimer();
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleDone);
    router.events.on("routeChangeError", handleDone);

    return () => {
      clearTimer();
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleDone);
      router.events.off("routeChangeError", handleDone);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="route-loading">
      <div className="route-loading-card">
        <span className="route-loading-spinner" />
        <span>Đang tải nội dung...</span>
      </div>
    </div>
  );
};

export default RouteLoading;
