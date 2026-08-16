import React from "react";

interface ProfileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const ProfileInput = ({ label, className, ...props }: ProfileInputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label pequeño y oscuro */}
      <label className="text-xs font-bold text-gray-700 ml-1">{label}</label>
      
      {/* Input con fondo gris suave y bordes redondeados */}
      <input
        className={`w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl block p-4 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
};