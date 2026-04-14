"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ImageOff } from "lucide-react";
import ButtonAddComponent from "./ButtonAddComponent";

export function StarRow({ rating = 4.8 }) {
  return (
    <p className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          className={n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
      <span className="ml-1 text-xs tabular-nums text-gray-500">{rating}</span>
    </p>
  );
}

function isValidImageUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ProductCardComponent({ product }) {
  const { productId, productName, price, imageUrl } = product;
  const hasValidImage = isValidImageUrl(imageUrl);

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {hasValidImage ? (
            <Image
              src={imageUrl}
              alt={productName ?? "product image"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400">
              <ImageOff size={32} />
            </div>
          )}
        </div>
      </Link>
      <div className="relative mt-4 pr-14">
        <StarRow />
        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {productName}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">${price}</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ButtonAddComponent product={product} />
      </div>
    </article>
  );
}
