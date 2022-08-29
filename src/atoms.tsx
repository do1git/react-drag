import { any } from "prop-types";
import { atom, selector, useRecoilValue } from "recoil";

export interface IMsg {
  id: number;
  parent_id: number;
  inMsg_index: number;
  name: string;

  content_work: string;
  content_ment: string;
  content_memo: string;
  content_syst: string;

  parent_row_seq?: number;
  step_index?: number;
  row_index?: number;
}

export const scnrSelector = selector({
  key: "generatedScnr",
  get: ({ get }) => {
    const generatedScnr: IMsg[][][] = [];
    const msgsData = get(msgsState);

    //주어진 id의 자식인 IMsg array반환
    const sons = (id: number) => {
      return msgsData
        .filter((msg) => msg.parent_id === id)
        .sort((a, b) => a.inMsg_index - b.inMsg_index);
    };

    //첫번쨰msg
    const firstMsg = sons(0);
    generatedScnr[0] = [firstMsg];

    let beforeStepI = 0;
    let newStep: IMsg[][] = [];
    let allEmpty = true;
    while (1) {
      // if(idsInStep(beforeStep).)
      //아이디를 리스트로 받아서 자식들 안나오면 중지/.
      allEmpty = true;
      for (
        let prntMsgGrpI = 0;
        prntMsgGrpI < generatedScnr[beforeStepI].length;
        prntMsgGrpI++
      ) {
        for (
          let prntMsgI = 0;
          prntMsgI < generatedScnr[beforeStepI][prntMsgGrpI].length;
          prntMsgI++
        ) {
          const sonsGrp = sons(
            generatedScnr[beforeStepI][prntMsgGrpI][prntMsgI].id
          );
          if (sonsGrp.length === 0) {
            newStep.push([]);
          } else {
            allEmpty = false;
            newStep.push(sonsGrp);
          }
        }
      }
      if (allEmpty) {
        break;
      }
      generatedScnr.push(newStep);
      newStep = [];
      beforeStepI++;
    }
    console.log(generatedScnr);
    return generatedScnr;
  },
});

export const msgsState = atom<IMsg[]>({
  key: "msgs",
  default: [
    {
      id: 1,
      parent_id: 0,
      inMsg_index: 0,
      name: "시작1-1-1",
      content_ment: "안녕하세요 고객님 어떤일이세요?",
      content_memo: "",
      content_syst: "",
      content_work: "",
      // parent_row_seq: 0,
      // step_index: 1,
      // row_index: 1,
    },
    {
      id: 2,
      parent_id: 3,
      inMsg_index: 0,
      name: "상담해주세요im2-1-1",
      content_ment: "오프라인 업무도와드릴까요?",
      content_memo: "",
      content_syst: "",
      content_work: "",
      // parent_row_seq: 1,
      // step_index: 2,
      // row_index: 1,
    },
    {
      id: 3,
      parent_id: 1,
      inMsg_index: 0,
      name: "ars로 바꿔주세요im2-1-2",
      content_ment: "보이는ars? 누르는ars?",
      content_memo: "",
      content_syst: "",
      content_work: "",
    },
    {
      id: 5,
      parent_id: 2,
      inMsg_index: 0,
      name: "오프라인상담-은행im3-1-1",
      content_ment: "은행위치 알려줄까?",
      content_memo: "",
      content_syst: "",
      content_work: "",
    },
    {
      id: 4,
      parent_id: 2,
      inMsg_index: 1,
      name: "오프라인상담-출장im3-1-2",
      content_ment: "시간언제 괜찮으세요?",
      content_memo: "",
      content_syst: "",
      content_work: "",
    },
    {
      id: 6,
      parent_id: 3,
      inMsg_index: 1,
      name: "종료im3-2-1?",
      content_ment: "잘가세요 멘트에용 잘가",
      content_memo: "잘가세요 메모입니다",
      content_syst: "잘가세요 전산내용확인필요",
      content_work: "잘가세요 일이에요 업무 ㅠㅠ",
    },
  ],
});

export enum MsgOpenTypes {
  "max" = "max",
  "min" = "min",
}

export const msgOpenTypeState = atom<MsgOpenTypes>({
  key: "openType",
  default: MsgOpenTypes.max,
});
