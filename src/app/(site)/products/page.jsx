import ShopFilterComponent from '../../../components/shop/ShopFilterComponent';
import { getProductsAction } from '../../../../action/product.action';
import { getCategoryAction } from '../../../../action/category.action';

export default async function Page() {
  const [products, categories] = await Promise.all([
    getProductsAction(),
    getCategoryAction(),
  ]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ShopFilterComponent products={products} categories={categories} />
    </div>
  );
}
