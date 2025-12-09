import { fetchFavoriteId } from "@/utils/actions";
import { fetchUserId } from "../auth/user";
import { CardSignInButton } from "../form/Buttons";
import FavoriteToggleForm from "./FavoriteToggleForm";

export default async function FavoriteToggleButton({
  productId,
}: {
  productId: string;
}) {
  const userId = await fetchUserId();
  if (!userId) return <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ productId });

  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      productId={productId}
    />
  );
}
