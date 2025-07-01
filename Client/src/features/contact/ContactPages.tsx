import { decrement, increment, rest } from "./counterReducer";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { UseAppDispatch, UseAppSelector } from "../../app/store/hook";

export default function ContactPages() {
  const { data } = UseAppSelector((state) => state.counter);
  const dispatch = UseAppDispatch();
  return (
    <>
      <Typography variant="h6">contactPages</Typography>
      <Typography variant="body1">This is a data count:{data}</Typography>
      <ButtonGroup>
        <Button color="primary" onClick={() => dispatch(increment(1))}>
          Increment
        </Button>
        <Button color="secondary" onClick={() => dispatch(decrement(1))}>
          Decrement
        </Button>
        <Button color="info" onClick={() => dispatch(rest(0))}>
          Reset
        </Button>
        <Button color="primary" onClick={() => dispatch(increment(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
}
