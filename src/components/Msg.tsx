import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IMsg } from "../atoms";

const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 230px;
  height: 360px;
  background-color: ${(props) => props.theme.msgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  padding: 10px 8px;
  border-radius: 10px;
  box-sizing: content-box;
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
  id: number; //IMsg length+1
  name: string;
  parent_row_seq: number;
  inMsg_index: number;
  content: string;
  parent_id: number;
  row_seq: number;
  col_seq: number;
  babies?: IMsg[];
}
//row_seq, parent_id는 바로 상위에서 처리
function Msg({
  id,
  parent_row_seq,
  inMsg_index,
  name,
  content,
  parent_id,
  row_seq,
  col_seq,
  babies,
}: IMsgProps) {
  return (
    <Draggable draggableId={`${col_seq}-${row_seq}`} index={row_seq}>
      {(magic, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <div>
            <b>{`${col_seq}-${row_seq}`}</b>
          </div>
          <div>
            parent_row_seq:{parent_row_seq} // inMsg_index:{inMsg_index}
          </div>
          <div>
            row_seq:{row_seq} // col_seq:{col_seq}
          </div>
          <Title>{name}</Title>
          <hr />
          <Content>{content}</Content>
          <hr />
          <div>{`${col_seq}-${row_seq}`}</div>
          <Sons>
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
          </Sons>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Msg);
