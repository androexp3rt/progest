import { FormItemDetails } from "@/types/types";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemD: FormItemDetails;
  formItemDetails: FormItemDetails[];
  setFormItemDetails: (formItemDetails: FormItemDetails[]) => void;
};

export default function EditList({
  itemD,
  formItemDetails,
  setFormItemDetails,
}: Props) {
  const [listItems, setListItems] = useState<string[]>(itemD.listItems!);
  const [selValues, setSelValues] = useState<string[]>(
    itemD.listMulDefaultValue!
  );
  const [mul, setMul] = useState(itemD.listMultipleSelection!);
  const [entryRequired, setEntryRequired] = useState(itemD.required!);
  const [singleSelVal, setSingleSelVal] = useState(itemD.listDefaultValue!);
  const showMulSelOptions = () => {
    if (
      document.getElementById("mulSelOptions")!.classList.contains("hidden")
    ) {
      document.getElementById("mulSelOptions")?.classList.toggle("hidden");
      document.getElementById("mulDownArrow")!.classList.add("rotate-180");
    } else {
      document.getElementById("mulSelOptions")?.classList.toggle("hidden");
      document.getElementById("mulDownArrow")!.classList.remove("rotate-180");
    }
  };
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
    <form
      id="editItemD"
      className="w-full h-[530px] flex flex-col pb-5 space-y-2 overflow-auto"
    >
      <p className="text-lg font-bold">Title :</p>
      <input
        id="titleInput"
        className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
        type="text"
        defaultValue={itemD.newTitle}
      />
      <div className="mt-2 flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="multipleSelections"
          defaultChecked={mul}
          onChange={(e) => setMul(e.target.checked)}
        />
        <label className="text-lg font-bold" htmlFor="requiredInput">
          Multiple Selections
        </label>
      </div>
      <div className="mt-2 flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="requiredInput"
          defaultChecked={entryRequired}
          onChange={(e) => setEntryRequired(e.target.checked)}
        />
        <label className="text-lg font-bold" htmlFor="requiredInput">
          Entry required
        </label>
      </div>
      <p className="mt-2 text-lg font-bold">
        List items{" "}
        <span className="text-sm">(example: "item1","item2",...)</span> :
      </p>
      <input
        id="listItems"
        className="bg-gray-100 rounded-lg outline-none p-2 mr-2"
        defaultValue={`"${itemD.listItems?.join('","')}"`}
        onChange={(e) => {
          let str = e.target.value;
          if (str.length > 2) {
            if (str.charAt(str.length - 1) === ",") {
              str = str.slice(0, -1);
            }
            setListItems(str.slice(1, -1).split('","'));
          } else {
            setListItems([]);
          }
        }}
      />
      <p className="mt-2 text-lg font-bold">Default Value :</p>
      {mul ? (
        <div className="bg-gray-200 rounded-lg mr-2">
          <div
            id="selvalContainer"
            className="h-12 flex items-center justify-end space-x-2 rounded-lg p-2 bg-gray-100"
            onClick={(e) => {
              const unsels = Array.from(
                document.getElementsByClassName("unsel")
              );
              if (
                !unsels.includes(e.target as HTMLElement) &&
                !(e.target as HTMLElement).closest(".unself")
              ) {
                showMulSelOptions();
              }
            }}
          >
            <div className="flex-1 h-full flex items-center justify-start p-2 space-x-1">
              {selValues.map((val, i) => {
                if (val !== "") {
                  return (
                    <span
                      key={i}
                      className="unself bg-gray-200 border border-green-500 rounded-lg px-1 flex items-center justify-between space-x-2 text-sm"
                    >
                      <span className="max-w-20 whitespace-nowrap overflow-hidden text-ellipsis">
                        {val}
                      </span>
                      <i
                        className="unsel fa fa-close"
                        onClick={() => {
                          const newSelValues = [...selValues];
                          newSelValues.splice(i, 1, "");
                          setSelValues(newSelValues);
                        }}
                      />
                    </span>
                  );
                }
              })}
            </div>
            <i
              id="mulDownArrow"
              className="fa-solid fa-chevron-down text-xs transform rotate-0"
            />
          </div>
          <ul
            id="mulSelOptions"
            className="flex flex-col space-y-1 px-2 pb-2 hidden"
          >
            {listItems?.length > 0 ? (
              listItems.map((item, i) => {
                if (item !== "" && !selValues.includes(item)) {
                  return (
                    <li
                      key={i}
                      className="w-full border border-slate-200"
                      onClick={() => {
                        const newSelValues = new Array(listItems.length).fill(
                          ""
                        );
                        selValues.forEach((val, index) => {
                          newSelValues.splice(index, 1, val);
                        });
                        newSelValues.splice(i, 1, item);
                        setSelValues(newSelValues);
                        let flag = 1;
                        newSelValues.forEach((val) => {
                          if (val.length === 0) flag = 0;
                        });
                        if (flag === 1) {
                          showMulSelOptions();
                        }
                      }}
                    >
                      {item}
                    </li>
                  );
                }
              })
            ) : (
              <li className="w-full border border-slate-200">
                {itemD.listDefaultValue}
              </li>
            )}
          </ul>
        </div>
      ) : (
        <select
          id="listDefaultVal"
          className="bg-gray-100 rounded-lg outline-none p-2 mr-2"
        >
          {listItems?.length > 0 ? (
            <>
              {listItems.map((item, index) => {
                if (singleSelVal === item) {
                  return (
                    <option key={index} value={item} selected>
                      {item}
                    </option>
                  );
                }
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
              {singleSelVal === "No Default Value" ? (
                <option value="No Default Value" selected>
                  No Default Value
                </option>
              ) : (
                <option value="No Default Value">No Default Value</option>
              )}
            </>
          ) : (
            <option value="No items in list">No items in list</option>
          )}
        </select>
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
            setListItems(itemD.listItems!);
            setMul(itemD.listMultipleSelection!);
            setSelValues(itemD.listMulDefaultValue!);
            setSingleSelVal(itemD.listDefaultValue!);
            setEntryRequired(itemD.required!);
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
            newItemD.listMultipleSelection = mul;
            newItemD.required = entryRequired;
            if (listItems.length === 0) {
              toast("List Items are Required", { type: "error" });
              return;
            }
            newItemD.listItems = listItems;
            if (mul) {
              newItemD.listMulDefaultValue = selValues;
            } else {
              newItemD.listDefaultValue = (
                document.getElementById("listDefaultVal")! as HTMLSelectElement
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
            setListItems(newItemD.listItems!);
            setMul(newItemD.listMultipleSelection!);
            setSelValues(newItemD.listMulDefaultValue!);
            setSingleSelVal(newItemD.listDefaultValue!);
            setEntryRequired(newItemD.required!);
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
