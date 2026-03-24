// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { Product } from "@/types/Product";




// interface CartItem {
//   _id: string;
//   price: number;
//   product: Product;
// }

// interface Cart {
//   items: CartItem[];
// }



// export default function MyCart() {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [loading, setLoading] = useState(true);
//     const { data: session, status } = useSession();
//   const router = useRouter();

//  async function loadCart() {

//     try {

//       const res = await fetch("/api/cart");

//       if (!res.ok) throw new Error();

//       const data = await res.json();

//       setCart(data);

//     } catch (err) {

//       console.error(err);

//     } finally {

//       setLoading(false);

//     }
//   }
// useEffect(() => {

//   if (status === "loading") return;

//   if (!session) {
//     router.replace("/login?mode=login");
//     return;
//   }

//   loadCart();

// }, [status]);

//   async function removeFromCart(productId: string) {
//   try {
//     await fetch("/api/cart/remove", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ productId }),
//     });

//   setCart(prev =>
//   prev
//     ? { ...prev, items: prev.items.filter(i => i.product._id !== productId) }
//     : prev
// );
//   } catch (err) {
//     console.error("Remove error:", err);
//   }
// }

//   /* ---------------- Loading State ---------------- */

//   if (status === "loading" || loading) {
//     return <div className="p-10 text-neutral-400">Loading cart...</div>;
//   }


//   /* ---------------- Empty Cart ---------------- */

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className="max-w-5xl mx-auto p-8 lg:p-12">
//         <h1 className="text-4xl font-bold text-neutral-100 mb-8">
//           My Cart
//         </h1>

//         <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-neutral-400">
//           Your cart is empty.
//         </div>
//       </div>
//     );
//   }

//   /* ---------------- Total Price ---------------- */

//   const total = cart.items.reduce((sum, item) => sum + item.price, 0);

//   return (
//     <div className="max-w-5xl mx-auto p-8 lg:p-12 text-neutral-200">

//       {/* Header */}
//       <h1 className="text-4xl font-bold mb-10 text-neutral-100">
//         My Cart
//       </h1>

//       {/* Cart Items */}
//       <div className="space-y-5">
//         {cart.items.map((item, index) => {
//           const product = item.product;

//           const productLink =
//             product.createdBy?.username
//               ? `/components/${product.createdBy.username}/${product.slug}`
//               : null;

//           return (
//             <div
//               key={`${product._id}-${index}`}
//               className="flex items-center gap-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-800 transition"
//             >
            

//               {/* Product Info */}
//               <div className="flex-1">
//                 <h2 className="font-semibold text-lg text-neutral-100">
//                   {product.title}
//                 </h2>

//                 <p className="text-sm text-neutral-400">
//                   ₹ {item.price}
//                 </p>
//               </div>
// <div className="flex gap-4 items-center">
//   {productLink && (
//     <Link
//       href={productLink}
//       className="text-sm text-neutral-300 hover:text-neutral-100 transition"
//     >
//       View Details
//     </Link>
//   )}

//   <button
//     onClick={() => removeFromCart(item.product._id)}
//     className="text-sm text-red-400 hover:text-red-300 transition"
//   >
//     Remove
//   </button>
// </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Total */}
//       <div className="mt-10 border-t border-neutral-800 pt-6 flex justify-between text-xl font-semibold text-neutral-100">
//         <span>Total</span>
//         <span>₹ {total}</span>
//       </div>

//       {/* Checkout */}
//       <button className="mt-6 w-full bg-neutral-200 text-neutral-900 py-4 rounded-xl font-semibold hover:bg-neutral-300 transition">
//         Proceed to Checkout
//       </button>

//     </div>
//   );
// }