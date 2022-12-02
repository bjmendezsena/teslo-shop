import { FC } from "react";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

interface Props {
  currentValue: number;
  onUpdateQuantity: (quantity: number) => void;
  maxValue: number;
}
export const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue,
  onUpdateQuantity,
}) => {

  
  const addOrRemove = (value: number) => {
    if (value === -1) {
      if (currentValue === 1) return;
      return onUpdateQuantity(currentValue - 1);
    }

    if (currentValue >= maxValue) return;
    onUpdateQuantity(currentValue + 1);
  };
  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography
        sx={{
          width: 40,
          textAlign: "center",
        }}
        variant='body2'
      >
        {currentValue}
      </Typography>
      <IconButton onClick={() => addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
