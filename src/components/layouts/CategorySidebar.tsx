"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaAnglesDown } from "react-icons/fa6";
import {
  FaTh,
  FaUserCircle,
  FaRegSquare,
  FaRegCreditCard,
  FaCheckSquare,
  FaCaretSquareDown,
  FaFileAlt,
  FaKeyboard,
  FaSpinner,
  FaWindowMaximize,
  FaBars,
  FaBell,
  FaTable,
  FaDotCircle,
  FaSearch,
  FaToggleOn,
  FaQuestionCircle,
} from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// Simple function to get icon for category
const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "All": <FaTh className="w-4 h-4" />,
    "Avatars": <FaUserCircle className="w-4 h-4" />,
    "Buttons": <FaRegSquare className="w-4 h-4" />,
    "Cards": <FaRegCreditCard className="w-4 h-4" />,
    "Checkboxes": <FaCheckSquare className="w-4 h-4" />,
    "Dropdowns": <FaCaretSquareDown className="w-4 h-4" />,
    "Forms": <FaFileAlt className="w-4 h-4" />,
    "Inputs": <FaKeyboard className="w-4 h-4" />,
    "Loaders": <FaSpinner className="w-4 h-4" />,
    "Modals": <FaWindowMaximize className="w-4 h-4" />,
    "Navigation": <FaBars className="w-4 h-4" />,
    "Notifications": <FaBell className="w-4 h-4" />,
    "Pagination": <FaTable className="w-4 h-4" />,
    "Radio Buttons": <FaDotCircle className="w-4 h-4" />,
    "Search Bars": <FaSearch className="w-4 h-4" />,
    "Toggles": <FaToggleOn className="w-4 h-4" />,
    "Tooltips": <FaQuestionCircle className="w-4 h-4" />,
  };
  
  return iconMap[categoryName] || <FaTh className="w-4 h-4" />;
};

export default function CategorySidebar({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();
  const [visibleCount, setVisibleCount] = useState(7);
  const containerRef = useRef<HTMLDivElement>(null);

  const showLoadMore = visibleCount < categories.length;
  const visibleCategories = categories.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, categories.length));
  };

  useEffect(() => {
    if (containerRef.current && showLoadMore) {
      const button = containerRef.current.querySelector('button:last-of-type');
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [visibleCount, showLoadMore]);

  return (
    <aside className="w-52 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-neutral-800 bg-neutral-900 flex flex-col">
      
      <h2 className="text-lg font-semibold mb-5 text-white px-6 pt-6">
        Categories
      </h2>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex flex-col gap-2">
          
          <Link
            href="/allproducts"
            className={`px-4 py-2 rounded-lg transition flex items-center gap-3
            ${
              pathname === "/"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            {getCategoryIcon("All")}
            <span>All</span>
          </Link>

          {visibleCategories.map((cat) => {
            const active = pathname === `/${cat.slug}`;

            return (
              <Link
                key={cat._id}
                href={`/${cat.slug}`}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-3
                ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {getCategoryIcon(cat.name)}
                <span>{cat.name}</span>
              </Link>
            );
          })}

          {showLoadMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 rounded-lg transition text-neutral-400 hover:bg-neutral-800 hover:text-white flex items-center justify-center gap-2"
              >
                <FaAnglesDown className="w-4 h-4" />
                <span>Show more</span>
              </button>
            </div>
          )}

        </div>
      </div>

    </aside>
  );
}