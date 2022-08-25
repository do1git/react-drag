import { useRef } from "react";
import { ArcherContainer } from "react-archer";
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
  const [msgs, setMsgs] = useRecoilState(msgsState);

  const scnr = useRecoilValue<IMsg[][][]>(scnrSelector);

  const findMySons = (myId: number) => {
    return msgs.filter((msg) => msg.parent_id === myId);
  };
  const findMyParent = (myId: number) => {
    return msgs.filter((msg) => msg.id === myId)[0].parent_id;
  };

  const archerRef = useRef<any>(null);
  archerRef.current?.refreshScreen();

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
    console.log(`combine?!${combine !== null}`);
    //Case#0 도착지는 절대 step index = 0 불가
    if (destination?.droppableId.split("drop-")[1] === "0") {
      console.log("첫번째 기둥은 못가여 ^^");
      return;
    }

    //Case#1 결합시(자식이 될때)
    if (combine) {
      console.log("combine!!!!!!!!!!!");
      const fromId = parseInt(draggableId.split("drag-")[1]);
      const fromParentId = parseInt(source.droppableId.split("drop-")[1]);
      const toParentId = parseInt(combine.draggableId.split("drag-")[1]);
      const fromInMsgIndex = source.index;
      const toInMsgIndex = findMySons(toParentId).length;
      const toId = parseInt(combine.draggableId.split("drag-")[1]);
      console.log(
        fromId,
        fromParentId,
        toParentId,
        fromInMsgIndex,
        toInMsgIndex
      );

      console.log("combine");
      //자기가 자기 자손 밑으로 갈 경우 금지
      let ancestorId = toId;
      let iligalFlag = false;
      while (ancestorId !== 1) {
        ancestorId = findMyParent(ancestorId);
        if (ancestorId === fromId) {
          console.log("ILLIGAL 자식 부모 역전 ㄴㄴ");
          iligalFlag = true;
          return;
        }
      }
      console.log("test needed");
      console.log(destination?.droppableId);
      console.log(toParentId);
      if (fromParentId === toParentId) {
        console.log("부모에게 접근금지");
        iligalFlag = true;
      }
      if (iligalFlag) {
        return;
      }

      setMsgs((msgs) => {
        let oldMsgs = [...msgs];
        let inMsgIndexChangedMsgs: IMsg[] = [];
        //from이미존재하는거 수정 내부에서 inMsg인덱스만 수정
        oldMsgs
          .filter(
            (msgs) =>
              msgs.parent_id === fromParentId &&
              msgs.inMsg_index > fromInMsgIndex
          )
          .map((msg) => {
            console.log("pityFrom", msg.id);
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
              msgs.parent_id === toParentId && msgs.inMsg_index > toInMsgIndex
          )
          .map((msg) => {
            console.log("pityTo", msg.id);
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

        return [...oldMsgs, ...inMsgIndexChangedMsgs];
      });
    }
    // 제자리 이동시(예외처리)
    if (!destination) {
      console.log("목적지가 없어여");
      return;
    }
    //같은곳에서 이동시
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
    }
    //다른곳으로 이동시
    if (source.droppableId !== destination.droppableId) {
      console.log("different area");
      const fromId = parseInt(draggableId.split("drag-")[1]);
      const fromParentId = parseInt(source.droppableId.split("drop-")[1]);
      const toParentId = parseInt(destination.droppableId.split("drop-")[1]);
      const fromInMsgIndex = source.index;
      const toInMsgIndex = destination.index;
      const toId = parseInt(draggableId.split("drag-")[1]);

      console.log(
        fromId,
        fromParentId,
        toParentId,
        fromInMsgIndex,
        toInMsgIndex,
        toId
      );
      // //부모의 자식의 자식이 될수없다
      // if (findMySons(fromId).find((son) => son.parent_id === fromId)) {
      //   console.log(
      //     "ILLIGAL",
      //     findMySons(fromId).find((son) => son.parent_id === fromId)
      //   );
      //   return;
      // } else {}
      //자기가 자기 자손 밑인 라인으로 갈 경우 금지
      let ancestorId = toParentId;
      let iligalFlag = false;
      //부모가 직속자식의 형재가 될때
      if (ancestorId === fromId) {
        console.log("ILLIGAL 자식 부모 역전 ㄴㄴ 직속");
        iligalFlag = true;
      }
      while (ancestorId !== 1) {
        ancestorId = findMyParent(ancestorId);
        if (ancestorId === fromId) {
          console.log("ILLIGAL 자식 부모 역전 ㄴㄴ");
          iligalFlag = true;
          return;
        }
      }
      console.log("test needed2");
      console.log(destination?.droppableId);
      console.log(toParentId);
      if (fromParentId === toParentId) {
        console.log("부모가 이하레벨로 내려가기 금지");
        iligalFlag = true;
      }
      if (iligalFlag) {
        return;
      }
      setMsgs((msgs) => {
        let oldMsgs = [...msgs];
        let inMsgIndexChangedMsgs: IMsg[] = [];
        //from이미존재하는거 수정 내부에서 inMsg인덱스만 수정
        oldMsgs
          .filter(
            (msgs) =>
              msgs.parent_id === fromParentId &&
              msgs.inMsg_index > fromInMsgIndex
          )
          .map((msg) => {
            console.log("pityFrom", msg.id);
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
              msgs.parent_id === toParentId && msgs.inMsg_index > toInMsgIndex
          )
          .map((msg) => {
            console.log("pityTo", msg.id);
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

        return [...oldMsgs, ...inMsgIndexChangedMsgs];
      });
    }
  };
  ////
  return (
    <ArcherContainer noCurves={true} strokeColor="black" ref={archerRef}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          {scnr.map((step, stepIndex) => (
            <Step key={`s${stepIndex}`} msgsGrps={step} stepIndex={stepIndex} />
          ))}
        </Wrapper>
      </DragDropContext>
    </ArcherContainer>
  );
}

export default App;
