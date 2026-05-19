import API from "./api";

const API_ORIGIN = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");

export function resolveImageUrl(image) {
  if (!image) {
    return "";
  }

  if (/^(https?:|data:)/i.test(image)) {
    return image;
  }

  if (image.startsWith("//")) {
    return `https:${image}`;
  }

  if (image.startsWith("/")) {
    return `${API_ORIGIN}${image}`;
  }

  return image;
}