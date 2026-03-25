import * as React from "react";

export function Select({ children }) {
  return <div>{children}</div>;
}

export function SelectTrigger({ children }) {
  return (
    <button className="w-full border px-3 py-2 rounded-md text-left">
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div className="border rounded-md mt-1">{children}</div>;
}

export function SelectItem({ value, children }) {
  return (
    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">{children}</div>
  );
}
