import { H2, useDeskproAppTheme } from "@deskpro/app-sdk";

export const Property = ({
  title,
  children,
}: {
  title: string;
  children: string;
}) => {
  const { theme } = useDeskproAppTheme();
  return (
    <div>
      <h2
        style={{
          fontSize: "12px",
          margin: "1px",
          color: theme.colors.grey80,
          fontWeight: "normal",
          marginBottom: "3px",
        }}
      >
        {title}
      </h2>
      <H2 style={{ fontSize: "12px", margin: "1px", fontWeight: "normal" }}>
        {children}
      </H2>
    </div>
  );
};
