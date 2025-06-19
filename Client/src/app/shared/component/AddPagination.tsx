import { Box, Pagination, Typography } from "@mui/material";
import type { IPagination } from "../../models/Pagination";

type prpos = {
  metadata: IPagination;
  onChangePage: (page: number) => void;
};

export default function AddPagination({ metadata, onChangePage }: prpos) {
  const { currentPage, totalPages, totalCount, pageSize } = metadata;
  const startItem = (currentPage - 1) * pageSize + 1;
  const enditem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      marginTop={3}
    >
      <Typography>
        Display {startItem}-{enditem} of {totalCount} items
      </Typography>
      <Pagination
        color="secondary"
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onChangePage(page)}
      />
    </Box>
  );
}
