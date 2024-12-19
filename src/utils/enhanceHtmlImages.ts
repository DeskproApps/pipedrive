import { IDeskproClient } from "@deskpro/app-sdk";
import { getImage } from "../api/api";
import { IMAGE_PLACEHOLFER } from "../constants";

const enhanceHtmlImages = (
  client: IDeskproClient,
  orgName: string,
  htmlString: string,
): Promise<Document> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const images = doc.querySelectorAll("img");

  return Promise.all(Array.from(images).map((img) => {
    const pipeCid = img.getAttribute("data-pipecid");
    const [,id] = (pipeCid ?? "").split(":");

    // remove unnecessary parent link
    const parentLink = img.parentElement;
    if (parentLink?.tagName.toLowerCase() === "a") {
      parentLink.replaceWith(img);
    }

    if (id) {
      return getImage(client, orgName, id)
        .then((blob) => img.setAttribute("src", URL.createObjectURL(blob)))
        .catch(() => {
          img.setAttribute("src", IMAGE_PLACEHOLFER);
          img.style.removeProperty("width");
          img.style.removeProperty("height");
        })
    }
  }))
  .then(() => doc);
};

export { enhanceHtmlImages };
