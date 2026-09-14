import { Container } from "@mui/material";
import { PropsWithoutRef } from "react";
import { wrapper } from "../app/store";
import ErrorView from "../features/error/ErrorView";

const Error = (props: PropsWithoutRef<{ statusCode?: number }>) => {
  const { statusCode = 500 } = props;
  return (<Container maxWidth="xl">
    <ErrorView message={`Error (${statusCode})`} errorCode={statusCode} />
  </Container>)
}

export const getServerSideProps = wrapper.getServerSideProps(({ res }) => {
  const statusCode = res?.statusCode ?? 500;

  return {
    props: {
      statusCode
    }
  }
})

export default Error;