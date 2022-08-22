import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { scnrState } from "./atoms";
import Board from "./components/Board";
import Step from "./components/Step";

const Wrapper = styled.div`
  display: flex;
  max-width: 90vw;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;

function App() {
  const [scnr, setScnr] = useRecoilState(scnrState);
  const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
    console.log(destination, source);
    // if (!destination) return;
    // if (destination.droppableId !== source.droppableId) {
    //   setScnr((allBoards) => {
    //     const sourceBoard = [...allBoards[source.droppableId]];
    //     const taskObj = sourceBoard[source.index];
    //     const destBoard = [...allBoards[destination.droppableId]];

    //     sourceBoard.splice(source.index, 1);
    //     destBoard.splice(destination.index, 0, taskObj);

    //     return {
    //       ...allBoards,
    //       [source.droppableId]: sourceBoard,
    //       [destination.droppableId]: destBoard,
    //     };
    //   });
    // } else {
    //   setScnr((allBoards) => {
    //     const sourceBoard = [...allBoards[source.droppableId]];
    //     const taskObj = sourceBoard[source.index];
    //     sourceBoard.splice(source.index, 1);
    //     sourceBoard.splice(destination.index, 0, taskObj);

    //     return {
    //       ...allBoards,
    //       [source.droppableId]: sourceBoard,
    //     };
    //   });
    // }
  };
  let result = [];
  for (let i = 1; i <= Object.keys(scnr).length; i++) {
    const elements = [];
    elements.push(scnr[`c${i}`]);
    elements.push(scnr[`c${i + 1}`]);
    result.push(elements);
  }
  // console.log("sdsdsdsd");
  // console.log(result);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Columns>
          {result.map((col, colSeq) => (
            <Step
              key={`s${colSeq}`}
              msgsHere={col[0]}
              msgsNext={col[1]}
              stepSeq={colSeq + 1}
            />
          ))}
          {/* {Object.keys(scnr).map((col, index) => (
            <Step
              msgsHere={scnr[`c${index}`]}
              msgsNext={scnr[`c${index + 1}`]}
              stepNum={+col.replace("c", "")}
            />
          ))} */}
          {/* {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))} */}
        </Columns>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
