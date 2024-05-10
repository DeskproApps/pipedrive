import {
  Label,
  AnyIcon,
  DivAsInput,
  DropdownTargetProps,
  Dropdown as DropdownComponent,
} from "@deskpro/deskpro-ui";
import {
  faCheck,
  faCaretDown,
  faExternalLinkAlt,
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
  required?: boolean;
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
  required,
}: Props<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataOptions = useMemo<any>(() => {
    return data.map((dataInList) => ({
      key: dataInList[keyName],
      label: dataInList[valueName],
      value: dataInList[valueName],
      type: "value" as const,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, valueName]);

  return (
    <DropdownComponent<Status, HTMLDivElement>
      placement="bottom-start"
      options={dataOptions}
      fetchMoreText={"Fetch more"}
      autoscrollText={"Autoscroll"}
      selectedIcon={faCheck as AnyIcon}
      externalLinkIcon={faExternalLinkAlt as AnyIcon}
      onSelectOption={(option) => onChange(option.key)}
    >
      {({targetProps, targetRef}: DropdownTargetProps<HTMLDivElement>) => (
        <Label label={title} required={required} style={{ marginBottom: 10 }}>
          <DivAsInput
            error={error}
            ref={targetRef}
            {...targetProps}
            variant="inline"
            rightIcon={faCaretDown as AnyIcon}
            placeholder="Enter value"
            value={
              dataOptions.find(
                (e: { value: string; key: string }) => e.key == value
              )?.value ?? ""
            }
          />
        </Label>
      )}
    </DropdownComponent>
  );
};
