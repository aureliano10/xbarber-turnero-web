import type { LucideProps } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 7.5a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1v2z" />
      <path d="M12 18H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" />
      <path d="M15 14h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2v4z" />
      <path d="M20 18h-4" />
      <path d="m14 12 6 6" />
      <path d="m5 12 6 6" />
    </svg>
  ),
};
