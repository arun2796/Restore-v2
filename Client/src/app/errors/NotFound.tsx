import { SearchOff } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <Paper
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 5,
      }}
    >
      <SearchOff sx={{ fontSize: 100 }} color="primary" />
      <Typography gutterBottom variant="h3">
        we could not find any data
      </Typography>
      <Button component={Link} to="/catalog">
        Go back to Catalog
      </Button>
    </Paper>
  );
}
