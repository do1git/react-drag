import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) => (props.isDragging ? "#ff67ace4" : "yellow")};
  /* props.isDragging ? "#ff67ace4" : props.theme.cardColor}; */
  font-size: 30px;
  padding: 5px 10px;
  margin-bottom: 10px;
  width: 90px;
  text-align: center;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.1)" : "none"};
`;

function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  console.log(toDoId, "has been rendered");

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoId}
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
