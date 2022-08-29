import React from "react";
import { ArcherElement } from "react-archer";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { IMsg, MsgOpenTypes, msgOpenTypeState, msgsState } from "../atoms";
import Content from "./Content";

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
      ? props.theme.msgColor_back_title
      : props.isDragging
      ? "transparent"
      : props.theme.msgColor_back};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${(props) => (props.isDragging ? "" : "10px 0")};
  /* padding: ${(props) => (props.isDragging ? "20px 8px" : "10px 8px")}; */
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;

  border: 1px solid black;
  transition: background-color 0.3s ease-in-out;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 800;
  font-size: 20px;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.msgColor_back_title};
`;
// const Contents = styled.div`
//   flex-direction: column;
//   align-items: center;
//   width: 100%;
//   background-color: pink;
// `;

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
  padding: 2px;
  background-color: ${(props) => props.theme.msgColor_back};
  border: 1px solid ${(props) => props.theme.msgColor_back_title};
  border-radius: ${(props) => props.theme.msgEle_border_radius};
  text-align: center;
  :hover {
    background-color: lightgray;
    cursor: pointer;
  }
`;
const SonBtn = styled(Son)``;

interface IMsgProps {
  id: number;
  parent_id: number;
  inMsg_index: number;
  name: string;
  content_ment: string;
  content_memo: string;
  content_syst: string;
  content_work: string;
}
//row_seq, parent_id는 바로 상위에서 처리
function Msg({
  id,
  parent_id,
  inMsg_index,
  name,
  content_ment,
  content_memo,
  content_syst,
  content_work,
}: IMsgProps) {
  const [msgs, setMsgs] = useRecoilState(msgsState);
  const msgOpenType = useRecoilValue(msgOpenTypeState);

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
        content_ment: "추가메세지",
        content_memo: "",
        content_syst: "",
        content_work: "",
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
    <>
      {msgOpenType === MsgOpenTypes.max ? (
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

              {content_work !== "" ? (
                <Content msgType="업무" msgCore={content_work} />
              ) : null}
              {content_syst !== "" ? (
                <Content msgType="전산" msgCore={content_syst} />
              ) : null}
              {content_ment !== "" ? (
                <Content msgType="멘트" msgCore={content_ment} />
              ) : null}
              {content_memo !== "" ? (
                <Content msgType="메모" msgCore={content_memo} />
              ) : null}

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
      ) : (
        <div></div>
      )}
    </>
  );
}

export default React.memo(Msg);
