import ProductsContainer from "@/components/products/ProductsContainer";
import { use } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = use(searchParams);

  const search = Array.isArray(filters.search)
    ? filters.search[0] ?? ""
    : filters.search ?? "";
  const layout = Array.isArray(filters.layout)
    ? filters.layout[0] ?? "grid"
    : filters.layout ?? "grid";

  return (
    <>
      <ProductsContainer
        layout={layout}
        search={search}
      />
    </>
  );
}
