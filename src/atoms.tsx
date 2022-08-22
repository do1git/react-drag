import { atom, selector, useRecoilValue } from "recoil";

interface IScnrState {
  [key: string]: IMsg[];
  //property as string, and string array
}

export interface IMsg {
  id: number;
  name: string;
  sort_parent: number;
  sort_me: number;
  content: string;
  parent_id: number;
  sort_seq: number;
}

// export const childMsgSelector = (id: number) => {
//   const childSelector = selector({
//     key: "childMsg",
//     get: ({ get }) => {
//       const scnr = get(scnrState);
//       // 인자로 받은 부모 id에 대한 자식들
//       // [{name:"후손", id:"23"},{name:"후손", id:"23"}]
//       return [
//         { name: "후손", id: "23" },
//         { name: "후손2", id: "24" },
//       ];
//     },
//   });
//   return useRecoilValue(childSelector);
// };

export const scnrState = atom<IScnrState>({
  key: "toDo",
  default: {
    c1: [
      {
        id: 1,
        sort_parent: 0,
        sort_me: 1,
        name: "시작1-1-1",
        content: "안녕하세요 고객님 어떤일이세요?",
        parent_id: 0,
        sort_seq: 1,
      },
    ],
    c2: [
      {
        id: 2,
        sort_parent: 1,
        sort_me: 1,
        name: "상담해주세요im2-1-1",
        content: "오프라인 업무도와드릴까요?",
        parent_id: 1,
        sort_seq: 1,
      },
      {
        id: 3,
        sort_parent: 1,
        sort_me: 2,
        name: "ars로 바꿔주세요im2-1-2",
        content: "보이는ars? 누르는ars?",
        parent_id: 1,
        sort_seq: 2,
      },
    ],
    c3: [
      {
        id: 5,
        sort_parent: 1,
        sort_me: 1,
        name: "오프라인상담-은행im3-1-1",
        content: "은행위치 알려줄까?",
        parent_id: 2,
        sort_seq: 1,
      },
      {
        id: 4,
        sort_parent: 1,
        sort_me: 2,
        name: "오프라인상담-출장im3-1-2",
        content: "시간언제 괜찮으세요?",
        parent_id: 2,
        sort_seq: 2,
      },
      {
        id: 6,
        sort_parent: 2,
        sort_me: 1,
        name: "종료im3-2-1?",
        content: "잘가세요",
        parent_id: 3,
        sort_seq: 3,
      },
    ],
  },
});
