import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

export const Caption = ({
  children,
  variant,
}: PropsWithChildren & {
  variant: "info" | "error";
}) => {
  return (
    <div
      className={cn(
        "text-sm",
        variant == "info" && "text-muted-foreground",
        variant === "error" && "text-destructive"
      )}
    >
      {children}
    </div>
  );
};
