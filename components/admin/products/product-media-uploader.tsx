"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

type MediaItem = {
  id: string;
  file: File;
  name: string;
  url: string;
};

export function ProductMediaUploader({ onFilesChange }: { onFilesChange?: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef(new Set<string>());
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    onFilesChange?.(media.map((item) => item.file));
  }, [media, onFilesChange]);

  function addFiles(files: File[]) {
    const supportedFiles = files.filter((file) => file.type.startsWith("image/"));
    if (supportedFiles.length === 0) {
      setError("Choose an image file.");
      return;
    }

    setError(supportedFiles.length === files.length ? "" : "Unsupported files were skipped.");
    const newMedia = supportedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        url,
      } satisfies MediaItem;
    });
    setMedia((current) => [...current, ...newMedia]);
  }

  function removeMedia(item: MediaItem) {
    URL.revokeObjectURL(item.url);
    objectUrls.current.delete(item.url);
    setMedia((current) => current.filter((entry) => entry.id !== item.id));
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) addFiles(Array.from(event.target.files));
          event.target.value = "";
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center transition-colors ${
          isDragging ? "border-black bg-black/[0.04]" : "border-black/35"
        }`}
      >
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-black/[0.03]">
          <Upload className="size-3.5" /> Upload new
        </button>
        <span className="text-xs text-black/55">Drop product images here, or choose files</span>
      </div>

      {error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null}

      {media.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {media.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-black/10 bg-black/[0.02]">
              <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
              <div className="flex items-center gap-1.5 border-t border-black/10 bg-white px-2 py-1.5">
                <ImagePlus className="size-3.5 shrink-0 text-black/50" />
                <span className="min-w-0 flex-1 truncate text-xs text-black/65">{item.name}</span>
                <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeMedia(item)} className="rounded p-1 text-black/50 hover:bg-red-50 hover:text-red-700"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
