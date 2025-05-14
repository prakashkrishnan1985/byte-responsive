interface Props {
  pills: any;
}
export default function InputResult({ pills }: Props) {
  return (
    <div style={{ marginTop: "5px", marginLeft:"5px" }}>
       {pills[0]?.name && <span
          style={{
            padding: "5px 10px",
            background: "#f5f6fa",
            borderRadius: "10px",
            margin: "5px",
            display: "inline-block",
          }}
        >
          {pills[0]?.name}
        </span>}
       {pills[0]?.description && <span
          style={{
            padding: "5px 10px",
            background: "#f5f6fa",
            borderRadius: "10px",
            margin: "5px",
            display: "inline-block",
          }}
        >
          {pills[0]?.description}
        </span>}
    </div>
  );
}
