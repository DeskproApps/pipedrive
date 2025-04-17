import { DeskproTheme, ThemeColors } from "@deskpro/deskpro-ui";
import { Link as NavigateLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled.a<{ theme: DeskproTheme, color?: keyof ThemeColors }>`
  color: ${({ theme, color = "cyan100" }) => theme.colors[color]};
  text-decoration: none;
`;

const RouterLink = styled(NavigateLink) <{ theme: DeskproTheme, color?: keyof ThemeColors }>`
  color: ${({ theme, color = "cyan100" }) => theme.colors[color]};
  text-decoration: none;
`;

export { Link, RouterLink };
