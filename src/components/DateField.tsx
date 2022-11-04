/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
  Input,
  DatePickerProps,
  useDeskproAppTheme,
  LabelProps,
  Label as UILabel,
  DateTimePicker,
  Stack,
  H1
} from "@deskpro/app-sdk";
import "./DateField.css";

type Props = LabelProps & {
  marginBottom?: number;
};

const Label = styled(UILabel)`
  margin-bottom: ${({ marginBottom = 10 }: Props) => marginBottom}px;
`;

export type MappedFieldProps = DatePickerProps & {
  id: string;
  label: string;
  error: boolean;
  value?: string;
  onChange: (date: [Date]) => void;
};

const LabelDate = styled(Label)`
  //width: calc(100% - 25px);
`;

const DateInput = styled(Input)`
  :read-only {
    cursor: pointer;
  }
`;

const CustomH1 = styled.h1`
  color: #8b9293 !important;
  font-size: 12px;
  margin: 0px;
`;

export const DateField: FC<MappedFieldProps> = ({
  id,
  value,
  label,
  error,
  onChange,
  required,
  ...props
}: MappedFieldProps) => {
  const { theme } = useDeskproAppTheme();

  return (
    <DateTimePicker
      options={{
        altInput: true,
        altFormat: "j F Y H:i",
        position: "left",
        dateFormat: "d/m/Y",
        timeFormat: "H:i",
      }}
      value={value}
      onChange={onChange}
      {...props}
      render={(_: any, ref: any) => (
        <LabelDate htmlFor={id}>
          <Stack align="center">
            <CustomH1>{label}</CustomH1>
            {required && (
              <Stack style={{ color: "red" }}>
                <H1>⠀*</H1>
              </Stack>
            )}
          </Stack>
          <DateInput
            id={id}
            ref={ref}
            error={error}
            variant="inline"
            inputsize="small"
            placeholder="DD/MM/YYYY"
            style={{ backgroundColor: "transparent" }}
            rightIcon={{
              icon: faCalendarDays,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              style: {
                color: theme.colors.grey40,
              },
            }}
          />
        </LabelDate>
      )}
    />
  );
};
