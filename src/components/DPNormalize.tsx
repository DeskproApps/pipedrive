import { addBlankTargetToLinks } from "../utils";
import { css } from "styled-components";
import { DeskproTheme, P5 } from "@deskpro/deskpro-ui";
import styled from "styled-components";
import type { FC } from "react";

type Props = {
  text?: string,
};

const dpNormalize = css<{ theme: DeskproTheme }>`
  p {
    margin-top: 0;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p:first-child,
  ol:first-child,
  ul:first-child {
    margin-top: 0;
  }

  ol, ul {
    padding-inline-start: 20px;
  }

  img {
    width: 100%;
    height: auto;
  }

  a, a:hover {
    color: ${({ theme }) => theme.colors.cyan100};
  }
`;

const Text = styled(P5)`
  width: 100%;

  ${dpNormalize}
`;

const DPNormalize: FC<Props> = ({ text }) => (
  <Text dangerouslySetInnerHTML={{ __html: addBlankTargetToLinks(text) || "-" }} />
);

export { DPNormalize };
