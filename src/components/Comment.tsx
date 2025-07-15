import { Avatar, TSpan, P11, Stack } from "@deskpro/deskpro-ui";
import { DeskproAppTheme } from "@deskpro/app-sdk";
import { DPNormalize } from "./DPNormalize";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useEnhanceHtmlImages } from "../hooks";
import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";
import type { AnyIcon } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { Maybe } from "../types/common";

const TimeAgo = styled(ReactTimeAgo)<DeskproAppTheme>`
  color: ${({theme}) => theme.colors.grey80};
`;

const Author = styled(Stack)`
  width: 35px;
`;

const Body = styled(TSpan)`
  width: calc(100% - 35px);
`;

type Props = {
  name: string,
  text: string,
  date?: Maybe<Date>,
  avatarUrl?: string,
};

const Comment: FC<Props> = ({ name, avatarUrl, text, date }) => {
  const { note } = useEnhanceHtmlImages(text);

  return (
    <Stack wrap="nowrap" gap={6} style={{ marginBottom: 10 }}>
      <Author vertical>
        <Avatar
          size={18}
          name={name}
          backupIcon={faUser as AnyIcon}
          imageUrl={avatarUrl}
        />
        {date && (
          <P11>
            <TimeAgo date={date} timeStyle="mini"/>
          </P11>
        )}
      </Author>
      <Body type="p5">
        <DPNormalize text={note}/>
      </Body>
    </Stack>
  );
};

export { Comment };
