import { GEN_CODE_TYPE_CHAR, GEN_CODE_TYPE_NUMBER } from "../../modules/share/constraint";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const genCodeRandom = (props: {
  maxLength: number;
  type: number;
}): string => {
  const { maxLength, type } = props;
  let s = "";
  switch (type) {
    case GEN_CODE_TYPE_NUMBER:
      s = "0123456789";
      break;
    case GEN_CODE_TYPE_CHAR:
      s = "abcdefghijklmnopqrstuvwxyz";
      break;
    default:
      s = "abcdefghijklmnopqrstuvwxyz0123456789";
      break;
  }
  const chars = s.split("");
  const sb: Array<string> = [];
  for (let i = 0; i < maxLength; i++) {
    sb.push(chars[getRandomInt(chars.length)]);
  }
  return sb.join("");
};
