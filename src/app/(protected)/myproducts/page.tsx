// "use client"

// import { useEffect, useState } from "react";
// import PolicyToUpload from "@/components/Overlays/PolicyToUpload";

// import ProductList from "@/components/ProductComponents/ProductList";
// import CreateProduct from "@/components/ProductComponents/CreateProduct";
// import EditProduct from "@/components/ProductComponents/EditProduct";

// import { Product as ProductCardProduct } from "@/types/Product";
// import { Category } from "@/types/Category";

// interface Product {
//   _id: string;
//   title: string;
//   status: string;
//   category: string | Category;
//   rejectionReason?: string;

//   codes?: {
//     html?: string;
//     css?: string;
//     js?: string;
//     react?: string;
//     next?: string;
//     tailwind?: string;
//   };
// }

// export default function MyProducts() {

//   const [products, setProducts] = useState<Product[]>([]);
//   const [publishedProducts, setPublishedProducts] = useState<ProductCardProduct[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [createModal, setCreateModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [showPolicy, setShowPolicy] = useState(false);

//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   const [policyAccepted, setPolicyAccepted] = useState<boolean | null>(null);

//   const [filter, setFilter] = useState<
//     "ALL" | "APPROVED" | "PENDING" | "DRAFT" | "REJECTED" | "MY_PUBLISHED"
//   >("ALL");

//   const [form, setForm] = useState({
//     title: "",
//     category: "",
//     implementation: "HTML",

//     html: "",
//     css: "",
//     js: "",

//     react: "",
//     next: "",
//     tailwind: ""
//   });

//   ////////////////////////////////////////////////////
//   // BUILD CODES OBJECT
//   ////////////////////////////////////////////////////

//   function buildCodes() {

//     if (form.implementation === "HTML") {
//       return {
//         html: form.html,
//         css: form.css,
//         js: form.js
//       };
//     }

//     if (form.implementation === "REACT") {
//       return { react: form.react };
//     }

//     if (form.implementation === "NEXT") {
//       return { next: form.next };
//     }

//     if (form.implementation === "TAILWIND") {
//       return { tailwind: form.tailwind };
//     }

//     return {};
//   }

//   ////////////////////////////////////////////////////
//   // FILTER PRODUCTS
//   ////////////////////////////////////////////////////

//   const filteredProducts =
//     filter === "ALL"
//       ? products
//       : products.filter(p => p.status === filter);

//   ////////////////////////////////////////////////////
//   // POLICY CHECK
//   ////////////////////////////////////////////////////

//   async function checkPolicy() {

//     try {

//       const res = await fetch("/api/users/policy");

//       if (!res.ok) {
//         setPolicyAccepted(false);
//         return;
//       }

//       const data = await res.json();

//       setPolicyAccepted(Boolean(data.policyAccepted));

//     } catch {

//       setPolicyAccepted(false);

//     }

//   }

//   ////////////////////////////////////////////////////
//   // LOAD CATEGORIES
//   ////////////////////////////////////////////////////

//   async function loadCategories() {

//     const res = await fetch("/api/admin/cat-management");

//     const data = await res.json();

//     setCategories(data);

//   }

//   ////////////////////////////////////////////////////
//   // LOAD USER PRODUCTS
//   ////////////////////////////////////////////////////

//   async function loadProducts() {

//     const res = await fetch("/api/users/products");

//     if (!res.ok) return;

//     const data = await res.json();

//     setProducts(data);

//   }

//   ////////////////////////////////////////////////////
//   // LOAD PUBLISHED PRODUCTS
//   ////////////////////////////////////////////////////

//   async function loadPublishedProducts() {

//     const res = await fetch("/api/products");

//     if (!res.ok) return;

//     const data = await res.json();

//     const myProducts = data.filter((p: any) =>
//       products.some(u => u._id === p._id)
//     );

//     setPublishedProducts(myProducts);

//   }

//   ////////////////////////////////////////////////////
//   // INIT
//   ////////////////////////////////////////////////////

//   useEffect(() => {

//     loadProducts();
//     loadCategories();
//     checkPolicy();

//   }, []);

//   useEffect(() => {

//     if (filter === "MY_PUBLISHED" && publishedProducts.length === 0) {
//       loadPublishedProducts();
//     }

//   }, [filter]);

//   ////////////////////////////////////////////////////
//   // FORM CHANGE
//   ////////////////////////////////////////////////////

// function handleChange(e:any){

//   if(e.target.name === "bulk"){

//     setForm(prev => ({
//       ...prev,
//       ...e.target.value
//     }));

//     return;
//   }

//   setForm(prev => ({
//     ...prev,
//     [e.target.name]: e.target.value
//   }));

// }

//   ////////////////////////////////////////////////////
//   // CREATE PRODUCT
//   ////////////////////////////////////////////////////

//   async function createProduct(status: "DRAFT" | "PENDING") {

//     const codes = buildCodes();

//     await fetch("/api/users/products", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: form.title,
//         category: form.category,
//         status,
//         codes
//       })
//     });

//     setCreateModal(false);

//     setForm({
//       title: "",
//       category: "",
//       implementation: "HTML",

//       html: "",
//       css: "",
//       js: "",

//       react: "",
//       next: "",
//       tailwind: ""
//     });

//     loadProducts();

//   }

//   ////////////////////////////////////////////////////
//   // START EDIT
//   ////////////////////////////////////////////////////

// function startEdit(product: Product) {

//   setEditingProduct(product);

//   const codes = product.codes || {};

//   let implementation: "HTML" | "TAILWIND" = "HTML";

//   if (codes.tailwind) {
//     implementation = "TAILWIND";
//   }

//   setForm({
//     title: product.title,
//     category:
//       typeof product.category === "string"
//         ? product.category
//         : product.category._id,

//     implementation,

//     html: codes.html || "",
//     css: codes.css || "",
//     js: codes.js || "",

//     react: codes.react || "",
//     next: codes.next || "",
//     tailwind: codes.tailwind || ""
//   });

//   setEditModal(true);
// }

//   ////////////////////////////////////////////////////
//   // UPDATE PRODUCT
//   ////////////////////////////////////////////////////

//   async function updateProduct() {

//     if (!editingProduct) return;

//     const codes = buildCodes();

//     await fetch(`/api/users/products/${editingProduct._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: form.title,
//         category: form.category,
//         codes
//       })
//     });

//     setEditModal(false);
//     setEditingProduct(null);

//     loadProducts();

//   }

//   ////////////////////////////////////////////////////
//   // DELETE PRODUCT
//   ////////////////////////////////////////////////////

//   async function deleteProduct(id: string) {

//     await fetch(`/api/users/products/${id}`, {
//       method: "DELETE"
//     });

//     loadProducts();

//   }

//   ////////////////////////////////////////////////////
//   // SUBMIT PRODUCT
//   ////////////////////////////////////////////////////

//   async function submitProduct(id: string) {

//     await fetch(`/api/users/products/${id}/submit`, {
//       method: "PATCH"
//     });

//     loadProducts();

//   }

//   ////////////////////////////////////////////////////
//   // UI
//   ////////////////////////////////////////////////////

//   return (

//     <div className="min-h-screen bg-neutral-950 text-white p-10">

//       <div className="flex justify-between items-center mb-10">

//         <h1 className="text-3xl font-bold text-yellow-400">
//           My Products
//         </h1>

//         <PolicyToUpload
//           open={showPolicy}
//           onClose={() => setShowPolicy(false)}
//           onAccepted={() => {
//             setShowPolicy(false);
//             setPolicyAccepted(true);
//             setCreateModal(true);
//           }}
//         />

//         <button
//           onClick={() => {
//             if (!policyAccepted) {
//               setShowPolicy(true);
//             } else {
//               setCreateModal(true);
//             }
//           }}
//           className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg font-semibold"
//         >
//           + Create Product
//         </button>

//       </div>

//       {/* FILTERS */}

//       <div className="flex flex-wrap gap-3 mb-8">

//         {[
//           "ALL",
//           "APPROVED",
//           "PENDING",
//           "DRAFT",
//           "REJECTED",
//           "MY_PUBLISHED"
//         ].map(status => (

//           <button
//             key={status}
//             onClick={() => setFilter(status as any)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition
//             ${
//               filter === status
//                 ? "bg-yellow-500 text-black"
//                 : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
//             }`}
//           >
//             {status === "MY_PUBLISHED" ? "My Published" : status}
//           </button>

//         ))}

//       </div>

//       {/* PRODUCT LIST */}

//       <ProductList
//         filter={filter}
//         products={filteredProducts}
//         publishedProducts={publishedProducts}
//         onEdit={startEdit}
//         onDelete={deleteProduct}
//         onSubmit={submitProduct}
//       />

//       {/* CREATE MODAL */}

//       <CreateProduct
//         open={createModal}
//         form={form}
//         categories={categories}
//         onChange={handleChange}
//         onClose={() => setCreateModal(false)}
//         onDraft={() => createProduct("DRAFT")}
//         onSubmit={() => createProduct("PENDING")}
//       />

//       {/* EDIT MODAL */}
        
//       <EditProduct
//         open={editModal}
//         form={form}
//         categories={categories}
//         onChange={handleChange}
//         onClose={() => setEditModal(false)}
//         onUpdate={updateProduct}
//       />

//     </div>

//   );

// }











"use client";

import { useEffect, useState } from "react";

import PolicyToUpload from "@/components/Overlays/PolicyToUpload";
import ProductList from "@/components/ProductComponents/ProductList";
import CreateProduct from "@/components/ProductComponents/CreateProduct";
import EditProduct from "@/components/ProductComponents/EditProduct";

import { Product as ProductCardProduct } from "@/types/Product";
import { Category } from "@/types/Category";
import { FormState, ImplementationType } from "@/types/FormState";

//////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////

interface Product {
  _id: string;
  title: string;
  status: string;
  category: string | Category;
  rejectionReason?: string;

  codes?: {
    html?: string;
    css?: string;
    js?: string;
    tailwind?: string;
  };
}

//////////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////////

export default function MyProducts() {

  ////////////////////////////////////////////////////
  // STATE
  ////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////
  // FORM
  ////////////////////////////////////////////////////

  const initialForm: FormState = {
    title: "",
    category: "",
    implementation: "HTML",

    html: "",
    css: "",
    js: "",

    tailwind: ""
  };

  const [form, setForm] = useState<FormState>(initialForm);

  ////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////

  function buildCodes() {
    if (form.implementation === "HTML") {
      return {
        html: form.html,
        css: form.css,
        js: form.js
      };
    }

    if (form.implementation === "TAILWIND") {
      return {
        tailwind: form.tailwind
      };
    }

    return {};
  }

  ////////////////////////////////////////////////////
  // API CALLS
  ////////////////////////////////////////////////////

  async function loadProducts() {
    const res = await fetch("/api/users/products");
    if (!res.ok) return;

    const data = await res.json();
    setProducts(data);
  }

  async function loadCategories() {
    const res = await fetch("/api/admin/cat-management");
    const data = await res.json();
    setCategories(data);
  }

  async function loadPublishedProducts() {
    const res = await fetch("/api/products");
    if (!res.ok) return;

    const data = await res.json();

    const myProducts = data.filter((p: any) =>
      products.some(u => u._id === p._id)
    );

    setPublishedProducts(myProducts);
  }

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

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////
  // FORM HANDLER
  ////////////////////////////////////////////////////

  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name === "bulk") {
      setForm(prev => ({ ...prev, ...value }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  ////////////////////////////////////////////////////
  // CRUD
  ////////////////////////////////////////////////////

  async function createProduct(status: "DRAFT" | "PENDING") {
    const codes = buildCodes();

    await fetch("/api/users/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        category: form.category,
        status,
        codes
      })
    });

    setCreateModal(false);
    setForm(initialForm);
    loadProducts();
  }

  function startEdit(product: Product) {

    setEditingProduct(product);

    const codes = product.codes || {};

    let implementation: ImplementationType = "HTML";

    if (codes.tailwind) implementation = "TAILWIND";

    setForm({
      title: product.title,
      category:
        typeof product.category === "string"
          ? product.category
          : product.category._id,

      implementation,

      html: codes.html || "",
      css: codes.css || "",
      js: codes.js || "",

      tailwind: codes.tailwind || ""
    });

    setEditModal(true);
  }

async function updateProduct(status: "DRAFT" | "PENDING") {

  if (!editingProduct) return;

  const codes = buildCodes();

  await fetch(`/api/users/products/${editingProduct._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: form.title,
      category: form.category,
      codes,
      status // ✅ important
    })
  });

  setEditModal(false);
  setEditingProduct(null);
  loadProducts();
}
  async function deleteProduct(id: string) {
    await fetch(`/api/users/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function submitProduct(id: string) {
    await fetch(`/api/users/products/${id}/submit`, { method: "PATCH" });
    loadProducts();
  }

  ////////////////////////////////////////////////////
  // FILTER
  ////////////////////////////////////////////////////

  const filteredProducts =
    filter === "ALL"
      ? products
      : products.filter(p => p.status === filter);

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">

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
            if (!policyAccepted) setShowPolicy(true);
            else setCreateModal(true);
          }}
          className="bg-yellow-500 px-5 py-2 rounded-lg font-semibold"
        >
          + Create Product
        </button>

      </div>

      <div className="flex flex-wrap gap-3 mb-8">

        {[
          "ALL",
          "APPROVED",
          "PENDING",
          "DRAFT",
          "REJECTED",
          "MY_PUBLISHED"
        ].map(status => (

          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === status
                ? "bg-yellow-500 text-black"
                : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {status === "MY_PUBLISHED" ? "My Published" : status}
          </button>

        ))}

      </div>

      <ProductList
        filter={filter}
        products={filteredProducts}
        publishedProducts={publishedProducts}
        onEdit={startEdit}
        onDelete={deleteProduct}
        onSubmit={submitProduct}
      />

      <CreateProduct
        open={createModal}
        form={form}
        categories={categories}
        onChange={handleChange}
        onClose={() => setCreateModal(false)}
        onDraft={() => createProduct("DRAFT")}
        onSubmit={() => createProduct("PENDING")}
      />

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