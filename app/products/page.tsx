import ProductsContainer from "@/components/products/ProductsContainer";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search: string; layout: string }>;
}) {
  const search = (await searchParams).search || "";
  const layout = (await searchParams).layout || "grid";

  return (
    <>
      <ProductsContainer
        layout={layout}
        search={search}
      />
    </>
  );
}
