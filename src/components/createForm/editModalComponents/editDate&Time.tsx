import { FormItemDetails } from "@/types/types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemD: FormItemDetails;
  formItemDetails: FormItemDetails[];
  setFormItemDetails: (formItemDetails: FormItemDetails[]) => void;
};

export default function EditDateTime({
  itemD,
  formItemDetails,
  setFormItemDetails,
}: Props) {
  const [type, setType] = useState("datetime-local");
  const showColorOptions = () => {
    if (document.getElementById("ColorOptions")!.classList.contains("hidden")) {
      document.getElementById("ColorOptions")?.classList.toggle("hidden");
      document.getElementById("ColorDownArrow")!.classList.add("rotate-180");
    } else {
      document.getElementById("ColorOptions")?.classList.toggle("hidden");
      document.getElementById("ColorDownArrow")!.classList.remove("rotate-180");
    }
  };
  useEffect(() => {
    if (type === "time" || type === "datetime-local") {
      const selectElement = document.getElementById("timePlaceholderInput")!;
      for (let i = 0; i <= 23; i++) {
        for (let j = 0; j < 60; j += 5) {
          const timeString = `${i.toString().padStart(2, "0")}:${j
            .toString()
            .padStart(2, "0")}`;
          const option = document.createElement("option");
          option.value = timeString;
          option.textContent = timeString;
          selectElement.appendChild(option);
        }
      }
    }
  }, [type]);
  return (
    <form
      id="editItemD"
      className="w-full h-[512px] flex flex-col pb-5 space-y-2 overflow-auto"
    >
      <p className="text-lg font-bold">Title :</p>
      <input
        id="titleInput"
        className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
        type="text"
        defaultValue={itemD.newTitle}
      />
      <p className="mt-2 text-lg font-bold">Type :</p>
      <select
        id="typeInput"
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
        onChange={(e) => setType(e.target.value)}
      >
        <option value="datetime-local">Date & Time</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
      </select>
      <div className="mt-2 flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="requiredInput"
          defaultChecked={true}
        />
        <label className="text-lg font-bold" htmlFor="requiredInput">
          Entry required
        </label>
      </div>
      {type !== "time" && (
        <>
          <p className="mt-2 text-lg font-bold">Default Date :</p>
          <select
            id="datePlaceholderInput"
            className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="1st day of the week">1st day of the week</option>
            <option value="1st day of the month">1st day of the month</option>
            <option value="Last day of the month">Last day of the month</option>
            <option value="Last day of previous month">
              Last day of previous month
            </option>
            <option value="A week from today">A week from today</option>
            <option value="In a year's time">In a year&apos;s time</option>
            <option value="No Date">No Date</option>
          </select>
        </>
      )}
      {type !== "date" && (
        <>
          <p className="mt-2 text-lg font-bold">Default Time :</p>
          <select
            id="timePlaceholderInput"
            className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
          >
            <option value="Now">Now</option>
            <option value="No Time">No Time</option>
          </select>
        </>
      )}
      <p className="mt-2 text-lg font-bold">Size of the item :</p>
      <select
        id="sizeInput"
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
      >
        <option value="normal">Normal</option>
        <option value="smaller">Smaller</option>
        <option value="bigger">Bigger</option>
      </select>
      <p className="mt-2 text-lg font-bold">Color :</p>
      <div className="custom-select bg-gray-100 rounded-lg mr-2">
        <div
          className="relative flex items-center justify-between p-2"
          onClick={showColorOptions}
        >
          <span id="colorValue" className="w-full h-6 bg-white px-2">
            <span id="colorValueName" className="hidden">
              white
            </span>
          </span>
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
              document.getElementById("colorValueName")!.innerHTML = "white";
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
              document.getElementById("colorValueName")!.innerHTML = "red-500";
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
              document.getElementById("colorValueName")!.innerHTML = "blue-500";
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
              document.getElementById("colorValueName")!.innerHTML =
                "green-500";
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
              document.getElementById("colorValueName")!.innerHTML =
                "orange-500";
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
              document.getElementById("colorValueName")!.innerHTML =
                "indigo-500";
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
              document.getElementById("colorValueName")!.innerHTML =
                "yellow-500";
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
      <div className="w-full flex items-center justify-end space-x-2 pr-2">
        <div
          className="bg-white text-indigo-900 border border-indigo-900 p-2 rounded-lg cursor-pointer"
          onClick={() => {
            (document.getElementById("editItemD")! as HTMLFormElement).reset();
            document.getElementById("colorValue")!.className =
              "w-full h-6 bg-white px-2";
            document.getElementById("colorValueName")!.innerHTML = "white";
            document.getElementById("editModal")!.classList.add("hidden");
          }}
        >
          Cancel
        </div>
        <button
          type="submit"
          className="bg-indigo-900 border border-indigo-900 text-white p-2 rounded-lg cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            const newItemD: FormItemDetails = { ...itemD };
            if (
              (document.getElementById("titleInput")! as HTMLInputElement)
                .value === ""
            ) {
              toast("Title is Required", { type: "error" });
              return;
            }
            newItemD.newTitle = (
              document.getElementById("titleInput")! as HTMLInputElement
            ).value;
            newItemD.type = (
              document.getElementById("typeInput")! as HTMLSelectElement
            ).value;
            newItemD.required = (
              document.getElementById("requiredInput")! as HTMLInputElement
            ).checked;
            if (document.getElementById("datePlaceholderInput")) {
              newItemD.defaultDate = (
                document.getElementById(
                  "datePlaceholderInput"
                )! as HTMLSelectElement
              ).value;
            }
            if (document.getElementById("timePlaceholderInput")) {
              newItemD.defaultTime = (
                document.getElementById(
                  "timePlaceholderInput"
                )! as HTMLSelectElement
              ).value;
            }
            newItemD.size = (
              document.getElementById("sizeInput")! as HTMLSelectElement
            ).value;
            newItemD.newColor = (
              document.getElementById("colorValueName")! as HTMLElement
            ).innerText;
            const index = formItemDetails.indexOf(itemD);
            const newFormItemDetails = [...formItemDetails];
            newFormItemDetails.splice(index, 1, newItemD);
            setFormItemDetails(newFormItemDetails);
            (document.getElementById("editItemD")! as HTMLFormElement).reset();
            document.getElementById("colorValue")!.className =
              "w-full h-6 bg-white px-2";
            document.getElementById("colorValueName")!.innerHTML = "white";
            document.getElementById("editModal")!.classList.add("hidden");
          }}
        >
          Confirm
        </button>
      </div>
    </form>
  );
}
