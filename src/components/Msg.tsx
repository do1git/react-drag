import React from "react";
import { ArcherElement } from "react-archer";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { IMsg, msgsState } from "../atoms";

interface IWrapperProps {
  isDragging: boolean;
  draggingOver: boolean;
  combineTargetFor: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  /* width: 200px; */
  width: 200px;
  min-height: 180px;
  background-color: ${(props) =>
    props.combineTargetFor
      ? "purple"
      : props.isDragging
      ? "transparent"
      : props.theme.msgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${(props) => (props.isDragging ? "" : "10px 0")};
  padding: ${(props) => (props.isDragging ? "20px 8px" : "10px 8px")};
  border-radius: 10px;
  box-sizing: border-box;

  :hover {
    background-color: yellow;
  }
  border: 1px solid black;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 800;
  font-size: 20px;
  width: 100%;
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

  border-radius: 10px;
  padding: 10px 10px;
`;

interface ISonResult {
  aId: string;
  title: string;
}
const Son = styled.div<{ isDragging?: boolean }>`
  margin: 10px 0;
  width: 100%;
  background-color: #a29bfe;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
`;
const SonBtn = styled(Son)``;

interface IMsgProps {
  id: number;
  parent_id: number;
  inMsg_index: number;
  name: string;
  content: string;
}
//row_seq, parent_id는 바로 상위에서 처리
function Msg({ id, parent_id, inMsg_index, name, content }: IMsgProps) {
  const [msgs, setMsgs] = useRecoilState(msgsState);
  //자식찾기
  const findMySons = (parentId: number) => {
    return msgs
      .filter((msg) => msg.parent_id === parentId)
      .sort((a, b) => a.inMsg_index - b.inMsg_index);
  };
  const sonsArray = findMySons(id);
  const sonsResult: ISonResult[] = [];
  if (sonsArray !== []) {
    for (let i = 0; i < sonsArray.length; i++) {
      const data = { aId: `${sonsArray[i].id}`, title: sonsArray[i].name };
      sonsResult.push(data);
    }
  }

  const onClickAddBtn = (e: any) => {
    const toParentId = parseInt(e.target.dataset.id);
    setMsgs((msgs) => {
      let oldMsgs = [...msgs].sort((a, b) => b.id - a.id);
      const newId = oldMsgs[0].id + 1;
      const inMsg_index = oldMsgs.filter(
        (msgs) => msgs.parent_id === toParentId
      ).length;
      oldMsgs.push({
        id: newId,
        parent_id: toParentId,
        inMsg_index: inMsg_index,
        name: `new and my id is ${newId}`,
        content: `은행위치 알려줄까?`,
      });
      console.log(oldMsgs);
      return oldMsgs;
    });
  };

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

  const onClickDelBtn = (e: any) => {
    const fromId = parseInt(e.target.dataset.id);
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
  };

  return (
    <Draggable
      draggableId={`drag-${id}`}
      index={inMsg_index}
      isDragDisabled={id === 1 ? true : false}
    >
      {(magic, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          draggingOver={Boolean(snapshot.draggingOver)}
          combineTargetFor={Boolean(snapshot.combineTargetFor)}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <ArcherElement id={`aT${id}`}>
            <Title>{name}</Title>
          </ArcherElement>

          <hr />
          <Content>{content}</Content>
          <hr />
          {`drag-${id} // seq: ${inMsg_index}`}
          <Sons>
            {sonsResult.length !== 0 ? (
              sonsResult.map((son) => (
                <ArcherElement
                  key={`aS${son.aId}`}
                  id={`aS${son.aId}`}
                  relations={[
                    {
                      targetId: `aT${son.aId}`,
                      targetAnchor: "left",
                      sourceAnchor: "right",
                    },
                  ]}
                >
                  <Son>{son.title}</Son>
                </ArcherElement>
              ))
            ) : (
              <></>
            )}
            <SonBtn onClick={onClickAddBtn} data-id={id}>
              추가하기
            </SonBtn>
            <SonBtn onClick={onClickDelBtn} data-id={id}>
              삭제하기
            </SonBtn>
          </Sons>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Msg);
