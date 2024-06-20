'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';
import { ImagePlus, ImagePlusIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full flex ">
      <CldUploadWidget uploadPreset="geq05da0">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button type="button" variant={'secondary'} onClick={onClick}>
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
