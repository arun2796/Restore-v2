import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { ChangeEvent } from "react";


type Prpos = {
  option: { value: string; label: string }[];
  onchange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedvalue: string;
};

export default function RadioButtonGroup({
  option,
  onchange, 
  selectedvalue,
}: Prpos) {
  return (
    <FormControl>
      <RadioGroup onChange={onchange} value={selectedvalue} sx={{ my: 3 }}>
        {option.map(({ value, label }) => ( 
          <FormControlLabel
            key={label}
            control={<Radio color="secondary" sx={{ py: 0.7 }} />}
            value={value}
            label={label}
            
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
