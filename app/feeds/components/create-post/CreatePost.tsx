"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { tanstackQueryClient } from "@/lib/integrations/tanstack-query";
import { toast } from "sonner";
import { serverUrl } from "@/lib/environment";


const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async ({ title, text }: { title: string; text: string }) => {
      const res = await fetch(`${serverUrl}/posts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      if (!res.ok) throw new Error("Failed to post");
    },
    onSuccess: () => {
      setIsOpen(false);
      toast("Post has been created successfully.");
      tanstackQueryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onSettled: () => {
      reset();
    },
  });

  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: { title: "", text: "" },
    onSubmit: ({ value }) => {
      createPostMutation.mutate(value);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className=" rounded-xl shadow border dark:bg-[#050314] p-4 w-full max-w-6xl mx-auto mb-4">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 border border-blue-400 text-gray-500 px-4 py-2 rounded-full dark:hover:bg-gray-950 transition">
              Create a post
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>What do you want to talk about?</DialogTitle>
          <DialogDescription>
            Share your thoughts with the world!
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="space-y-4"
        >
          <Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                value.length === 0 ? "Required" : undefined,
            }}
          >
            {(field) => (
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a post title"
              />
            )}
          </Field>

          <Field
            name="text"
            validators={{
              onChange: ({ value }) =>
                value.length === 0 ? "Required" : undefined,
            }}
          >
            {(field) => (
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="What's on your mind?"
                className="resize-none min-h-[120px] "
              />
            )}
          </Field>

          <Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={
                  !canSubmit || isSubmitting || createPostMutation.isPending
                }
              >
                {createPostMutation.isPending ? (
                  <Spinner className="mr-2" />
                ) : null}
                Post
              </Button>
            )}
          </Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
