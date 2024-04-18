export default function TempMessage({text} : {text: string}) {
  return (
    <div style={{fontSize: "40px", padding: "20px"}}>
      {text}
    </div>
  );
}