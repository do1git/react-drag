import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";
import Msg from "./Msg";
import MsgGrp from "./MsgGrp";

interface IWrapperProps {
  isDraggingOver?: boolean;
  isDraggingFromThis?: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  min-height: 1300px;
  width: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid black;
  border-radius: 10px;

  margin: 10px;
`;

interface IStepProps {
  msgsGrps: IMsg[][];
  stepIndex: number;
}

function Step({ msgsGrps, stepIndex }: IStepProps) {
  let msgList: IMsg[] = [];
  return (
    <Wrapper>
      {msgsGrps.map((msgs, grpIndex) => (
        <MsgGrp
          msgs={msgs}
          grpIndex={grpIndex}
          key={`${stepIndex}-${grpIndex}`}
        />
      ))}
    </Wrapper>

    // <Droppable droppableId={`s${stepSeq}`} isCombineEnabled>
    //   {(magic, info) => (
    //     <Wrapper
    //       ref={magic.innerRef}
    //       isDraggingOver={info.isDraggingOver}
    //       isDraggingFromThis={Boolean(info.draggingFromThisWith)}
    //       {...magic.droppableProps}
    //     >
    //       {stepSeq}
    //       {result.map((msg, msgSeq) => (
    //         <Msg
    //           key={`msg${stepSeq}-${msgSeq + 1}`}
    //           id={msg[0].id}
    //           parent_row_seq={msg[0].parent_row_seq}
    //           inMsg_index={msg[0].inMsg_index}
    //           name={msg[0].name}
    //           content={msg[0].content}
    //           parent_id={msg[0].parent_id}
    //           row_seq={msg[0].row_seq}
    //           col_seq={msg[1]}
    //           babies={msg[2]}
    //         />
    //       ))}
    //       {magic.placeholder}
    //     </Wrapper>
    //   )}
    // </Droppable>
  );
}
export default Step;
