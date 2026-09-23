import DOMPurify from "isomorphic-dompurify";
const GCS_BASE_URL = "https://storage.googleapis.com";
const IMG_START_TOKEN = "@PS@";
const IMG_END_TOKEN = "@PE@";

export const getStorageURL = (_url: string = "") => {
  if (!_url) return "";
  let url = _url;
  if (!url.startsWith(GCS_BASE_URL) && !url.startsWith("http") && !url.startsWith("file://")) url = url.startsWith("/") ? `${GCS_BASE_URL}${url}` : `${GCS_BASE_URL}/${url}`;
  return url;
}

export const getFormattedContentWithImg = (content: string) => {
  const regex = /(\@PS@)[/a-z0-9-_\.]*(\@PE@)/gi;
  let m: RegExpExecArray;
  let images: string[] = [];
  while ((m = regex.exec(content)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      groupIndex == 0 && !images.includes(match) && images.push(match);
    });
  }
  if (images.length) {
    let style = `style="max-width: 70%; margin: 0px auto; display: block;"`;
    images.map((e, i) => {
      let image = e
        .replace(IMG_START_TOKEN, "")
        .replace(IMG_END_TOKEN, "");
      if (!image.includes(GCS_BASE_URL)) {
        if (image.startsWith("/")) {
          image = image.substring(1, image.length);
        }
        image = `${GCS_BASE_URL}/` + image;
      }
      content = content.replace(
        e,
        `<img alt="${i}" src="${image}" ${style}></img>`
      );
    });
  }
  return content;
}

export const getPurifiedContent = (html: string | Node) => DOMPurify.sanitize(html);

const htmlEntityMap: Record<string, string> = {
  amp: "&",
  apos: "'",
  copy: "(c)",
  gt: ">",
  lt: "<",
  nbsp: " ",
  ndash: "-",
  mdash: "-",
  quot: '"',
  Aacute: "A",
  aacute: "a",
  Agrave: "A",
  agrave: "a",
  Acirc: "A",
  acirc: "a",
  Atilde: "A",
  atilde: "a",
  Eacute: "E",
  eacute: "e",
  Egrave: "E",
  egrave: "e",
  Ecirc: "E",
  ecirc: "e",
  Iacute: "I",
  iacute: "i",
  Igrave: "I",
  igrave: "i",
  Oacute: "O",
  oacute: "o",
  Ograve: "O",
  ograve: "o",
  Ocirc: "O",
  ocirc: "o",
  Otilde: "O",
  otilde: "o",
  Uacute: "U",
  uacute: "u",
  Ugrave: "U",
  ugrave: "u",
  Yacute: "Y",
  yacute: "y",
};

export const decodeHtmlEntities = (value = "") => {
  if (!value) return "";
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === "#") {
      const codePoint = entity[1]?.toLowerCase() === "x"
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return htmlEntityMap[entity] ?? match;
  });
};

export const stripHtmlToText = (html = "") => decodeHtmlEntities(
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
);
export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
export const isValidatePhoneNumber = (phoneNumber: string) =>
  /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneNumber)

export const isValidateAccount = (account: string) => {
  return /^[0-9a-z/]+$/.test(account)
}


