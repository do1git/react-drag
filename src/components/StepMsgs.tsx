import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";
import Msg from "./Msg";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.stepColor};
  min-height: 300px;
  width: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  border: 3px solid black;
`;

interface IAreaprops {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Column = styled.div<IAreaprops>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "pink"
      : props.isDraggingFromThis
      ? "orange"
      : "green"};
  flex-grow: 1;
  padding: 5px;
  transition: background-color 0.3s ease-in-out;
`;

interface IStepMsgsProps {
  msgSeq: number;
  me: IMsg;
  babies: IMsg[];
}

function StepMsgs({ msgSeq, me, babies }: IStepMsgsProps) {
  console.log("staticSM" + msgSeq);
  console.log(me);
  console.log(babies);
  console.log("---------------------------------");
  return (
    <Wrapper>
      {}
      {/* {msgs.map((msg) => (
        <Msg
          id={msg.id}
          sort_parent={msg.sort_parent}
          sort_me={msg.sort_me}
          name={msg.name}
          content={msg.content}
          parent_id={msg.parent_id}
          sort_seq={msg.sort_seq}
        />
      ))} */}
    </Wrapper>
  );
}

export default StepMsgs;
