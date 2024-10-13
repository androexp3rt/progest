import { FormItemDetails } from "@/types/types";
import React from "react";

type Props = {
  itemD: FormItemDetails;
};

export default function EditTextArea({ itemD }: Props) {
  const showColorOptions = () => {
    if (document.getElementById("ColorOptions")!.classList.contains("hidden")) {
      document.getElementById("ColorOptions")?.classList.toggle("hidden");
      document.getElementById("ColorDownArrow")!.classList.add("rotate-180");
    } else {
      document.getElementById("ColorOptions")?.classList.toggle("hidden");
      document.getElementById("ColorDownArrow")!.classList.remove("rotate-180");
    }
  };
  return (
    <form className="w-full h-96 flex flex-col pb-5 space-y-2 overflow-auto">
      <p className="text-lg font-bold">Title :</p>
      <input
        id="titleInput"
        className="bg-gray-100 outline-none p-2 rounded-lg"
        type="text"
        placeholder={itemD.title}
      />
      <div className="flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="requiredInput"
        />
        <label className="text-lg font-bold" htmlFor="requiredInput">
          Entry required
        </label>
      </div>
      <p className="text-lg font-bold">Placeholder Text :</p>
      <input
        id="placeholderInput"
        className="bg-gray-100 outline-none p-2 rounded-lg"
        type="text"
        placeholder={itemD.placeholder!}
      />
      <p className="text-lg font-bold">Size of the item :</p>
      <select
        id="sizeInput"
        className="bg-gray-100 p-2 rounded-lg outline-none"
      >
        <option value="normal">Normal</option>
        <option value="smaller">Smaller</option>
        <option value="bigger">Bigger</option>
      </select>
      <p className="text-lg font-bold">Color :</p>
      <div className="custom-select bg-gray-100 rounded-lg">
        <div
          className="relative flex items-center justify-between p-2"
          onClick={showColorOptions}
        >
          <span id="colorValue" className="w-full h-6 bg-white px-2"></span>
          <i
            id="ColorDownArrow"
            className="fa-solid fa-chevron-down text-xs absolute top-1/2 right-4 transform -translate-y-1/2 rotate-0"
          />
        </div>
        <ul
          id="ColorOptions"
          className="flex flex-col space-y-1 px-2 pb-2 hidden"
        >
          <li
            className="w-full h-6 bg-white"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-white px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
          <li
            className="w-full h-6 bg-red-500"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-red-500 px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
          <li
            className="w-full h-6 bg-blue-500"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-blue-500 px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
          <li
            className="w-full h-6 bg-green-500"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-green-500 px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
          <li
            className="w-full h-6 bg-orange-500"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-orange-500 px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
          <li
            className="w-full h-6 bg-indigo-500"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-indigo-500 px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
          <li
            className="w-full h-6 bg-yellow-500"
            onClick={() => {
              document.getElementById("colorValue")!.className =
                "w-full h-6 bg-yellow-500 px-2";
              document
                .getElementById("ColorOptions")!
                .classList.toggle("hidden");
              document
                .getElementById("ColorDownArrow")!
                .classList.remove("rotate-180");
            }}
          />
        </ul>
      </div>
      <div className="w-full flex items-center justify-end space-x-2">
        <div
          className="bg-white text-indigo-900 border border-indigo-900 p-2 rounded-lg cursor-pointer"
          onClick={() =>
            document.getElementById("editModal")!.classList.add("hidden")
          }
        >
          Cancel
        </div>
        <div className="bg-indigo-900 border border-indigo-900 text-white p-2 rounded-lg cursor-pointer">
          Confirm
        </div>
      </div>
    </form>
  );
}
