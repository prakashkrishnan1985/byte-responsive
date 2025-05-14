import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useKBar } from "kbar";
import { useMyContext } from "../../providers/MyContext";

export default function Search() {
  const { query, disabled } = useKBar((state) => ({
    disabled: state.disabled,
  }));

  
  const { setIsTakeInput } = useMyContext();


  const onClickSearch = (e: any) => {
    setIsTakeInput(false);
    query.toggle();
  };

  return (
    <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
      {!disabled && (
        <OutlinedInput
          size="small"
          id="search"
          placeholder="Search…"
          sx={{ flexGrow: 1 }}
          onClick={onClickSearch}
          startAdornment={
            <InputAdornment position="start" sx={{ color: "text.primary" }}>
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          }
          inputProps={{
            "aria-label": "search",
          }}
        />
      )}
    </FormControl>
  );
}
