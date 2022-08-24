import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { markAsUntransferable } from "worker_threads";
import { IMsg, msgsState, scnrSelector } from "./atoms";
import Board from "./components/Board";
import Step from "./components/Step";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

function App() {
  const setMsgs = useSetRecoilState(msgsState);
  const scnr = useRecoilValue<IMsg[][][]>(scnrSelector);

  const onDragEnd = ({
    destination,
    draggableId,
    source,
    combine,
  }: DropResult) => {
    console.log("+++++++++++++++++++++++++++");
    console.log(source, "-->", destination);
    console.log("draggableId?-->", draggableId);
    console.log("combine?-->", combine);
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      console.log("같은곳에서 순서변경");
      const fromId = parseInt(draggableId.split("drag-")[1]);
      const parentId = parseInt(source.droppableId.split("drop-")[1]);
      const fromInMsgIndex = source.index;
      const toInMsgIndex = destination.index;

      setMsgs((msgs) => {
        let oldMsgs = [...msgs];

        //이미존재하는거 수정
        oldMsgs.map((msg) => {
          if (msg.parent_id === parentId && msg.inMsg_index === toInMsgIndex) {
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
            oldMsgs.push({ ...msg, inMsg_index: fromInMsgIndex });
          }
        });
        //드래그한 메세지
        oldMsgs.map((msg) => {
          if (msg.id === fromId) {
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
            oldMsgs.push({ ...msg, inMsg_index: toInMsgIndex });
          }
        });
        return oldMsgs;
      });
    } else if (source.droppableId !== destination.droppableId) {
      console.log("different area");
      const fromId = parseInt(draggableId.split("drag-")[1]);
      const fromParentId = parseInt(source.droppableId.split("drop-")[1]);
      const toParentId = parseInt(destination.droppableId.split("drop-")[1]);
      const fromInMsgIndex = source.index;
      const toInMsgIndex = destination.index;

      setMsgs((msgs) => {
        let oldMsgs = [...msgs];
        let inMsgIndexChangedMsgs: IMsg[] = [];
        //TO이미존재하는거 수정 내부에서 inMsg인덱스만 수정
        oldMsgs
          .filter(
            (msgs) =>
              msgs.parent_id === fromParentId &&
              msgs.inMsg_index <= fromInMsgIndex
          )
          .map((msg) => {
            console.log("pity", msg.id);
            const originalInMsgIndex = msg.inMsg_index;
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
            inMsgIndexChangedMsgs.push({
              ...msg,
              inMsg_index: originalInMsgIndex - 1,
            });
          });

        //TO이미존재하는거 수정 내부에서 inMsg인덱스만 수정
        oldMsgs
          .filter(
            (msgs) =>
              msgs.parent_id === toParentId && msgs.inMsg_index <= toInMsgIndex
          )
          .map((msg) => {
            console.log("pity", msg.id);
            const originalInMsgIndex = msg.inMsg_index;
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
            inMsgIndexChangedMsgs.push({
              ...msg,
              inMsg_index: originalInMsgIndex + 1,
            });
          });

        oldMsgs.map((msg) => {
          if (
            msg.parent_id === toParentId &&
            msg.inMsg_index === toInMsgIndex
          ) {
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
            oldMsgs.push({
              ...msg,
              inMsg_index: fromInMsgIndex,
            });
          }
        });
        //드래그한 메세지
        oldMsgs.map((msg) => {
          if (msg.id === fromId) {
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
            oldMsgs.push({
              ...msg,
              parent_id: toParentId,
              inMsg_index: toInMsgIndex,
            });
          }
        });

        console.log("inMsgIndexChanfedMsgs finished");
        console.log(inMsgIndexChangedMsgs);
        console.log("calculation finished");
        console.log([...oldMsgs, ...inMsgIndexChangedMsgs]);
        return [...oldMsgs, ...inMsgIndexChangedMsgs];
      });
    }
  };
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        {scnr.map((step, stepIndex) => (
          <Step key={`s${stepIndex}`} msgsGrps={step} stepIndex={stepIndex} />
        ))}
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
