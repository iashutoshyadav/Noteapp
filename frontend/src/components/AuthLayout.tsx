import { ReactNode } from "react";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6 border rounded-xl shadow-md">
        {/* logo + title bar */}
        <div className="flex items-center gap-2 mb-6">
          <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            HD
          </span>
          <span className="font-semibold text-lg">Highway Delite</span>
        </div>

        {/* form content */}
        <h1 className="text-2xl font-semibold mb-1">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign up to enjoy the feature of HD
        </p>

        {children}
      </div>
    </div>
  );
}
