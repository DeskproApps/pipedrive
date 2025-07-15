import { DeskproAppTheme } from "@deskpro/app-sdk";
import { Link as NavigateLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled.a<{ color?: keyof DeskproAppTheme["theme"]["colors"], theme: DeskproAppTheme["theme"] }>`
  color: ${({ theme, color = "cyan100" }) => theme.colors[color]};
  text-decoration: none;
`;

const RouterLink = styled(NavigateLink)<{ color?: keyof DeskproAppTheme["theme"]["colors"], theme: DeskproAppTheme["theme"] }>`
  color: ${({ theme, color = "cyan100" }) => theme.colors[color]};
  text-decoration: none;
`;

export { Link, RouterLink };
