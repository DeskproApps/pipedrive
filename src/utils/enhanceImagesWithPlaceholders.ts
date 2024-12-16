import { IMAGE_PLACEHOLFER } from "../constants";

const enhanceImagesWithPlaceholders = (htmlString: string): Document => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const images = doc.querySelectorAll("img");

  Array.from(images).forEach((img) => {
    img.setAttribute("src", IMAGE_PLACEHOLFER);
    img.style.width = "32px";
    img.style.height = "32px";
  });

  return doc;
};

export { enhanceImagesWithPlaceholders };
