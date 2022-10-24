import {
  DivAsInput,
  Dropdown as DropdownComponent,
  DropdownTargetProps,
  Label,
  H1,
  Stack,
} from "@deskpro/app-sdk";
import {
  faCheck,
  faExternalLinkAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Status } from "../types/status";

type Props = {
  data: any;
  setter: any;
  title: string;
  errors: any;
};

export const Dropdown = ({ data, setter, title, errors }: Props) => {
  const dataOptions = useMemo(() => {
    return data.list.map((dataInList: any) => ({
      key: dataInList.name,
      label: <Label label={dataInList.name}></Label>,
      value: dataInList.id,
      type: "value" as const,
    }));
  }, [data]) as any;
  return (
    <Stack
      vertical
      style={{ marginTop: "5px", color: "#8B9293", width: "100%" }}
    >
      <H1>{title}</H1>
      <DropdownComponent<Status, HTMLDivElement>
        placement="bottom-start"
        options={dataOptions}
        fetchMoreText={"Fetch more"}
        autoscrollText={"Autoscroll"}
        selectedIcon={faCheck}
        externalLinkIcon={faExternalLinkAlt}
        onSelectOption={(option) => {
          setter({ ...data, current: option.value });
        }}
      >
        {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
          <DivAsInput
            style={errors?.person_id && { borderColor: "red" }}
            ref={targetRef}
            {...targetProps}
            variant="inline"
            rightIcon={faCaretDown}
            placeholder="Enter value"
            value={
              dataOptions.find((e: any) => e.value === data.current)?.key ?? ""
            }
          />
        )}
      </DropdownComponent>
    </Stack>
  );
};
