import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";
import Msg from "./Msg";

interface IWrapperProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  /* min-height: 300px; */
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 10px;

  background-color: ${
    (props) => (props.isDraggingOver ? "lightblue" : "inherit")
    // : props.isDraggingFromThis
    // ? "orange"
    // : props.theme.stepColor
  };
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
`;

interface IMsgGrpProps {
  msgs: IMsg[];
  grpIndex: number;
}

function MsgGrp({ msgs, grpIndex }: IMsgGrpProps) {
  if (msgs.length === 0) {
    return <></>;
  } else {
    return (
      <Droppable droppableId={`drop-${msgs[0].parent_id}`} isCombineEnabled>
        {(magic, info) => (
          <Wrapper
            ref={magic.innerRef}
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            {...magic.droppableProps}
          >
            {/* drop-${msgs[0].parent_id} */}
            {msgs.map((msg, msgIndex) => (
              <Msg
                id={msg.id}
                parent_id={msg.parent_id}
                inMsg_index={msg.inMsg_index}
                name={msg.name}
                content_ment={msg.content_ment}
                content_memo={msg.content_memo}
                content_syst={msg.content_syst}
                content_work={msg.content_work}
                key={`msg${msg.id}`}
              />
            ))}
            {magic.placeholder}
          </Wrapper>
        )}
      </Droppable>
    );
  }
}

export default React.memo(MsgGrp);
