import React from "react";
import { Box, Typography } from "@mui/material";
const WishlistItems = React.lazy(() => import("../components/WishlistItems"));

export default function Wishlist() {
  return (
    <Box
      sx={{
        marginBlock: 5,
        marginTop: 15,
        width: "70%",
        marginInline: "auto",
        minHeight: "90vh",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          marginBottom: 1,
        }}
      >
        Wishlist
      </Typography>
      <WishlistItems />
    </Box>
  );
}
