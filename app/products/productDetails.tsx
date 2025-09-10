import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product, getImageUrl } from "./productList";

interface ProductDetailsProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetails({ product, open, onOpenChange }: ProductDetailsProps) {
  const imageUrl = getImageUrl(product);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Product Image Section */}
              <div className="relative w-full aspect-square max-w-md">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      console.error(`Failed to load image: ${imageUrl}`);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-semibold text-primary">
                  ${product.price.toFixed(2)}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <span className="text-sm">Category: {product.category?.name || "Uncategorized"}</span>
                </div>
              </div>

              <Separator />

              {/* Details Section */}
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{product.detail}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Additional Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Product ID: {product.id}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 