import { memo, PropsWithoutRef, useEffect, useState } from "react";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";

momentDurationFormat(moment as any);

const Countdown = memo((props: PropsWithoutRef<{
  /** Seconds */
  total: number;
  stop?: boolean;
  id?: any;
  onChange?: (timeLeft: number) => void;
  onEnd?: () => void;
}>) => {
  const { total, stop, id, onChange = (timeLeft: number) => { console.log(timeLeft) }, onEnd = () => { } } = props;
  const [value, setValue] = useState(total);

  let timeout: any = null;
  useEffect(() => {
    if (stop) return;
    if (value === 0) {
      if (total > 0) onEnd();
      return;
    };
    timeout = setTimeout(() => {
      const newValue = value - 1;
      setValue(newValue);
      onChange(newValue);
    }, 1000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [value, stop]);

  useEffect(() => {
    setValue(total);
  }, [id, total]);

  return <span style={{ color: "#26C048", fontSize: 16, fontWeight: "bold" }}>{moment.duration(value, "seconds").format("hh:mm:ss", { trim: false })}</span>
});

export default Countdown;