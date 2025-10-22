"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type FormSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
};

export function FormSubmitButton({ idleLabel, pendingLabel, className }: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        "w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      disabled={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
