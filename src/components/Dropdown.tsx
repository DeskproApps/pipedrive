import {
  DivAsInput,
  Dropdown as DropdownComponent,
  DropdownTargetProps,
  Label,
  H1,
  Stack,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import {
  faCheck,
  faExternalLinkAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { Status } from "../types/status";

type Props<T> = {
  data: T[];
  onChange: (key: string) => void;
  title: string;
  value: string;
  error?: boolean;
  keyName: keyof T;
  valueName: keyof T;
};
//change this
export const Dropdown = <T,>({
  data,
  onChange,
  title,
  value,
  error,
  keyName,
  valueName,
}: Props<T>) => {
  const { theme } = useDeskproAppTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataOptions = useMemo<any>(() => {
    return data.map((dataInList) => ({
      key: dataInList[keyName],
      label: <Label label={dataInList[valueName]}></Label>,
      value: dataInList[valueName],
      type: "value" as const,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, valueName]);
  return (
    <Stack
      vertical
      style={{ marginTop: "5px", color: theme.colors.grey80, width: "100%" }}
    >
      <H1>{title}</H1>
      <DropdownComponent<Status, HTMLDivElement>
        placement="bottom-start"
        options={dataOptions}
        fetchMoreText={"Fetch more"}
        autoscrollText={"Autoscroll"}
        selectedIcon={faCheck}
        externalLinkIcon={faExternalLinkAlt}
        onSelectOption={(option) => onChange(option.key)}
      >
        {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
          <DivAsInput
            error={error}
            ref={targetRef}
            {...targetProps}
            variant="inline"
            rightIcon={faCaretDown}
            placeholder="Enter value"
            value={
              dataOptions.find(
                (e: { value: string; key: string }) => e.key === value
              )?.value ?? ""
            }
          />
        )}
      </DropdownComponent>
    </Stack>
  );
};
