import { fetchFavoriteId } from "@/utils/actions";
import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import FavoriteToggleForm from "./FavoriteToggleForm";
export default async function FavoriteToggleButton({
  productId,
}: {
  productId: string;
}) {
  const { userId } = await auth();
  if (!userId) <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ productId });

  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      productId={productId}
    />
  );
}
