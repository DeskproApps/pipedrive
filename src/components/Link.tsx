import { Link as NavigateLink } from "react-router-dom";
import styled from "styled-components";
import { ThemeColors } from "@deskpro/deskpro-ui";

const Link = styled.a<{ color?: keyof ThemeColors }>`
  color: ${({ theme, color = "cyan100" }) => theme.colors[color]};
  text-decoration: none;
`;

const RouterLink = styled(NavigateLink)`
  color: ${({ theme, color = "cyan100" }) => theme.colors[color]};
  text-decoration: none;
`;

export { Link, RouterLink };
