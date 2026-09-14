import { memo, PropsWithoutRef } from "react";

const QuizBoxIcon = memo((props: PropsWithoutRef<{ className?: string }>) => (
  <svg {...{ className: props.className }} width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8393 0.999268H15.8345C20.8064 0.999268 24.8369 5.02977 24.8369 10.0016V14.9969C24.8369 19.9688 20.8064 23.9993 15.8345 23.9993H10.8393C5.86741 23.9993 1.83691 19.9688 1.83691 14.9969V10.0016C1.83691 5.02976 5.86741 0.999268 10.8393 0.999268Z" fill="white" stroke="#D2D2D2" strokeWidth="2" />
  </svg>
));

export default QuizBoxIcon;