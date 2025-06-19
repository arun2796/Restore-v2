import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

type prpos = {
  items: string[];
  checked: string[];
  onChange: (item: string[]) => void;
};

export default function CheckboxButton({ items, checked, onChange }: prpos) {
  const [checkedItems, setcheckedItems] = useState(checked);

  useEffect(() => {
    setcheckedItems(checked);
  }, [checked]);

  const handleToggle = (lowercase: string) => {
    const UpdateChecked = checkedItems?.includes(lowercase)
      ? checkedItems.filter((item) => item !== lowercase)
      : [...checkedItems, lowercase];
    setcheckedItems(UpdateChecked);
    onChange(UpdateChecked);
  };

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={checkedItems.includes(item)}
              onClick={() => handleToggle(item)}
              color="secondary"
              sx={{ py: 0.7, fontSize: 40 }}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
}
