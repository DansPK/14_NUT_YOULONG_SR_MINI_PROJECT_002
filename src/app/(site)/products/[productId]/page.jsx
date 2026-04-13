import { notFound } from "next/navigation";
import { getProductByIdAction } from "../../../../../action/product.action";
import { getCategoryAction } from "../../../../../action/category.action";
import ProductDetailClient from "../../../../components/shop/ProductDetailClient";

export default async function ProductDetailPage({ params }) {
    const { productId } = await params;

    const [product, categories] = await Promise.all([
        getProductByIdAction(productId),
        getCategoryAction(),
    ]);

    if (!product) return notFound();

    const catMap = {};
    for (const c of categories) {
        if (c.categoryId) catMap[c.categoryId] = c.categoryName ?? c.name;
    }
    const catLabel = catMap[product.categoryId] || "Beauty";

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <ProductDetailClient product={product} catLabel={catLabel} />
        </div>
    );
}


