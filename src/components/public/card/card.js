import styled, { css } from "styled-components";
import { phone } from "../../../utils/media";

const Card = styled.div`
  max-width: 768px;
  border-radius: 12px;
  box-shadow: 0 43px 39px -40px rgba(0, 0, 0, 0.5);
  background-image: linear-gradient(to bottom, #fbfbfb, #f5f5f5);
  padding: 55px 22px 40px 24px;

  ${phone(css`
    margin: 25px 0;
    padding-left: 0;
    padding-right: 0;
  `)}
`;

export default Card;
