
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  "/lovable-uploads/63e1d57e-857e-4800-aea2-cfb2d7b3d956.png",
  "/lovable-uploads/afee450b-5eae-4439-ba61-8d98f5ff2b07.png",
  "/lovable-uploads/6f0548e1-599b-4b22-b54e-cd554aca80cf.png",
  "/lovable-uploads/d3c01862-f72d-40de-aad3-0315ce1d2dad.png"
];

const ImageCarousel = () => {
  return (
    <Carousel className="relative w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="w-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};

export default ImageCarousel;
