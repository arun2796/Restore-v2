import { Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";


export default function ServerError() {
  const location = useLocation();
  const error = location.state.error;
  return (
    <Paper>
      {error ? (
        <>
          <Typography
            gutterBottom
            variant="h4"
            color="primary"
            sx={{ px: 4, pt: 3 }}
          >
            {error.title}
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ p: 3 }}>
            {error.detail}
          </Typography>
        </>
      ) : (
        <Typography variant="h5"> server error </Typography>
      )}
    </Paper>
  );
}
