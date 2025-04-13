"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadForm } from "@/components/upload-form";
import { ImagePreview } from "@/components/image-preview";
import { Toaster } from "@/components/ui/toaster";
import { categories } from "@/lib/constants";
import type { ImageMetadata } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(
    null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  };

  const handleMetadataChange = (metadata: ImageMetadata) => {
    setImageMetadata(metadata);
  };

  const handleReset = () => {
    setPreviewImage(null);
    setImageMetadata(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Upload New Image</h1>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div className="order-2 md:order-1">
          <ImagePreview imageUrl={previewImage} metadata={imageMetadata} />
        </div>

        <div className="order-1 md:order-2">
          <UploadForm
            categories={categories}
            onImageSelect={handleImageSelect}
            onMetadataChange={handleMetadataChange}
            onReset={handleReset}
          />
        </div>
      </div>

      <Toaster />
    </div>
  );
}
