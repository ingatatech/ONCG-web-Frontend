
import { create } from "zustand";

type ToastVariant = "default" | "destructive" | "success";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastStore {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: Date.now().toString(), ...toast },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// ✅ export toast directly
export function toast({
  title,
  description,
  variant = "default",
}: Omit<ToastProps, "id">) {
  const id = Date.now().toString();
  useToastStore.getState().addToast({ title, description, variant });

  // auto remove after 3s
  setTimeout(() => {
    useToastStore.getState().removeToast(id);
  }, 3000);
}
