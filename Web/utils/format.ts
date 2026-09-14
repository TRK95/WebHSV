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
export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
export const isValidatePhoneNumber = (phoneNumber: string) =>
  /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneNumber)

export const isValidateAccount = (account: string) => {
  return /^[0-9a-z/]+$/.test(account)
}


