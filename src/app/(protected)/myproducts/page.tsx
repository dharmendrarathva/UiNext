"use client";

import { useEffect, useState } from "react";
import PolicyToUpload from "@/components/Overlays/PolicyToUpload";

import ProductList from "@/components/ProductComponents/ProductList";
import CreateProduct from "@/components/ProductComponents/CreateProduct";
import EditProduct from "@/components/ProductComponents/EditProduct";

import { Product as ProductCardProduct } from "@/types/Product";
import { Category } from "@/types/Category";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  category: string | Category;
  rejectionReason?: string;
}

export default function MyProducts() {

  const [products, setProducts] = useState<Product[]>([]);
  const [publishedProducts, setPublishedProducts] = useState<ProductCardProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [policyAccepted, setPolicyAccepted] = useState<boolean | null>(null);

  const [filter, setFilter] = useState<
    "ALL" | "APPROVED" | "PENDING" | "DRAFT" | "REJECTED" | "MY_PUBLISHED"
  >("ALL");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
  });

  const filteredProducts =
    filter === "ALL"
      ? products
      : products.filter((p) => p.status === filter);

  async function checkPolicy() {

    try {

      const res = await fetch("/api/users/policy");

      if (!res.ok) {
        setPolicyAccepted(false);
        return;
      }

      const data = await res.json();

      setPolicyAccepted(Boolean(data.policyAccepted));

    } catch {

      setPolicyAccepted(false);

    }

  }

  async function loadCategories() {

    const res = await fetch("/api/admin/cat-management");

    const data = await res.json();

    setCategories(data);

  }

  async function loadProducts() {

    const res = await fetch("/api/users/products");

    const data = await res.json();

    setProducts(data);

  }

  async function loadPublishedProducts() {

    const res = await fetch("/api/products");

    if (!res.ok) return;

    const data = await res.json();

    const myProducts = data.filter((p: any) =>
      products.some((u) => u._id === p._id)
    );

    setPublishedProducts(myProducts);

  }

  useEffect(() => {

    loadProducts();
    loadCategories();
    checkPolicy();

  }, []);

  useEffect(() => {

    if (filter === "MY_PUBLISHED" && publishedProducts.length === 0) {

      loadPublishedProducts();

    }

  }, [filter]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "price"
          ? Number(e.target.value)
          : e.target.value,
    });

  }

  async function createProduct(status: "DRAFT" | "PENDING") {

    await fetch("/api/users/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        status,
      }),
    });

    setCreateModal(false);

    setForm({
      title: "",
      description: "",
      price: 0,
      category: "",
    });

    loadProducts();

  }

  function startEdit(product: Product) {

    setEditingProduct(product);

    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category:
        typeof product.category === "string"
          ? product.category
          : product.category._id,
    });

    setEditModal(true);

  }

  async function updateProduct() {

    if (!editingProduct) return;

    await fetch(`/api/users/products/${editingProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setEditModal(false);
    setEditingProduct(null);

    setForm({
      title: "",
      description: "",
      price: 0,
      category: "",
    });

    loadProducts();

  }

  async function deleteProduct(id: string) {

    await fetch(`/api/users/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();

  }

  async function submitProduct(id: string) {

    await fetch(`/api/users/products/${id}/submit`, {
      method: "PATCH",
    });

    loadProducts();

  }

  return (

    <div className="min-h-screen bg-neutral-950 text-white p-10">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold text-yellow-400">
          My Products
        </h1>

        <PolicyToUpload
          open={showPolicy}
          onClose={() => setShowPolicy(false)}
          onAccepted={() => {
            setShowPolicy(false);
            setPolicyAccepted(true);
            setCreateModal(true);
          }}
        />

        <button
          onClick={() => {
            if (!policyAccepted) {
              setShowPolicy(true);
            } else {
              setCreateModal(true);
            }
          }}
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg font-semibold"
        >
          + Create Product
        </button>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-8">

        {[
          "ALL",
          "APPROVED",
          "PENDING",
          "DRAFT",
          "REJECTED",
          "MY_PUBLISHED",
        ].map((status) => (

          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              filter === status
                ? "bg-yellow-500 text-black"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
          >
            {status === "MY_PUBLISHED" ? "My Published" : status}
          </button>

        ))}

      </div>

      {/* PRODUCT LIST */}

      <ProductList
        filter={filter}
        products={filteredProducts}
        publishedProducts={publishedProducts}
        onEdit={startEdit}
        onDelete={deleteProduct}
        onSubmit={submitProduct}
      />

      {/* CREATE PRODUCT */}

      <CreateProduct
        open={createModal}
        form={form}
        categories={categories}
        onChange={handleChange}
        onClose={() => setCreateModal(false)}
        onDraft={() => createProduct("DRAFT")}
        onSubmit={() => createProduct("PENDING")}
      />

      {/* EDIT PRODUCT */}

      <EditProduct
        open={editModal}
        form={form}
        categories={categories}
        onChange={handleChange}
        onClose={() => setEditModal(false)}
        onUpdate={updateProduct}
      />

    </div>

  );

}