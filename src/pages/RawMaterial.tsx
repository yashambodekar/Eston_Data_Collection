import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInventory } from '@/context/InventoryContext';
import { toast } from 'sonner';

const RawMaterial = () => {
  const { rawMaterials, addRawMaterial } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    pieces: '',
    quantity: '',
    unit: '',
    supplier: '',
    remarks: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.pieces || !formData.quantity || !formData.unit.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    addRawMaterial({
      name: formData.name.trim(),
      pieces: Number(formData.pieces),
      quantity: Number(formData.quantity),
      unit: formData.unit.trim(),
      supplier: formData.supplier.trim(),
      remarks: formData.remarks.trim(),
    });

    setFormData({
      name: '',
      pieces: '',
      quantity: '',
      unit: '',
      supplier: '',
      remarks: '',
    });

    toast.success('Raw material added successfully!');
  };

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
                <h1 className="text-xl font-semibold text-foreground">Raw Materials</h1>
                <p className="text-sm text-muted-foreground">Manage your inventory</p>
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
                <h2 className="text-lg font-semibold text-foreground">Add New Material</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Material Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Steel Sheet"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pieces">Pieces *</Label>
                    <Input
                      id="pieces"
                      name="pieces"
                      type="number"
                      value={formData.pieces}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1.5"
                    />
                  </div>
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
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="e.g., kg, meters, pieces"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                    className="mt-1.5"
                  />
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
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in">
              <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Package className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Material Inventory</h2>
                  <p className="text-sm text-muted-foreground">{rawMaterials.length} items</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Pieces</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawMaterials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No raw materials yet. Add your first material!
                        </TableCell>
                      </TableRow>
                    ) : (
                      rawMaterials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.name}</TableCell>
                          <TableCell className="text-right">{material.pieces}</TableCell>
                          <TableCell className="text-right">{material.quantity}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell>{material.supplier || '—'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {material.remarks || '—'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RawMaterial;
