import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
}
export const SizeSelector: FC<Props> = ({ selectedSize, sizes }) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          size='small'
          color={size === selectedSize ? "primary" : "info"}
          key={size}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
