"use client";

import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

type btnSize = "default" | "lg" | "sm";
type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};
export default function SubmitButton({
  className = "",
  text = "submit",
  size = "lg",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn("capitalize", className)}
      size={size}
      disabled={pending}>
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Pleace wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}
