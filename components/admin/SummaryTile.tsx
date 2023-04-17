import { CreditCardOffOutlined } from "@mui/icons-material";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import React from "react";

interface SummaryTileProps {
  title: string | number;
  subtitle: string;
  icon: JSX.Element;
}

export const SummaryTile: React.FC<SummaryTileProps> = ({
  icon,
  subtitle,
  title,
}) => {
  const renderIcon = () => {
    const { sx, ...props } = icon.props;
    const customSx = {
      fontSize: 40,
    };

    // Return icon with custom styles
    return React.cloneElement(icon, {
      sx: { ...sx, ...customSx },
      ...props,
    });
  };

  return (
    <Grid item xs={12} md={3} sm={4}>
      <Card
        sx={{
          display: "flex",
        }}
      >
        <CardContent
          sx={{
            width: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderIcon()}
        </CardContent>
        <CardContent
          sx={{
            flex: "1 0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant='h3'>{title}</Typography>
          <Typography variant='caption'>{subtitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
