import Nav from "../../Nav";
import { useSelector } from "react-redux";
import { Connect4State } from "../../store";

export default function TempMessage({ text }: { text: string }) {
  const userData = useSelector(
    (state: Connect4State) => state.accountReducer.userData
  );
  return (
    <div>
      <Nav userData={userData} />
      <div style={{ fontSize: "40px", padding: "20px" }}>{text}</div>
    </div>
  );
}
