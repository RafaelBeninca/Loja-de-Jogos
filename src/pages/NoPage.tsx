import { Box, Typography } from "@mui/material";

export default function NoPage() {
  return (
    <Box
      sx={{
        width: "70%",
        marginInline: "auto",
        marginTop: 15,
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="body1">
        A página que você está procurando não existe.
      </Typography>
    </Box>
  );
}
