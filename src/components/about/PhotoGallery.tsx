import { motion } from "framer-motion";
import type { GalleryImage } from "@/types";
import { beats, grooveEase } from "@/lib/tempo";

export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((img, i) => (
        <motion.figure
          key={img.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: beats(0.8), ease: grooveEase, delay: beats((i % 3) * 0.15) }}
          className={`relative overflow-hidden rounded-xl border border-ivoire/10 ${
            i % 5 === 0 ? "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-square" : "aspect-square"
          }`}
        >
          <div
            className="absolute inset-0 opacity-90 transition-transform duration-700 hover:scale-105"
            style={{ background: `linear-gradient(160deg, ${img.gradient[0]}, ${img.gradient[1]})` }}
          />
          <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-grain" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 to-transparent p-3 text-xs text-ivoire/80">
            {img.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
