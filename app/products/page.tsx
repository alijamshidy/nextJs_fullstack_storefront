import ProductsContainer from "@/components/products/ProductsContainer";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search: string; layout: string }>;
}) {
  const { search, layout } = await searchParams;

  return (
    <>
      <ProductsContainer
        layout={layout}
        search={search}
      />
    </>
  );
}
