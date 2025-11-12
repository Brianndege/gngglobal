"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Card {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  category?: string;
}

interface AnimatedCardGridProps {
  cards: Card[];
  columns?: 1 | 2 | 3 | 4;
  variant?: "default" | "overlay" | "minimal";
}

export default function AnimatedCardGrid({
  cards,
  columns = 3,
  variant = "default",
}: AnimatedCardGridProps) {
  const gridCols = {
    1: "",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <CardVariant card={card} variant={variant} />
        </motion.div>
      ))}
    </div>
  );
}

function CardVariant({ card, variant }: { card: Card; variant: string }) {
  switch (variant) {
    case "overlay":
      return <OverlayCard card={card} />;
    case "minimal":
      return <MinimalCard card={card} />;
    default:
      return <DefaultCard card={card} />;
  }
}

function DefaultCard({ card }: { card: Card }) {
  return (
    <Link href={card.link} className="group block h-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        {card.image && (
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {card.category && (
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {card.category}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {!card.image && card.category && (
            <div className="mb-3">
              <span className="text-sm text-cyan-600 font-semibold">{card.category}</span>
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#293d7c] transition-colors duration-300">
            {card.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{card.description}</p>

          <div className="flex items-center text-cyan-600 group-hover:text-cyan-700 font-medium">
            <span>Learn More</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function OverlayCard({ card }: { card: Card }) {
  return (
    <Link href={card.link} className="group block h-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative h-96 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {card.image ? (
            <motion.img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#293d7c] to-[#1a2850]" />
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          {card.category && (
            <span className="inline-block w-fit bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {card.category}
            </span>
          )}

          <h3 className="text-2xl font-bold mb-2">{card.title}</h3>

          <p className="text-gray-200 mb-4 line-clamp-2">{card.description}</p>

          <div className="flex items-center font-medium">
            <span>Explore</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function MinimalCard({ card }: { card: Card }) {
  return (
    <Link href={card.link} className="group block">
      <motion.div
        whileHover={{ x: 8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="border-l-4 border-gray-200 group-hover:border-cyan-500 pl-6 py-4 transition-all duration-300"
      >
        {card.category && (
          <span className="text-sm text-cyan-600 font-semibold mb-2 block">
            {card.category}
          </span>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#293d7c] transition-colors duration-300">
          {card.title}
        </h3>

        <p className="text-gray-600 mb-3">{card.description}</p>

        <div className="flex items-center text-cyan-600 group-hover:text-cyan-700 font-medium text-sm">
          <span>Read More</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="ml-2 w-3 h-3" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
