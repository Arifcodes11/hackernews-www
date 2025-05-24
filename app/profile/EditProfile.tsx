"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { serverUrl } from "@/lib/environment";

type User = {
  name?: string | null;
  about?: string | null;
  email?: string | null;
  image?: string | null;
};

type Props = {
  user: User;
};

export const EditProfileSheet = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    about: "",
    image: "",
    email: "",
  });

  const queryClient = useQueryClient();

  // ✅ Reset form values every time the sheet opens
  useEffect(() => {
    if (open && user) {
      setForm({
        name: user.name || "",
        about: user.about || "",
        image: user.image || "",
        email: user.email || "",
      });
    }
  }, [open, user]);

  const updateUser = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${serverUrl}/profile/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast("Profile has been updated successfully 🌟");
      setOpen(false);
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="mt-4 sm:mt-0"
          aria-label="Edit Profile"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md overflow-auto px-8">
        <SheetHeader>
          <SheetTitle>Edit Your Profile</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <Textarea
            placeholder="About"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />
          <Button
            onClick={() => updateUser.mutate()}
            disabled={updateUser.isPending}
          >
            {updateUser.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
