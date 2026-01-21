import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RawMaterial {
  id: string;
  name: string;
  pieces: number;
  quantity: number;
  unit: string;
  supplier: string;
  remarks: string;
}

export interface ProductRawMaterial {
  rawMaterialId: string;
  rawMaterialName: string;
  requiredQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  assemblyTime: number;
  remarks: string;
  rawMaterials: ProductRawMaterial[];
}

interface InventoryContextType {
  rawMaterials: RawMaterial[];
  products: Product[];
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Initial hardcoded data
const initialRawMaterials: RawMaterial[] = [
  {
    id: '1',
    name: 'Steel Sheet',
    pieces: 100,
    quantity: 500,
    unit: 'kg',
    supplier: 'MetalWorks Inc.',
    remarks: 'Grade A quality'
  },
  {
    id: '2',
    name: 'Aluminum Rod',
    pieces: 50,
    quantity: 200,
    unit: 'meters',
    supplier: 'AlumCorp',
    remarks: 'Standard diameter'
  },
  {
    id: '3',
    name: 'Copper Wire',
    pieces: 200,
    quantity: 1000,
    unit: 'meters',
    supplier: 'WireTech',
    remarks: 'High conductivity'
  }
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(initialRawMaterials);
  const [products, setProducts] = useState<Product[]>([]);

  const addRawMaterial = (material: Omit<RawMaterial, 'id'>) => {
    const newMaterial: RawMaterial = {
      ...material,
      id: Date.now().toString()
    };
    setRawMaterials(prev => [...prev, newMaterial]);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  return (
    <InventoryContext.Provider value={{ rawMaterials, products, addRawMaterial, addProduct }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
