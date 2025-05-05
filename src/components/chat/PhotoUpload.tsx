
import React, { ChangeEvent, useRef, forwardRef, useImperativeHandle } from "react";

export interface PhotoUploadRef {
  triggerFileInput: () => void;
}

interface PhotoUploadProps {
  onPhotoSelected: (photo: string) => void;
}

const PhotoUpload = forwardRef<PhotoUploadRef, PhotoUploadProps>(({ onPhotoSelected }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current?.click();
    }
  }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onPhotoSelected(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
});

PhotoUpload.displayName = "PhotoUpload";

export default PhotoUpload;
