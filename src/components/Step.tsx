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
  let result: any[] = [];
  //각 메세지 당
  msgsHere.forEach((msgHere, i) => {
    let eachResult = [];
    //지금메세지에 해당하는
    eachResult.push(msgHere);
    eachResult.push(stepSeq);
    if (msgsNext) {
      const msgNextGrp = msgsNext.filter((msg) => msg.parent_row_seq === i + 1);
      msgNextGrp.sort((a, b) => a.inMsg_seq - b.inMsg_seq);
      //자식메세지들을 넣는다
      eachResult.push(msgNextGrp);
    }
    result.push(eachResult);
  });

  return (
    <Wrapper>
      {result.map((msg, msgSeq) => (
        <Msg
          key={`msg${stepSeq}-${msgSeq + 1}`}
          id={msg[0].id}
          parent_row_seq={msg[0].parent_row_seq}
          inMsg_seq={msg[0].inMsg_seq}
          name={msg[0].name}
          content={msg[0].content}
          parent_id={msg[0].parent_id}
          row_seq={msg[0].row_seq}
          col_seq={msg[1]}
          babies={msg[2]}
        />
      ))}
    </Wrapper>
  );
}
export default Step;
