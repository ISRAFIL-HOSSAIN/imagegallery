// import Image from "next/image";
// import React, { useRef } from "react";
// import { useDrag, useDrop } from "react-dnd";

// const DraggableImage = ({ index, moveImage, onImageClick, isSelected }) => {
//   const ref = useRef(null);

//   const [, refDrag] = useDrag({
//     type: "IMAGE",
//     item: { index },
//   });

//   const [, refDrop] = useDrop({
//     accept: "IMAGE",
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index) {
//         moveImage(draggedItem.index, index);
//         draggedItem.index = index;
//       }
//     },
//   });

//   const handleImageClick = () => {
//     onImageClick(index);
//   };

//   return (
//     <div
//       ref={(node) => {
//         ref(node);
//         refDrag(node);
//         refDrop(node);
//       }}
//       className={`${
//         index === 0 && "row-span-2 col-span-2"
//       } border rounded-lg overflow-hidden relative hover:bg-gray-400`}
//       onClick={handleImageClick}
//     >
//       <div className={`w-full h-full `}>
//         {isSelected && (
//           <div className="absolute top-4 left-4">
//             <input
//               type="checkbox"
//               checked={isSelected}
//               className="w-6 h-6 rounded-md hover:cursor-pointer"
//             />
//           </div>
//         )}
//         <Image
//           src={image}
//           alt={`Image ${index}`}
//           width={400}
//           height={400}
//           className="w-full h-full hover:cursor-pointer"
//         />
//       </div>
//     </div>
//   );
// };

// export default DraggableImage;


"use client";
import { images } from "@/constants/images";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CustomImage from "./Image";

type ImageGalleryProps = {};

const ImageGallery: React.FC<ImageGalleryProps> = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [gallery, setGallery] = useState(images);

  const handleImageClick = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter((selectedIndex) => selectedIndex !== index)
      );
    } else {
      setSelectedImages((prevSelectedImages) => [...prevSelectedImages, index]);
    }
  };

  const handleImageHover = (index: number) => {
    setHoveredIndex(index);
  };

  const handleImageLeave = () => {
    setHoveredIndex(null);
  };

  const handleDeleteClick = () => {
    // Filter out the selected images and update the state
    const updatedImages = images.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setGallery(updatedImages);
    setSelectedImages([]);
  };
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(gallery);
    const [reorderedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, reorderedImage);

    setGallery(reorderedImages);
  };

  return (
    <div className="px-10 border-2 py-5 rounded-md">
      <div className="border-b-2 pb-2 mb-5 flex justify-between">
        <h2 className="text-lg font-semibold">
          {selectedImages.length > 0 ? (
            <>
              <input
                type="checkbox"
                checked={true}
                className="w-5 h-5 rounded-md hover:cursor-pointer pt-4 mr-3"
              />{" "}
              {selectedImages.length} File Selected
            </>
          ) : (
            "Gallery"
          )}
        </h2>
        <button
          className="text-red-500 font-semibold hover:underline"
          onClick={handleDeleteClick}
        >
          Delete files
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery" type="gallery" direction="vertical" isCombineEnabled>
          {(provided) => (
            <div
              className="grid lg:grid-rows-3 grid-rows-5 md:grid-rows-3 grid-flow-col gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {gallery.map(({ id, image }, index) => {
                return (
                  <Draggable key={id.toString()} draggableId={id.toString()} index={index}>
                    {(provided,snapshot) => (
                      <div
                        className={`${
                          index === 0 && "row-span-2 col-span-2"
                        } border rounded-lg overflow-hidden relative hover:bg-gray-400`}
                        style={{
                          backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
                        }}
                        onClick={() => handleImageClick(index)}
                        onMouseEnter={() => handleImageHover(index)}
                        onMouseLeave={handleImageLeave}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
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
                            src={image}
                            alt={`Image ${index}`}
                            width={400}
                            height={400}
                            className="w-full h-full hover:cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
             
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageGallery;
