import {
  H1,
  HorizontalDivider,
  Stack,
  VerticalDivider,
} from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { LogoAndLinkButton } from "./LogoAndLinkButton";
const deals = [
  {
    date: "28 Apr, 2021",
    budget: "40000",
    id: "1",
  },
  {
    date: "28 Apr, 2021",
    budget: "40000",
    id: "1",
  },
  {
    date: "28 Apr, 2021",
    budget: "40000",
    id: "1",
  },
];

export const DealsMainView = () => {
  return (
    <Stack vertical style={{ width: "100%" }}>
      <Stack
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack gap={"2px"} style={{ alignItems: "center" }}>
          <h1 style={{ fontSize: "12px" }}>Deals ({deals.length})</h1>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ width: "12px", marginLeft: "5px" }}
          ></FontAwesomeIcon>
        </Stack>
        <LogoAndLinkButton />
      </Stack>
      <Stack vertical style={{ width: "100%" }}>
        {deals.map((deal, i) => {
          return (
            <Stack
              vertical
              gap={5}
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Stack
                style={{
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <h1 style={{ color: "#3A8DDE", fontSize: "12px" }}>
                  Deal {++i}
                </h1>
                <LogoAndLinkButton />
              </Stack>
              <Stack>
                <H1>{deal.date}</H1>
                <Stack style={{ marginLeft: "40px" }}>
                  <VerticalDivider
                    style={{ height: "10px", width: "1px", color: "#EFF0F0" }}
                  ></VerticalDivider>
                  <H1>{Number(deal.budget).toLocaleString("en-US")} USD</H1>
                </Stack>
              </Stack>
              <HorizontalDivider
                style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
