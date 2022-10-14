import { H2 } from "@deskpro/app-sdk";

export const Property = ({
  title,
  children,
}: {
  title: string;
  children: string;
}) => {
  return (
    <div>
      <h2
        style={{
          fontSize: "12px",
          margin: "1px",
          color: "#8B9293",
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
