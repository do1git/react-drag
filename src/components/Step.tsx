import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";
import Msg from "./Msg";

interface IWrapperProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  min-height: 800px;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid black;
  border-radius: 10px;

  background-color: ${(props) =>
    props.isDraggingOver
      ? "pink"
      : props.isDraggingFromThis
      ? "orange"
      : "green"};
  flex-grow: 1;
  padding: 20px 10;
  transition: background-color 0.3s ease-in-out;
`;

interface IStepProps {
  msgsHere: IMsg[];
  msgsNext: IMsg[];
  stepSeq: number;
}

function Step({ msgsHere, msgsNext, stepSeq }: IStepProps) {
  let result: any[] = [];
  //각 메세지 당
  msgsHere.forEach((msgHere) => {
    let eachResult = [];
    //지금메세지에 해당하는
    eachResult.push(msgHere);
    eachResult.push(stepSeq);
    if (msgsNext) {
      const msgNextGrp = msgsNext.filter(
        (msgNext) => msgNext.parent_id === msgHere.id
      );
      msgNextGrp.sort((a, b) => a.inMsg_index - b.inMsg_index);
      //자식메세지들을 넣는다
      eachResult.push(msgNextGrp);
    }
    result.push(eachResult);
  });

  return (
    <Droppable droppableId={`s${stepSeq}`} isCombineEnabled>
      {(magic, info) => (
        <Wrapper
          ref={magic.innerRef}
          isDraggingOver={info.isDraggingOver}
          isDraggingFromThis={Boolean(info.draggingFromThisWith)}
          {...magic.droppableProps}
        >
          {stepSeq}
          {result.map((msg, msgSeq) => (
            <Msg
              key={`msg${stepSeq}-${msgSeq + 1}`}
              id={msg[0].id}
              parent_row_seq={msg[0].parent_row_seq}
              inMsg_index={msg[0].inMsg_index}
              name={msg[0].name}
              content={msg[0].content}
              parent_id={msg[0].parent_id}
              row_seq={msg[0].row_seq}
              col_seq={msg[1]}
              babies={msg[2]}
            />
          ))}
          {magic.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}
export default Step;
