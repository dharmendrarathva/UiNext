

// import { notFound } from "next/navigation";
// import ProductCard from "@/components/ProductComponents/ProductCard";

// async function getProducts(slug: string) {
//   const res = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/category/${slug}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) return null;

//   return res.json();
// }

// export default async function CategoryPage({
//   params,
// }: {
//   params: Promise<{ "category-slug": string }>;
// }) {

//   const { "category-slug": slug } = await params;

//   const data = await getProducts(slug);

//   if (!data) return notFound();

//   const products = data.products;

//   return (

//     <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

//       <div className="mb-12">

//         <h1 className="text-3xl md:text-4xl font-bold">
//           {data.category.name}
//         </h1>

//         <p className="text-neutral-400 mt-2">
//           Browse models in this category.
//         </p>

//       </div>

//       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

//         {products.map((p: any) => (
//           <ProductCard key={p._id} product={p} />
//         ))}

//       </div>

//       {products.length === 0 && (
//         <p className="text-neutral-500 mt-10">
//           No products found in this category.
//         </p>
//       )}

//     </div>
//   );
// }






import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductComponents/ProductCard";

async function getProducts(slug: string) {

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/category/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  return res.json();

}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ "category-slug": string }>;
}) {

  const { "category-slug": slug } = await params;

  const data = await getProducts(slug);

  if (!data) return notFound();

  const products = data.products ?? [];

  return (

    <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

      <div className="mb-12">

        <h1 className="text-3xl md:text-4xl font-bold">
          {data.category.name}
        </h1>

        <p className="text-neutral-400 mt-2">
          Browse models in this category.
        </p>

      </div>

      {products.length > 0 ? (

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}

        </div>

      ) : (

        <p className="text-neutral-500 mt-10">
          No products found in this category.
        </p>

      )}

    </div>

  );

}