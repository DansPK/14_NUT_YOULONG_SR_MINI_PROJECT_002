import { getProductsAction } from "../../../../action/product.action";
import { getCategoryAction } from "../../../../action/category.action";
import ManageProductsClient from "../../../components/manage/ManageProductsClient";

export default async function ManageProductsPage() {
    const [products, categories] = await Promise.all([
        getProductsAction(),
        getCategoryAction(),
    ]);

    return <ManageProductsClient initialProducts={products} categories={categories} />;
}

