"use client";

import React, { useState } from "react";
import { Product, ProductCardsProps, getImageUrl } from "./productList";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductDetails from "./productDetails";

const ProductCards: React.FC<ProductCardsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const imageUrl = getImageUrl(product);
          
          return (
            <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      console.error(`Failed to load image: ${imageUrl}`);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-sm text-muted-foreground">No image available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">
                    {product.name}
                  </h3>
                  <span className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewDetails(product)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  );
};

export default ProductCards;
