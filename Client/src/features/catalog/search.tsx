import { debounce, TextField } from "@mui/material";
import { UseAppDispatch, UseAppSelector } from "../../app/store/store";
import { setSearchName } from "./catalogslice";
import { useEffect, useState } from "react";

export default function Search() {
  const { searchName } = UseAppSelector((state) => state.catalog);
  const dispatch = UseAppDispatch();
  const [term, setTerm] = useState(searchName);

  useEffect(() => {
    setTerm(searchName);
  }, [searchName]);

  const debouncedSearch = debounce((term) => {
    dispatch(setSearchName(term.target.value));
  } ,500);

  return (
    <TextField
      variant="outlined"
      label="search product"
      fullWidth
      type="search"
      value={term}
      onChange={(x) => {
        setTerm(x.target.value);
        debouncedSearch(x);
      }}
    />
  );
}
