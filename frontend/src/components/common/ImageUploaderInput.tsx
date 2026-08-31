import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Link } from 'lucide-react';

interface ImageUploaderInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ImageUploaderInput: React.FC<ImageUploaderInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... or upload local image file',
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      onChange(base64Url);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Failed to read local file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-300 block">{label} {required && '*'}</label>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
          />
          <Link className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          title="Upload Local File from Device"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline">{isUploading ? 'Loading...' : 'Upload File'}</span>
        </button>
      </div>

      {/* Image Thumbnail Preview */}
      {value && (
        <div className="flex items-center gap-2 pt-1">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
            <img
              src={value}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-xs font-mono">
            {value.startsWith('data:') ? 'Local file selected (Base64)' : value}
          </span>
        </div>
      )}
    </div>
  );
};
