import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "https://placehold.co/600x600/f3f4f6/9ca3af.png?text=No+Image";

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5 text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ShopCardComponent({ product = {}, catLabel = "Beauty" }) {
  const { productId, name, description, price, imageUrl, star } = product;

  const [imgSrc, setImgSrc] = useState(imageUrl?.startsWith("http") ? imageUrl : FALLBACK_IMAGE);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={imgSrc}
          alt={name ?? "product"}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-[1.02]"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-semibold text-gray-900">{name ?? "Product"}</h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-500">
            {description ?? ""}
          </p>
        </div>

        <StarRating rating={star ?? 0} />

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="text-xl font-semibold text-gray-900">${price ?? 0}</p>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800">
            {catLabel}
          </span>
        </div>

        <Link
          href={`/products/${productId}`}
          className="mt-2 block w-full rounded-xl border border-gray-900 bg-gray-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}
