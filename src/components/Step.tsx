import styled from "styled-components";
import { IMsg } from "../atoms";
import Msg from "./Msg";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.stepColor};
  min-height: 800px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  border: 3px solid black;
  margin: 0 20px;
`;

interface IStepProps {
  msgsHere: IMsg[];
  msgsNext: IMsg[];
  stepSeq: number;
}

function Step({ msgsHere, msgsNext, stepSeq }: IStepProps) {
  // console.log("msgsHere");
  // console.log(msgsHere);
  // console.log("msgsNext");
  // console.log(msgsNext);

  let result: any[] = [];
  msgsHere.forEach((msgHere, i) => {
    let miniResult: any[] = [];
    miniResult.push(msgHere);
    if (msgsNext) {
      const msgNextGrp = msgsNext.filter((msg) => msg.sort_parent === i + 1);
      msgNextGrp.sort((a, b) => a.sort_me - b.sort_me);
      miniResult.push(msgNextGrp);
    }
    result.push(miniResult);
  });
  console.log("++++++++++++++++++");
  console.log("result");
  console.log(result);
  return (
    <Wrapper>
      {result.map((msg, msgSeq) => (
        <Msg
          key={`sm${stepSeq}-${msgSeq + 1}`}
          id={msg[0].id}
          sort_parent={msg[0].sort_parent}
          sort_me={msg[0].sort_me}
          name={msg[0].name}
          content={msg[0].content}
          parent_id={msg[0].parent_id}
          sort_seq={msg[0].sort_seq}
          babies={msg[1]}
        />
      ))}
    </Wrapper>
  );
}
export default Step;
