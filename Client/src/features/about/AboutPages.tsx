import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValitationErrorQuery,
} from "./errorApi";
import { useState } from "react";

export default function AboutPages() {
  const [validation, setvalidation] = useState<string[]>([]);

  const [trigger400Error] = useLazyGet400ErrorQuery();
  const [trigger401Error] = useLazyGet401ErrorQuery();
  const [trigger404Error] = useLazyGet404ErrorQuery();
  const [trigger500Error] = useLazyGet500ErrorQuery();
  const [triggerValidationError] = useLazyGetValitationErrorQuery();

  const getValidationError = async () => {
    // debugger
    try {
      await triggerValidationError().unwrap();
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
      ) {
        const errorArray = (error as { message: string }).message.split(",");
        setvalidation(errorArray);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography gutterBottom variant="h3">
        Errot types
      </Typography>
      <ButtonGroup fullWidth>
        <Button variant="contained" onClick={() => trigger400Error()}>
          Error 400{" "}
        </Button>
        <Button
          variant="contained"
          onClick={() => trigger401Error().catch((err) => console.log(err))}
        >
          Error 401{" "}
        </Button>
        <Button
          variant="contained"
          onClick={() => trigger404Error().catch((err) => console.log(err))}
        >
          Error 404{" "}
        </Button>
        <Button
          variant="contained"
          onClick={() => trigger500Error().catch((err) => err)}
        >
          Error 500{" "}
        </Button>
        <Button variant="contained" onClick={getValidationError}>
          validation error{" "}
        </Button>
      </ButtonGroup>
      {validation.length > 0 && (
        <Alert severity="error">
          <AlertTitle>validation error</AlertTitle>
          <List>
            {validation.map((error) => (
              <ListItemText key={error}>{error}</ListItemText>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
