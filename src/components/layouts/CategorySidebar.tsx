// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
// }

// export default function CategorySidebar({
//   categories,
// }: {
//   categories: Category[];
// }) {

//   const pathname = usePathname();

//   return (
//     <aside className="w-64 shrink-0 sticky top-0 h-screen border-r border-neutral-800 bg-neutral-900 p-6">
      
//       <h2 className="text-lg font-semibold mb-5 text-white">
//         Categories
//       </h2>

//       <div className="flex flex-col gap-2">

//         <Link
//           href="/"
//           className={`px-4 py-2 rounded-lg transition
//           ${
//             pathname === "/"
//               ? "bg-neutral-800 text-white"
//               : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
//           }`}
//         >
//           All
//         </Link>

//         {categories.map((cat) => {
//           const active = pathname === `/${cat.slug}`;

//           return (
//             <Link
//               key={cat._id}
//               href={`/${cat.slug}`}
//               className={`px-4 py-2 rounded-lg transition
//               ${
//                 active
//                   ? "bg-neutral-800 text-white"
//                   : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
//               }`}
//             >
//               {cat.name}
//             </Link>
//           );
//         })}

//       </div>
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategorySidebar({
  categories,
}: {
  categories: Category[];
}) {

  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-neutral-800 bg-neutral-900 p-6">
      
      <h2 className="text-lg font-semibold mb-5 text-white">
        Categories
      </h2>

      <div className="flex flex-col gap-2 overflow-y-auto">
        
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg transition
          ${
            pathname === "/"
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          All
        </Link>

        {categories.map((cat) => {
          const active = pathname === `/${cat.slug}`;

          return (
            <Link
              key={cat._id}
              href={`/${cat.slug}`}
              className={`px-4 py-2 rounded-lg transition
              ${
                active
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}

      </div>

    </aside>
  );
}