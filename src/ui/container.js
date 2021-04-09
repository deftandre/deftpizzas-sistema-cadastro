import styled from "styled-components";

const Container = styled.div`
    background-color: ${({ theme }) => theme.palette.primary.dark};
    padding: ${({ theme }) => theme.spacing(8)}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-height: 100vh;
`;

export default Container;
