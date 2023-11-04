"use client";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CustomImage from "./Image";

type ImageGalleryProps = {
  gallery: any;
  selectedImages: any;
  setSelectedImages: any;
  placeholderProps: any;
};
const Card: React.FC<ImageGalleryProps> = ({
  gallery,
  selectedImages,
  setSelectedImages,
  placeholderProps
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages((prevSelectedImages: any) =>
        prevSelectedImages.filter(
          (selectedIndex: any) => selectedIndex !== index
        )
      );
    } else {
      setSelectedImages((prevSelectedImages: any) => [
        ...prevSelectedImages,
        index,
      ]);
    }
  };

  const handleImageHover = (index: number) => {
    setHoveredIndex(index);
  };

  const handleImageLeave = () => {
    setHoveredIndex(null);
  };

  return (
   
      <Droppable droppableId="gallery">
        {(provided) => (
          <div
            className="grid lg:grid-rows-3 grid-rows-5 md:grid-rows-3 grid-flow-col gap-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {gallery.map((image: any, index: any) => (
              <Draggable
                key={image.id}
                draggableId={image.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={`${index === 0 ? "row-span-2 col-span-2 w-[400px] h-[420px]" : "w-[200px] h-[200px]"}
                    ${
                      snapshot.isDragging
                        ? "shadow-gray-400 shadow-lg border-2 border-gray-600 bg-gray-400"
                        : "undefined"
                    } border rounded-lg overflow-hidden relative hover:bg-gray-400 `}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => handleImageClick(index)}
                    onMouseEnter={() => handleImageHover(index)}
                    onMouseLeave={handleImageLeave}
                  >
                    <div className={`w-full h-full `}>
                      {(hoveredIndex === index ||
                        selectedImages.includes(index)) && (
                        <div className="absolute top-4 left-4">
                          <input
                            type="checkbox"
                            defaultChecked={selectedImages.includes(index)}
                            className="w-6 h-6 rounded-md hover:cursor-pointer"
                          />
                        </div>
                      )}
                      <CustomImage
                        src={image?.image}
                        alt={`Image ${index}`}
                        width={400}
                        height={400}
                        className="w-full h-full hover:cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {placeholderProps && (
              <div
                className="absolute border-2 border-dashed border-card-border rounded-md opacity-60"
                style={{
                  top: `${placeholderProps.clientY}px`,
                  width: `${placeholderProps.clientWidth}px`,
                  height: `${placeholderProps.clientHeight}px`,
                }}
              />
            )}
          </div>
        )}
      </Droppable>
   
  );
};

export default Card;
