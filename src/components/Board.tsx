import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
// import { ITodo, toDoState } from "../atoms";
import DragabbleCard from "./DraggableCard";

// const Wrapper = styled.div`
//   background-color: ${(props) => props.theme.boardColor};
//   padding: 20px 10px;
//   padding-top: 30px;
//   border-radius: 10px;
//   min-height: 500px;
//   display: flex;
//   flex-direction: column;
// `;

// const Title = styled.div`
//   text-align: center;
//   font-weight: 600;
//   margin-bottom: 10px;
//   font-size: 20px;
// `;

// interface IAreaprops {
//   isDraggingOver: boolean;
//   isDraggingFromThis: boolean;
// }

// const Area = styled.div<IAreaprops>`
//   background-color: ${(props) =>
//     props.isDraggingOver
//       ? "pink"
//       : props.isDraggingFromThis
//       ? "orange"
//       : "green"};
//   flex-grow: 1;
//   padding: 20px;
//   transition: background-color 0.3s ease-in-out;
// `;

// export interface IBoardProps {
//   toDos: ITodo[];
//   boardId: string;
// }

// const Form = styled.form`
//   width: 100%;
// `;

// interface IForm {
//   toDo: string;
// }

// function Board({ toDos, boardId }: IBoardProps) {
function Board() {
  // const setTodos = useSetRecoilState(toDoState);
  // const { register, setValue, handleSubmit } = useForm<IForm>();
  // const onValid = ({ toDo }: IForm) => {
  //   const newToDo = {
  //     id: Date.now(),
  //     text: toDo,
  //   };
  //   setTodos((allBoards) => {
  //     return {
  //       ...allBoards,
  //       [boardId]: [...allBoards[boardId], newToDo],
  //     };
  //   });
  //   setValue("toDo", "");
  // };
  // return (
  //   <Wrapper>
  //     <Title>{boardId}</Title>
  //     <Form onSubmit={handleSubmit(onValid)}>
  //       <input
  //         {...register("toDo", { required: true })}
  //         type="text"
  //         placeholder={`Add task on ${boardId}`}
  //       ></input>
  //       <button>Click me</button>
  //     </Form>
  //     <Droppable droppableId={boardId}>
  //       {(magic, info) => (
  //         <Area
  //           ref={magic.innerRef}
  //           isDraggingOver={info.isDraggingOver}
  //           isDraggingFromThis={Boolean(info.draggingFromThisWith)}
  //           {...magic.droppableProps}
  //         >
  //           {toDos.map((toDo, i) => (
  //             <DragabbleCard
  //               key={toDo.id}
  //               index={i}
  //               toDoId={toDo.id}
  //               toDoText={toDo.text}
  //             />
  //           ))}
  //           {/* {magic.placeholder} */}
  //         </Area>
  //       )}
  //     </Droppable>
  //   </Wrapper>
  // );
  return null;
}

export default Board;
