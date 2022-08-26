import { useEffect, useRef } from "react";
import { ArcherContainer } from "react-archer";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { IMsg, msgsState, scnrSelector } from "./atoms";
import Step from "./components/Step";

const Wrapper = styled.div`
  width: 100vw;
  height: 95vh;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
interface ITrashCanProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const TrahCan = styled.div<ITrashCanProps>`
  width: 50px;
  height: 50px;
  background-color: red;
  color: black;
  border-radius: 10%;
  opacity: ${(props) => (props.isDraggingOver ? "1" : "0.3")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const archerRef = useRef<any>(null);
  console.log("**********RERENDER*********");
  archerRef.current?.refreshScreen();
  useEffect(() => {}, [ArcherContainer]);
  const [msgs, setMsgs] = useRecoilState(msgsState);

  const scnr = useRecoilValue<IMsg[][][]>(scnrSelector);

  /**
   *
   * @param myId 대상 아이디
   * @returns myId의 자식array
   */
  const findMySons = (myId: number) => {
    return msgs.filter((msg) => msg.parent_id === myId);
  };

  /**
   *
   * @param myId 대상 아이디
   * @returns myId의 부모 (1개임)
   */
  const findMyParent = (myId: number) => {
    return msgs.filter((msg) => msg.id === myId)[0].parent_id;
  };
  /**
   *
   * @param myId 대상 아이디array
   * @do 찾은 자식을 삭제
   * @returns killedSonIds myId의 자식id array
   */
  const findMySonsAndKill = (myIds: number[]) => {
    const killedSonIds: number[] = [];
    //자식있으면 다 버리기
    myIds.forEach((myId) => {
      setMsgs((msgs) => {
        let oldMsgs = [...msgs];
        oldMsgs
          .filter((msgs) => msgs.parent_id === myId)
          .map((msg) => {
            killedSonIds.push(msg.id);
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
          });
        return oldMsgs;
      });
    });
    if (killedSonIds.length !== 0) {
      findMySonsAndKill(killedSonIds);
    }
    return killedSonIds;
  };

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

    //Case trashCan
    if (destination?.droppableId === "trashCan") {
      const fromId = parseInt(draggableId.split("drag-")[1]);
      //자식삭제후
      findMySonsAndKill([fromId]);
      //대상 fromId도 삭제
      setMsgs((msgs) => {
        let oldMsgs = [...msgs];
        oldMsgs
          .filter((msgs) => msgs.id === fromId)
          .map((msg) => {
            const indexInOldMsgs = oldMsgs.indexOf(msg);
            oldMsgs.splice(indexInOldMsgs, 1);
          });
        return oldMsgs;
      });
      return;
    }

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
    //Case#2 제자리 이동시(예외처리)
    if (!destination) {
      console.log("목적지가 없어여");
      return;
    }
    //Case#3 같은곳에서 이동시
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
    //Case#4다른곳으로 이동시
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
              msgs.parent_id === toParentId && msgs.inMsg_index >= toInMsgIndex
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
  return (
    <ArcherContainer noCurves={true} strokeColor="black" ref={archerRef}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          {scnr.map((step, stepIndex) => (
            <Step key={`s${stepIndex}`} msgsGrps={step} stepIndex={stepIndex} />
          ))}
        </Wrapper>
        <Droppable droppableId={`trashCan`} isCombineEnabled>
          {(magic, info) => (
            <TrahCan
              ref={magic.innerRef}
              isDraggingOver={info.isDraggingOver}
              isDraggingFromThis={Boolean(info.draggingFromThisWith)}
              {...magic.droppableProps}
            >
              Trash
            </TrahCan>
          )}
        </Droppable>
      </DragDropContext>
    </ArcherContainer>
  );
}

export default App;
