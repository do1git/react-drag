import styled from "styled-components";

interface IContent {
  msgType: string;
  msgCore: string;
}
export default function Content({ msgType, msgCore }: IContent) {
  const Wrapper = styled.div`
    width: 100%;
    display: flex;
    padding: 2px 10px;
  `;
  const Title = styled.div<{ type: string }>`
    background-color: ${(props) => {
      switch (props.type) {
        case "업무":
          return props.theme.msgColor_content_work;
        case "멘트":
          return props.theme.msgColor_content_ment;
        case "전산":
          return props.theme.msgColor_content_syst;
        case "메모":
          return props.theme.msgColor_content_memo;
        default:
          return "black";
      }
    }};
    color: white;
    font-weight: bold;
    height: 20px;
    width: 70px;
    padding: 10px;
    margin-right: 5px;
    border-radius: ${(props) => props.theme.msgEle_border_radius};
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const Core = styled.div`
    color: black;
    width: 120px;
  `;

  return (
    <Wrapper>
      <Title type={msgType}>{msgType}</Title>
      <Core>{msgCore}</Core>
    </Wrapper>
  );
}
