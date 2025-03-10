import { useState, useEffect } from "react";
import { roundToNearestThirtyMinutes } from "@/utils/timeUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobType, Product } from "@/types/product";
import { JobProduct } from "@/types/job";
import { Plus, Trash2 } from "lucide-react";

interface ProductSelectorProps {
  onProductsChange: (products: JobProduct[]) => void;
  initialProducts?: JobProduct[];
}

export default function ProductSelector({
  onProductsChange,
  initialProducts = [],
}: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] =
    useState<JobProduct[]>(initialProducts);
  const [currentProduct, setCurrentProduct] = useState<Partial<JobProduct>>({
    productType: "",
    quantity: 1,
    productionTime: 0,
  });

  // Sample product data - in a real app, this would come from an API or database
  const productCatalog: Product[] = [
    {
      id: "1",
      name: "Business Cards",
      jobType: "Digital Printing",
      description: "Standard business cards in various sizes and finishes",
      productionTime: 120, // 2 hours
      setupTime: 30, // 30 minutes
      finishingTime: 30, // 30 minutes (adjusted to 30-min increment)
    },
    {
      id: "2",
      name: "Brochures",
      jobType: "Digital Printing",
      description: "Tri-fold or bi-fold brochures on premium paper stock",
      productionTime: 240, // 4 hours
      setupTime: 30, // 30 minutes (adjusted to 30-min increment)
      finishingTime: 60, // 1 hour
    },
    {
      id: "3",
      name: "Flyers",
      jobType: "Digital Printing",
      description: "Single or double-sided flyers in various sizes",
      productionTime: 180, // 3 hours
      setupTime: 30, // 30 minutes
      finishingTime: 30, // 30 minutes (adjusted to 30-min increment)
    },
    {
      id: "4",
      name: "Posters",
      jobType: "Wide Format",
      description: "Large format posters for indoor or outdoor use",
      productionTime: 300, // 5 hours
      setupTime: 60, // 1 hour
      finishingTime: 30, // 30 minutes (adjusted to 30-min increment)
    },
    {
      id: "5",
      name: "Banners",
      jobType: "Wide Format",
      description: "Vinyl banners with grommets for easy hanging",
      productionTime: 360, // 6 hours
      setupTime: 90, // 1.5 hours
      finishingTime: 120, // 2 hours
    },
    {
      id: "6",
      name: "T-Shirts",
      jobType: "Screen Printing",
      description: "Screen printed t-shirts with custom designs",
      productionTime: 480, // 8 hours
      setupTime: 120, // 2 hours
      finishingTime: 60, // 1 hour
    },
    {
      id: "7",
      name: "Custom Hats",
      jobType: "Embroidery",
      description: "Embroidered hats with custom logos",
      productionTime: 240, // 4 hours
      setupTime: 60, // 1 hour
      finishingTime: 30, // 30 minutes
    },
    {
      id: "8",
      name: "Transfer Prints",
      jobType: "DTF",
      description: "Direct to film transfer prints for apparel",
      productionTime: 180, // 3 hours
      setupTime: 30, // 30 minutes (adjusted to 30-min increment)
      finishingTime: 30, // 30 minutes (adjusted to 30-min increment)
    },
  ];

  const jobTypes: JobType[] = [
    "Digital Printing",
    "Wide Format",
    "Screen Printing",
    "DTF",
    "Embroidery",
  ];

  // Filter products by selected job type
  const [selectedJobType, setSelectedJobType] = useState<JobType | "">("");
  const filteredProducts = selectedJobType
    ? productCatalog.filter((product) => product.jobType === selectedJobType)
    : [];

  const handleAddProduct = () => {
    if (!currentProduct.productType || !currentProduct.quantity) return;

    // Find the product in the catalog to get its production times
    const productDetails = productCatalog.find(
      (p) => p.name === currentProduct.productType,
    );

    if (!productDetails) return;

    const newProduct: JobProduct = {
      productType: currentProduct.productType,
      quantity: currentProduct.quantity || 1,
      productionTime: roundToNearestThirtyMinutes(
        productDetails.productionTime,
      ),
      setupTime: productDetails.setupTime,
      finishingTime: productDetails.finishingTime,
    };

    const updatedProducts = [...selectedProducts, newProduct];
    setSelectedProducts(updatedProducts);
    onProductsChange(updatedProducts);

    // Reset current product
    setCurrentProduct({
      productType: "",
      quantity: 1,
      productionTime: 0,
    });
    setSelectedJobType("");
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  const handleProductSelect = (productName: string) => {
    const productDetails = productCatalog.find((p) => p.name === productName);
    if (!productDetails) return;

    setCurrentProduct({
      productType: productName,
      quantity: 1,
      productionTime: roundToNearestThirtyMinutes(
        productDetails.productionTime,
      ),
    });
  };

  const calculateTotalTime = (product: JobProduct): number => {
    return (
      product.productionTime +
      (product.setupTime || 0) +
      (product.finishingTime || 0)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
          <CardDescription>
            Select products to include in this job
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select
                value={selectedJobType}
                onValueChange={(value) => setSelectedJobType(value as JobType)}
              >
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product</Label>
              <Select
                value={currentProduct.productType}
                onValueChange={handleProductSelect}
                disabled={!selectedJobType}
              >
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.map((product) => (
                    <SelectItem key={product.id} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={currentProduct.quantity || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: parseInt(e.target.value) || 1,
                    // Ensure production time is in 30-min increments
                    productionTime: currentProduct.productionTime
                      ? roundToNearestThirtyMinutes(
                          currentProduct.productionTime,
                        )
                      : 0,
                  })
                }
                disabled={!currentProduct.productType}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddProduct}
                disabled={
                  !currentProduct.productType || !currentProduct.quantity
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Products</CardTitle>
            <CardDescription>Products included in this job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{product.productType}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {product.quantity} • Total Time:{" "}
                      {calculateTotalTime(product)} minutes
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex justify-between">
              <span className="font-medium">Total Production Time:</span>
              <span className="font-bold">
                {selectedProducts.reduce(
                  (total, product) => total + calculateTotalTime(product),
                  0,
                )}{" "}
                minutes
              </span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
