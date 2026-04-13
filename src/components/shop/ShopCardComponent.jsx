import Link from "next/link";
import Image from "next/image";

const categoryTone = {
  Skincare: "bg-sky-50 text-sky-800",
  Makeup: "bg-violet-50 text-violet-800",
  Fragrance: "bg-amber-50 text-amber-900",
  Haircare: "bg-emerald-50 text-emerald-900",
};

function badgeClass(label) {
  return categoryTone[label] ?? "bg-indigo-50 text-indigo-800";
}

function isValidAbsoluteUrl(str) {
  if (!str || typeof str !== "string") return false;
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const FALLBACK_IMAGE = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image";

const btnClass =
  "mt-2 block w-full rounded-xl border border-gray-900 bg-gray-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800";

function ShopStarRow({ rating = 0 }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  return (
    <p className="flex items-center gap-0.5 text-sm" aria-label={`${rating} stars`}>
      {stars.map((filled, i) => (
        <span key={i} className={filled ? "text-amber-400" : "text-gray-200"}>
          ★
        </span>
      ))}
    </p>
  );
}

export default function ShopCardComponent({ product = {}, catLabel = "Beauty" }) {
  const { productId, name, description, price, imageUrl, star } = product;
  const rating = star ?? 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={isValidAbsoluteUrl(imageUrl) ? imageUrl : FALLBACK_IMAGE}
          alt={name ?? "product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-semibold leading-snug text-gray-900">
            {name ?? "Product"}
          </h3>
          <p className="mt-1 min-h-10 line-clamp-2 text-sm leading-5 text-gray-500">
            {description ?? ""}
          </p>
        </div>
        <ShopStarRow rating={rating} />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <p className="text-xl font-semibold tabular-nums text-gray-900">
            ${price ?? 0}
          </p>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(catLabel)}`}
          >
            {catLabel}
          </span>
        </div>
        <Link href={`/products/${productId}`} className={btnClass}>
          View Product
        </Link>
      </div>
    </article>
  );
}
