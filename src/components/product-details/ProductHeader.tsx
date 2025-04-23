
import React from 'react';
import { X } from 'lucide-react';
import { DialogClose } from "@/components/ui/dialog";

interface ProductHeaderProps {
  image: string;
  title: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ image, title }) => {
  return (
    <>
      <DialogClose className="absolute right-2 top-2 z-10 rounded-full bg-black/30 p-1">
        <X className="h-6 w-6 text-white" />
      </DialogClose>
      
      <div className="w-full">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
      </div>
    </>
  );
};

export default ProductHeader;
