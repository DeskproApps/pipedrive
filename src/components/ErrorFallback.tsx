import { match } from "ts-pattern";
import { PipeDriveError } from "../api/api";
import { ErrorBlock } from "./ErrorBlock";
import { FallbackRender } from "@sentry/react";

export const ErrorFallback: FallbackRender = ({ error }) => {
  let message;

  if (error && error instanceof PipeDriveError) {
    message = match(error.data)
      .with({ errorCode: 400 }, () => "Request not understood")
      .with({ errorCode: 401 }, () => "Invalid API token.  Please, check the settings")
      .with({ errorCode: 402 }, () => "Company account is not open (possible reason: trial expired, payment details not entered)")
      .with({ errorCode: 403 }, () => "Request not allowed.\n User account has reached a limit for an entity.")
      .with({ errorCode: 404 }, () => "Resource unavailable")
      .with({ errorCode: 405 }, () => "Incorrect request method")
      .with({ errorCode: 410 }, () => "Old resource permanently unavailable")
      .with({ errorCode: 429 }, () => "Rate limit has been exceeded")
      .otherwise(() => error.data.error);
  }

  return (
    <ErrorBlock text={message}/>
  );
};
