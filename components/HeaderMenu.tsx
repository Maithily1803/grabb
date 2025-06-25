"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { headerData } from "@/constants/data"
import { cn } from "@/lib/utils"

export const HeaderMenu = () => {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <nav className="flex gap-6 text-sm relative">
      {headerData.map((item) => (
        <div
          key={item.label}
          onMouseEnter={() => setHovered(item.label)}
          onMouseLeave={() => setHovered(null)}
          className="relative"
        >
          <Link
            href={item.href}
            className={cn(
              "transition-colors hover:text-black text-gray-600 font-medium",
              pathname?.includes(item.label.toLowerCase()) && "text-black"
            )}
          >
            {item.label}
          </Link>

          {/* Dropdown */}
          <AnimatePresence>
            {hovered === item.label && item.subcategories && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-6 left-0 z-20 bg-white shadow-xl rounded-md py-2 px-4 min-w-[150px]"
              >
                {item.subcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/shop?category=${item.label}&subcategory=${sub}`}
                    className="block px-2 py-1 text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  )
}
