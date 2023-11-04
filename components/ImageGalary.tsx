"use client";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Card from "./Card";
import { images } from "@/constants/images";

type Image = {
  id: string;
  image: string;
};


const ImageGallery: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [gallery, setGallery] = useState<Image[]>(images);
  const [placeholderProps, setPlaceholderProps] = useState({
    clientY: 0,
    clientWidth: 0,
    clientHeight: 0,
  });
  
  const queryAttr = "data-rbd-drag-handle-draggable-id";

  const handleDeleteClick = () => {
    const updatedImages = gallery.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setGallery(updatedImages);
    setSelectedImages([]);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newGallery = reorderGallery(gallery, source.index, destination.index);

    setGallery(newGallery);
  };

  const reorderGallery = (
    list: Image[],
    startIndex: number,
    endIndex: number
  ) => {
    const newList = Array.from(list);
    const [removed] = newList.splice(startIndex, 1);
    newList.splice(endIndex, 0, removed);
    return newList;
  };

  // const onDragStart = (result: any) => {
  //   const { source, draggableId } = result;
  //   const draggedDOM = getDraggedDom(draggableId);

  //   if (!draggedDOM) return;

  //   const { clientHeight, clientWidth } = draggedDOM;
  //   const sourceIndex = source.index;

  //   if (!draggedDOM.parentNode) return;

  //   const childrenArray = [...draggedDOM.parentNode.children]; // Convert HTMLCollection to an array

  //   const clientY =
  //     parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
  //     childrenArray
  //       .slice(0, sourceIndex)
  //       .reduce((total, current) => {
  //         const style = current.currentStyle || window.getComputedStyle(current);
  //         const marginBottom = parseFloat(style.marginBottom);
  //         return total + current.clientHeight + marginBottom;
  //       }, 0);

  //   setPlaceholderProps({
  //     clientHeight,
  //     clientWidth,
  //     clientY,
  //   });
  // };

  const onDragUpdate = (result: any) => {
    const { source, destination, draggableId } = result;
    const draggedDOM = getDraggedDom(draggableId);
    const destinationIndex = destination?.index;

    if (!destination) return;
    if (!draggedDOM?.parentNode) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = source.index;

    const clientY =
      parseFloat(
        window.getComputedStyle(draggedDOM.parentNode as Element).paddingTop
      ) +
      Array.from((draggedDOM.parentNode as Element).children)
        .slice(0, destinationIndex)
        .reduce((total, curr) => {
          const style = window.getComputedStyle(curr as Element);
          const marginBottom = parseFloat(style.marginBottom);
          return total + (curr as Element).clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };


  const getDraggedDom = (draggableId: string) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDom = document.querySelector(domQuery);
    return draggedDom;
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

      <DragDropContext
        // onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <Card
          gallery={gallery}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          placeholderProps={placeholderProps}
        />
      </DragDropContext>
    </div>
  );
};

export default ImageGallery;
