"use client";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Card from "./Card";
import { images } from "@/constants/images";

type Image = {
  id: string;
  image: string;
};

type PlaceholderProps = {
  clientY: number;
  clientWidth: number;
  clientHeight: number;
};

const ImageGallery: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [gallery, setGallery] = useState<Image[]>(images);
  const [placeholderProps, setPlaceholderProps] = useState<PlaceholderProps>({
    clientY: 0,
    clientWidth: 0,
    clientHeight: 0,
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const queryAttr = "data-rbd-drag-handle-draggable-id";

  // Delete Functionality 
  const handleDeleteClick = () => {
    const updatedImages = gallery.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setGallery(updatedImages);
    setSelectedImages([]);
  };

  // OnDrag End Functionality
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

  // ReArange the Galary State Array .... 
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

  //Drag Update Functionality ... 
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

  // Get Dom Information 
  const getDraggedDom = (draggableId: string) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDom = document.querySelector(domQuery);
    return draggedDom;
  };

  // Sorting Functionality
  const handleSortClick = () => {
    const sortedGallery = [...gallery];
    sortedGallery.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.id.localeCompare(b.id);
      } else {
        return b.id.localeCompare(a.id);
      }
    });

    setGallery(sortedGallery);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="lg:px-16 px-2 border-2 py-5 rounded-md w-full  overflow-hidden">
      <div className="border-b-2 pb-2 mb-5 flex justify-between w-full">
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

        <div className="">
          <div className="relative inline-block text-left mr-5">
            <label htmlFor="sortSelect" className="px-2 font-semibold ">Sort:</label>
            <select
              id="sortSelect"
              className="ring-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none "
              value={sortOrder}
              onChange={handleSortClick}
            >
              <option value="asc">LTR</option>
              <option value="desc">RTL</option>
            </select>
          </div>

          <button
            className="text-red-500 font-semibold hover:underline"
            onClick={handleDeleteClick}
          >
            Delete files
          </button>
        </div>
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
