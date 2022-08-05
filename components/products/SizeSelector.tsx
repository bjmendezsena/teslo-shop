import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onSelectedSize: (size: ISize) => void;
}
export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSelectedSize,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          size='small'
          color={size === selectedSize ? "primary" : "info"}
          key={size}
          onClick={() => onSelectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
