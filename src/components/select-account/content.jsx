import styled from "styled-components";

const SelectAccountContent = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  button.unlock {
    width: 228px;
    margin-top: 24px;
  }

  input.account {
    margin-right: 16px;
  }

  th div.header {
    margin-right: 12px;
  }

  .pagination {
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    .prev,
    .next {
      width: 128px;
      border: none;
      color: ${(props) => props.theme.colors.green};
    }
  }
`;

export default SelectAccountContent;
