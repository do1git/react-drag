import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";

interface IWrapperProps {
  isDragging: boolean;
  draggingOver: boolean;
  combineTargetFor: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  width: 200px;
  height: 320px;
  background-color: ${(props) => props.theme.msgColor};
  background-color: ${(props) => (props.combineTargetFor ? "purple" : "")};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  padding: 10px 8px;
  border-radius: 10px;
  box-sizing: content-box;

  :hover {
    background-color: yellow;
  }
  border: 1px solid black;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 800;
  font-size: 20px;
`;
const Content = styled.div`
  text-align: center;
  width: 100%;
  background-color: pink;
  padding: 20px 0;
`;

const Sons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #c1bdf9;
  border-radius: 10px;
  padding: 10px 10px;
`;

const Son = styled.div<{ isDragging?: boolean }>`
  margin: 10px 0;
  width: 100%;
  background-color: #a29bfe;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
`;

//나중에 Imsg:38 대신 안쓰는거 지우고 대체하자
interface IMsgProps {
  id: number;
  parent_id: number;
  inMsg_index: number;
  name: string;
  content: string;
}
//row_seq, parent_id는 바로 상위에서 처리
function Msg({ id, parent_id, inMsg_index, name, content }: IMsgProps) {
  return (
    <Draggable draggableId={`drag-${id}`} index={inMsg_index}>
      {(magic, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          draggingOver={Boolean(snapshot.draggingOver)}
          combineTargetFor={Boolean(snapshot.combineTargetFor)}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <Title>{name}</Title>
          <hr />
          <Content>{content}</Content>
          <hr />
          {`drag-${id}`}
          {/* <Sons>
            {babies ? (
              babies.map((baby) => (
                <Son
                  key={`${col_seq + 1}-${baby.parent_row_seq}-${
                    baby.inMsg_index
                  }`}
                >
                  {baby.name}
                  {`<<<${col_seq + 1}-${baby.parent_row_seq}-${
                    baby.inMsg_index
                  }>>>`}
                </Son>
              ))
            ) : (
              <Son>마지막입니다</Son>
            )}
          </Sons> */}
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Msg);
