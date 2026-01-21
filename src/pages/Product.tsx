import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Boxes, Plus, Package, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useInventory, ProductRawMaterial } from '@/context/InventoryContext';
import { toast } from 'sonner';

const Product = () => {
  const { rawMaterials, products, addProduct } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    assemblyTime: '',
    remarks: '',
  });
  const [selectedMaterials, setSelectedMaterials] = useState<ProductRawMaterial[]>([]);
  const [currentMaterialId, setCurrentMaterialId] = useState('');
  const [currentMaterialQty, setCurrentMaterialQty] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMaterial = () => {
    if (!currentMaterialId || !currentMaterialQty) {
      toast.error('Please select a material and enter quantity');
      return;
    }

    const exists = selectedMaterials.find(m => m.rawMaterialId === currentMaterialId);
    if (exists) {
      toast.error('This material is already added');
      return;
    }

    const material = rawMaterials.find(m => m.id === currentMaterialId);
    if (!material) return;

    setSelectedMaterials(prev => [
      ...prev,
      {
        rawMaterialId: currentMaterialId,
        rawMaterialName: material.name,
        requiredQuantity: Number(currentMaterialQty),
      }
    ]);

    setCurrentMaterialId('');
    setCurrentMaterialQty('');
  };

  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials(prev => prev.filter(m => m.rawMaterialId !== materialId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.quantity || !formData.assemblyTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    addProduct({
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      assemblyTime: Number(formData.assemblyTime),
      remarks: formData.remarks.trim(),
      rawMaterials: selectedMaterials,
    });

    setFormData({
      name: '',
      quantity: '',
      assemblyTime: '',
      remarks: '',
    });
    setSelectedMaterials([]);

    toast.success('Product added successfully!');
  };

  const availableMaterials = rawMaterials.filter(
    m => !selectedMaterials.find(sm => sm.rawMaterialId === m.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Boxes className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Products</h1>
                <p className="text-sm text-muted-foreground">Manage your products</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Plus className="h-5 w-5 text-accent-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Add New Product</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Assembled Frame"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assemblyTime">Assembly Time (min) *</Label>
                    <Input
                      id="assemblyTime"
                      name="assemblyTime"
                      type="number"
                      value={formData.assemblyTime}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Additional notes..."
                    className="mt-1.5 resize-none"
                    rows={2}
                  />
                </div>

                {/* Raw Material Selection */}
                <div className="pt-2 border-t border-border">
                  <Label className="mb-3 block">Raw Materials</Label>
                  
                  <div className="space-y-3">
                    <Select value={currentMaterialId} onValueChange={setCurrentMaterialId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {availableMaterials.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No materials available
                          </SelectItem>
                        ) : (
                          availableMaterials.map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name} ({material.quantity} {material.unit})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={currentMaterialQty}
                        onChange={(e) => setCurrentMaterialQty(e.target.value)}
                        placeholder="Required qty"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddMaterial}
                        disabled={!currentMaterialId || !currentMaterialQty}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected Materials */}
                  {selectedMaterials.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedMaterials.map((material) => (
                        <div
                          key={material.rawMaterialId}
                          className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-foreground">
                            {material.rawMaterialName}
                            <span className="text-muted-foreground ml-2">
                              × {material.requiredQuantity}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(material.rawMaterialId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in">
              <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Boxes className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Product Catalog</h2>
                  <p className="text-sm text-muted-foreground">{products.length} products</p>
                </div>
              </div>

              <div className="p-6">
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No products yet. Create your first product!
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border border-border rounded-lg p-5 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            {product.remarks && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {product.remarks}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {product.assemblyTime} min
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span className="text-muted-foreground">
                            Quantity: <span className="text-foreground font-medium">{product.quantity}</span>
                          </span>
                        </div>

                        {product.rawMaterials.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {product.rawMaterials.map((rm) => (
                              <Badge key={rm.rawMaterialId} variant="secondary">
                                <Package className="h-3 w-3 mr-1" />
                                {rm.rawMaterialName} × {rm.requiredQuantity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
