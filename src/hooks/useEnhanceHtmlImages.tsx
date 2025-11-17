import { useState } from "react";
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { enhanceHtmlImages, enhanceImagesWithPlaceholders } from "../utils";
import { useUser } from "../context/userContext";

const useEnhanceHtmlImages = (htmlString: string) => {
  const dpUser = useUser();
  const [note, setNote] = useState(htmlString);

  useInitialisedDeskproAppClient((client) => {
    if (!htmlString) {
      return;
    }

    // set placeholders
    const docWithPlaceholders = enhanceImagesWithPlaceholders(htmlString);
    setNote(docWithPlaceholders.body.innerHTML);

    if (!dpUser?.orgName) {
      return;
    }

    // upload iamges
    enhanceHtmlImages(client, htmlString)
      .then((doc) => setNote(doc.body.innerHTML))
      .catch(() => { /* don’t do anything, placeholder will just be displayed */ });
  }, [htmlString]);

  return { note };
};

export { useEnhanceHtmlImages };
