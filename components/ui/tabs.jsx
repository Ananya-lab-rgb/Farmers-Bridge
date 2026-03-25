import React from "react";

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          activeValue: value,
          onValueChange,
        })
      )}
    </div>
  );
}

export function TabsList({ children, className, activeValue, onValueChange }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          activeValue,
          onValueChange,
        })
      )}
    </div>
  );
}

export function TabsTrigger({ value, activeValue, onValueChange, children }) {
  const isActive = activeValue === value;

  return (
    <button
      className={`px-4 py-2 rounded ${
        isActive ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => onValueChange && onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeValue, children }) {
  if (value !== activeValue) return null;
  return <div>{children}</div>;
}
