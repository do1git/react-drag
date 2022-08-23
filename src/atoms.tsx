import { any } from "prop-types";
import { atom, selector, useRecoilValue } from "recoil";

interface IGeneratedScnr {
  [key: string]: IMsg[][];
}

export interface IMsg {
  id: number;
  parent_id: number;
  inMsg_index: number;
  name: string;
  content: string;

  parent_row_seq?: number;
  step_index?: number;
  row_index?: number;
}

export const scnrSelector = selector({
  key: "generatedScnr",
  get: ({ get }) => {
    const generatedScnr: IGeneratedScnr = {};
    const msgsData = get(msgsState);

    //첫번쨰msg
    let temp_parentId = 0;
    const firstMsg = [
      ...msgsData.filter((msg) => msg.parent_id === temp_parentId),
    ][0];
    generatedScnr["s0"] = [
      [...msgsData.filter((msg) => msg.parent_id === temp_parentId)],
    ];
    ///////////
    let sons: IMsg[];
    let cussin: any = [];
    let beforeStep = 0;

    for (let i = 0; i < 12; i++) {
      for (
        let prntMsgGrpI = 0;
        prntMsgGrpI < generatedScnr["s" + beforeStep].length;
        prntMsgGrpI++
      ) {
        generatedScnr["s" + (beforeStep + 1)] = [];
        generatedScnr["s" + beforeStep][prntMsgGrpI].forEach((parentMsg) => {
          // temp_parentId = generatedScnr["s"+beforeStep]
          sons = msgsData
            .filter((msg) => msg.parent_id === parentMsg.id)
            .sort((a, b) => a.inMsg_index - b.inMsg_index);
          if (sons) {
            cussin.push(sons);
          }
          sons = [];
        });
        console.log(cussin);
        generatedScnr["s" + (beforeStep + 1)].push(cussin);
        cussin = [];
        console.log(generatedScnr["s" + beforeStep]);
      }
      //여기서 beforeStep업데이트
      console.log("special", "s", beforeStep + 1);
      console.log(generatedScnr["s" + (beforeStep + 1)][0]);
      console.log(generatedScnr["s" + (beforeStep + 1)][0]);
      console.log(generatedScnr);
      console.log("--------------------------");
      if (generatedScnr["s" + (beforeStep + 1)][0].length === 0) {
        break;
      }

      beforeStep++;
    }
    console.log("generatedScnr");
    console.log(generatedScnr);
    return generatedScnr;
  },
});

// for (let i = 0; i < msgsData.length; i++) {
//   generatedScnr["s" + beforeStep].map(
//     //s0할때 s1 array생성
//     // generatedScnr["s" + (beforeStep + 1)]=[]as any

//     (parentMsgGrp, gParentMsgGrp_inMsg_index) => {
//       parentMsgGrp.map((parent, parent_inMsg_index) => {
//         temp_parentId = parent.id;
//         sons = msgsData
//           .filter((msg) => msg.parent_id === temp_parentId)
//           .sort((a, b) => a.inMsg_index - b.inMsg_index);
//         console.log(sons);
//         cussin.push(sons);
//       });

//       console.log("gParentMsgGrp_inMsg_index", gParentMsgGrp_inMsg_index);
//       console.log("cussin");
//       console.log(cussin);
//       break;
//       // if (generatedScnr["s" + (beforeStep + 1)]) {
//       //   generatedScnr["s" + (beforeStep + 1)].push(cussin);
//       // } else {
//       //   console.log("????");
//       //   generatedScnr["s" + (beforeStep + 1)] = cussin;
//       // }

//       // generatedScnr["s" + (beforeStep + 1)].push(cussin);
//     }
//   );
// }

////////
// console.log("generatedScnr");
// console.log(generatedScnr);

export const msgsState = atom<IMsg[]>({
  key: "msgs",
  default: [
    {
      id: 1,
      parent_id: 0,
      inMsg_index: 1,
      name: "시작1-1-1",
      content: "안녕하세요 고객님 어떤일이세요?",
      // parent_row_seq: 0,
      // step_index: 1,
      // row_index: 1,
    },
    {
      id: 2,
      parent_id: 1,
      inMsg_index: 1,
      name: "상담해주세요im2-1-1",
      content: "오프라인 업무도와드릴까요?",
      // parent_row_seq: 1,
      // step_index: 2,
      // row_index: 1,
    },
    {
      id: 3,
      parent_id: 1,
      inMsg_index: 2,
      name: "ars로 바꿔주세요im2-1-2",
      content: "보이는ars? 누르는ars?",
      // parent_row_seq: 1,
      // step_index: 2,
      // row_index: 2,
    },
    {
      id: 5,
      parent_id: 2,
      inMsg_index: 1,
      name: "오프라인상담-은행im3-1-1",
      content: "은행위치 알려줄까?",
      // parent_row_seq: 1,
      // step_index: 3,
      // row_index: 1,
    },
    {
      id: 4,
      parent_id: 2,
      inMsg_index: 2,
      name: "오프라인상담-출장im3-1-2",
      content: "시간언제 괜찮으세요?",
      // parent_row_seq: 1,
      // step_index: 3,
      // row_index: 2,
    },
    {
      id: 6,
      parent_id: 3,
      inMsg_index: 1,
      name: "종료im3-2-1?",
      content: "잘가세요",
      // parent_row_seq: 2,
      // step_index: 3,
      // row_index: 3,
    },
  ],
});

// export const msgsState = atom<IMsg[]>({
//   key: "msgs",
//   default: [
//     {
//       id: 1,
//       parent_row_seq: 0,
//       inMsg_index: 1,
//       name: "시작1-1-1",
//       content: "안녕하세요 고객님 어떤일이세요?",
//       parent_id: 0,
//       step_index: 1,
//       row_index: 1,
//     },
//     {
//       id: 2,
//       parent_row_seq: 1,
//       inMsg_index: 1,
//       name: "상담해주세요im2-1-1",
//       content: "오프라인 업무도와드릴까요?",
//       parent_id: 1,
//       step_index: 2,
//       row_index: 1,
//     },
//     {
//       id: 3,
//       parent_row_seq: 1,
//       inMsg_index: 2,
//       name: "ars로 바꿔주세요im2-1-2",
//       content: "보이는ars? 누르는ars?",
//       parent_id: 1,
//       step_index: 2,
//       row_index: 2,
//     },
//     {
//       id: 5,
//       parent_row_seq: 1,
//       inMsg_index: 1,
//       name: "오프라인상담-은행im3-1-1",
//       content: "은행위치 알려줄까?",
//       parent_id: 2,
//       step_index: 3,
//       row_index: 1,
//     },
//     {
//       id: 4,
//       parent_row_seq: 1,
//       inMsg_index: 2,
//       name: "오프라인상담-출장im3-1-2",
//       content: "시간언제 괜찮으세요?",
//       parent_id: 2,
//       step_index: 3,
//       row_index: 2,
//     },
//     {
//       id: 6,
//       parent_row_seq: 2,
//       inMsg_index: 1,
//       name: "종료im3-2-1?",
//       content: "잘가세요",
//       parent_id: 3,
//       step_index: 3,
//       row_index: 3,
//     },
//   ],
// });
