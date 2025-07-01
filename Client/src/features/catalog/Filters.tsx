import { Button, Paper } from "@mui/material";

import { Box } from "@mui/system";
import Search from "./search";
import RadioButtonGroup from "../../app/shared/component/RadioButtonGroup";
import { UseAppDispatch, UseAppSelector } from "../../app/store/hook";
import { setBrands, setOrderBy, setresetParams, setType } from "./catalogslice";
import CheckboxButton from "../../app/shared/component/CheckboxButton";

const sortoption = [
  {
    value: "name",
    label: "Alphabetical",
  },
  {
    value: "pricedesc",
    label: "price high to low",
  },
  {
    value: "price",
    label: "price low to high",
  },
];
type prpos = {
  filterdata: {
    brand: string[];
    type: string[];
  };
};

export default function Filters({ filterdata: data }: prpos) {
  const { orderBy, brands, types } = UseAppSelector((state) => state.catalog);
  const dispatch = UseAppDispatch();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Paper>
        <Search />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <RadioButtonGroup
          option={sortoption}
          selectedvalue={orderBy}
          onchange={(e) => dispatch(setOrderBy(e.target.value))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButton
          items={data.brand}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButton
          items={data.type}
          checked={types}
          onChange={(item: string[]) => dispatch(setType(item))}
        />
      </Paper>
      <Button onClick={() => dispatch(setresetParams())}>Rest filter</Button>
    </Box>
  );
}
