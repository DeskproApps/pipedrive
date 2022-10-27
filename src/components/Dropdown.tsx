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
import { ICurrentAndList } from "../types/currentAndList";
import { Status } from "../types/status";

type Props<T> = {
  data: ICurrentAndList<T>;
  setter: React.Dispatch<React.SetStateAction<ICurrentAndList<T>>>;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any; // cant find fieldsErrorImpl
  keyName: keyof T;
  valueName: keyof T;
};
//change this
export const Dropdown = <T,>({
  data,
  setter,
  title,
  errors,
  keyName,
  valueName,
}: Props<T>) => {
  const { theme } = useDeskproAppTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataOptions = useMemo<any>(() => {
    return data.list.map((dataInList) => ({
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
        onSelectOption={(option) => {
          setter({ ...data, current: option.key });
        }}
      >
        {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
          <DivAsInput
            error={Boolean(errors?.[keyName])}
            ref={targetRef}
            {...targetProps}
            variant="inline"
            rightIcon={faCaretDown}
            placeholder="Enter value"
            value={
              dataOptions.find(
                (e: { value: string; key: string }) => e.key === data.current
              )?.value ?? ""
            }
          />
        )}
      </DropdownComponent>
    </Stack>
  );
};
