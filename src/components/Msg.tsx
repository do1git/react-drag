import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";

const Wrapper = styled.div<{ sort_me: IMsgProps["sort_me"] }>`
  width: 230px;
  background-color: ${(props) => props.theme.msgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px 0;
  padding: 10px 0;
  border-radius: 10px;
  margin-top: ${(props) => (props.sort_me === 1 ? "50px" : "10px")};
`;

const Title = styled.div`
  text-align: center;
  font-weight: 800;
  font-size: 20px;
`;
const Content = styled.div`
  text-align: center;
  background-color: pink;
  padding: 20px 0;
`;

interface ISonsprops {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
const Sons = styled.div<ISonsprops>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #c1bdf9;
  border-radius: 10px;
  padding: 10px 10px;
`;

const Son = styled.div<{ isDragging?: boolean }>`
  margin: 10px 0;
  width: 100%;
  cursor: pointer;
  background-color: #a29bfe;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
`;

//나중에 Imsg:38 대신 안쓰는거 지우고 대체하자
interface IMsgProps {
  id: number; //IMsg length+1
  name: string;
  sort_parent: number;
  sort_me: number;
  content: string;
  parent_id: number;
  sort_seq: number;
  babies?: IMsg[];
}
//sort_seq, parent_id는 바로 상위에서 처리
function Msg({
  id,
  sort_parent,
  sort_me,
  name,
  content,
  parent_id,
  sort_seq,
  babies,
}: IMsgProps) {
  // const children = childMsgSelector(id);
  return (
    <Wrapper sort_me={sort_me}>
      <div>
        sort_parent:{sort_parent} // sort_me:{sort_me}
      </div>
      <Title>{name}</Title>
      <hr />
      <Content>{content}</Content>
      <hr />
      <Droppable droppableId={id + ""}>
        {(magic, info) => (
          <Sons
            ref={magic.innerRef}
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            {...magic.droppableProps}
          >
            {babies ? (
              babies.map((baby, babyIndex) => (
                <Draggable draggableId={id + ""} index={babyIndex}>
                  {(magic, snapshot) => (
                    <Son
                      isDragging={snapshot.isDragging}
                      ref={magic.innerRef}
                      {...magic.dragHandleProps}
                      {...magic.draggableProps}
                    >
                      {baby.name}
                    </Son>
                  )}
                </Draggable>
              ))
            ) : (
              <Son>마지막입니다</Son>
            )}
            {magic.placeholder}
          </Sons>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default React.memo(Msg);
