import { memo, PropsWithoutRef } from "react";

const QuizIncorrectIcon = memo((props: PropsWithoutRef<{ className?: string }>) => (
  <svg {...{ className: props.className }} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8345 0.998291H10.8393C5.31513 0.998291 0.836914 5.4765 0.836914 11.0007V15.9959C0.836914 21.5201 5.31513 25.9983 10.8393 25.9983H15.8345C21.3587 25.9983 25.8369 21.5201 25.8369 15.9959V11.0007C25.8369 5.4765 21.3587 0.998291 15.8345 0.998291Z" fill="#FF5252" />
    <g filter="url(#filter0_d_263_983)">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5659 9.92491C10.6872 9.97551 10.7972 10.0496 10.8896 10.1429L13.339 12.5836L15.7814 10.143C15.8738 10.0496 15.9839 9.97552 16.1052 9.92491C16.2266 9.87424 16.3569 9.84814 16.4884 9.84814C16.62 9.84814 16.7503 9.87424 16.8717 9.92491C16.993 9.97554 17.1031 10.0497 17.1956 10.1432C17.3822 10.3308 17.487 10.5846 17.487 10.8491C17.487 11.1138 17.3819 11.3679 17.1952 11.5555L14.7527 13.9962L17.1955 16.4441C17.3822 16.6317 17.487 16.8856 17.487 17.1502C17.487 17.4148 17.3816 17.6693 17.1949 17.8569C17.0072 18.0434 16.7532 18.1481 16.4884 18.1481C16.2237 18.1481 15.9693 18.043 15.7815 17.8564L13.339 15.4088L10.8891 17.8569C10.7014 18.0434 10.4474 18.1481 10.1826 18.1481C9.91791 18.1481 9.66393 18.0434 9.47618 17.8569L9.47471 17.8554C9.29029 17.6669 9.18701 17.4138 9.18701 17.1502C9.18701 16.8866 9.29029 16.6335 9.47471 16.445L9.47589 16.4438L11.9254 13.9962L9.47471 11.5543C9.29029 11.3659 9.18701 11.1127 9.18701 10.8491C9.18701 10.5855 9.29086 10.3318 9.47527 10.1433C9.56779 10.0498 9.67795 9.97558 9.79937 9.92491C9.92079 9.87424 10.0511 9.84814 10.1826 9.84814C10.3142 9.84814 10.4445 9.87424 10.5659 9.92491Z" fill="white" />
    </g>
    <defs>
      <filter id="filter0_d_263_983" x="6.18701" y="8.84814" width="14.2998" height="14.3" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="1.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.7375 0 0 0 0 0.277792 0 0 0 0 0.443287 0 0 0 0.1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_263_983" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_263_983" result="shape" />
      </filter>
    </defs>
  </svg>
));

export default QuizIncorrectIcon;