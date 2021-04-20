import styled from '@emotion/styled';

export const StyledInput = styled.input`
  width: 350px;
  outline: none;
  color: #ff3864;
  font-family: 'Texturina', serif;
  font-size: 1.1rem;
  border: 2px solid #ff3864;
  border-radius: 5px;
  background-color: transparent;
  margin-bottom: 15px;
  padding: 12px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;
