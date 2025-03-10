import { useState } from "react";
import { roundToNearestThirtyMinutes } from "@/utils/timeUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Package, Clock, Settings } from "lucide-react";
import { JobType, Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProductsPage() {
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    jobType: "Digital Printing",
    productionTime: 60,
  });

  // Sample product data
  const products: Product[] = [
    {
      id: "1",
      name: "Business Cards",
      jobType: "Digital Printing",
      description: "Standard business cards in various sizes and finishes",
      productionTime: 120,
      setupTime: 30,
      finishingTime: 15,
    },
    {
      id: "2",
      name: "Brochures",
      jobType: "Digital Printing",
      description: "Tri-fold or bi-fold brochures on premium paper stock",
      productionTime: 240,
      setupTime: 45,
      finishingTime: 60,
    },
    {
      id: "3",
      name: "Flyers",
      jobType: "Digital Printing",
      description: "Single or double-sided flyers in various sizes",
      productionTime: 180,
      setupTime: 30,
      finishingTime: 30,
    },
    {
      id: "4",
      name: "Posters",
      jobType: "Wide Format",
      description: "Large format posters for indoor or outdoor use",
      productionTime: 300,
      setupTime: 60,
      finishingTime: 45,
    },
    {
      id: "5",
      name: "Banners",
      jobType: "Wide Format",
      description: "Vinyl banners with grommets for easy hanging",
      productionTime: 360,
      setupTime: 90,
      finishingTime: 120,
    },
    {
      id: "6",
      name: "T-Shirts",
      jobType: "Screen Printing",
      description: "Screen printed t-shirts with custom designs",
      productionTime: 480,
      setupTime: 120,
      finishingTime: 60,
    },
    {
      id: "7",
      name: "Custom Hats",
      jobType: "Embroidery",
      description: "Embroidered hats with custom logos",
      productionTime: 240,
      setupTime: 60,
      finishingTime: 30,
    },
    {
      id: "8",
      name: "Transfer Prints",
      jobType: "DTF",
      description: "Direct to film transfer prints for apparel",
      productionTime: 180,
      setupTime: 45,
      finishingTime: 30,
    },
  ];

  const jobTypes: JobType[] = [
    "Digital Printing",
    "Wide Format",
    "Screen Printing",
    "DTF",
    "Embroidery",
  ];

  const filteredProducts =
    selectedJobType === "all"
      ? products
      : products.filter((product) => product.jobType === selectedJobType);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [id]:
        id === "productionTime" || id === "setupTime" || id === "finishingTime"
          ? roundToNearestThirtyMinutes(parseInt(value) || 0) // Ensure 30-min increments
          : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProduct = () => {
    // In a real app, this would save to a database
    console.log("Adding new product:", newProduct);
    setShowAddProductDialog(false);
    // Reset form
    setNewProduct({
      jobType: "Digital Printing",
      productionTime: 60,
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage products and production time specifications
          </p>
        </div>
        <Button onClick={() => setShowAddProductDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedJobType}
          onValueChange={setSelectedJobType}
        >
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            {jobTypes.map((jobType) => (
              <TabsTrigger key={jobType} value={jobType}>
                {jobType}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </div>
              <CardDescription>{product.jobType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{product.description}</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Production Time:
                  </span>
                  <span className="font-medium">
                    {product.productionTime} minutes
                  </span>
                </div>
                {product.setupTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Setup Time:</span>
                    <span className="font-medium">
                      {product.setupTime} minutes
                    </span>
                  </div>
                )}
                {product.finishingTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Finishing Time:
                    </span>
                    <span className="font-medium">
                      {product.finishingTime} minutes
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span className="font-medium">
                    {product.productionTime +
                      (product.setupTime || 0) +
                      (product.finishingTime || 0)}{" "}
                    minutes
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product with production time specifications
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Product Name
              </Label>
              <Input
                id="name"
                value={newProduct.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobType" className="text-right">
                Job Type
              </Label>
              <Select
                value={newProduct.jobType}
                onValueChange={(value) => handleSelectChange("jobType", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((jobType) => (
                    <SelectItem key={jobType} value={jobType}>
                      {jobType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProduct.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productionTime" className="text-right">
                Production Time (min, in 30-min increments)
              </Label>
              <Input
                id="productionTime"
                type="number"
                value={newProduct.productionTime || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setupTime" className="text-right">
                Setup Time (min, in 30-min increments)
              </Label>
              <Input
                id="setupTime"
                type="number"
                value={newProduct.setupTime || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="finishingTime" className="text-right">
                Finishing Time (min, in 30-min increments)
              </Label>
              <Input
                id="finishingTime"
                type="number"
                value={newProduct.finishingTime || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newProduct.notes || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddProductDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
