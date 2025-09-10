"use client";

import React from "react";
import { Container, Box } from "@mui/material";
import { ShoppingBasket } from "lucide-react";

export default function Home() {
  return (
    <Container>
      <Box sx={{ my: 8 }}>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <ShoppingBasket className="h-16 w-16 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Shoppy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your one-stop shop for all your needs. Browse our products and find what you're looking for.
          </p>
        </div>
      </Box>
    </Container>
  );
}
