import React, { ReactElement, useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FormItem from "./formItem";
import { toast } from "react-toastify";
import { FormItemDetails } from "@/types/types";
import EditInputField from "./editModalComponents/editInputField";
import EditCalculation from "./editModalComponents/editCalculation";
import EditImage from "./editModalComponents/editImage";
import EditTable from "./editModalComponents/editTable";
import EditAttachedFile from "./editModalComponents/editAttachedFile";
import EditVoiceRecorder from "./editModalComponents/editVoiceRecorder";
import EditPhoto from "./editModalComponents/editPhoto";
import EditChoice from "./editModalComponents/editChoice";
import EditList from "./editModalComponents/editList";
import EditCheckBox from "./editModalComponents/editCheckBox";
import EditDateTime from "./editModalComponents/editDate&Time";
import EditTextArea from "./editModalComponents/editTextArea";

export default function CreateForm() {
  const fields = [
    { icon: "fas fa-font", label: "Input field", color: "text-teal-500" },
    { icon: "fas fa-align-left", label: "Text Area", color: "text-teal-500" },
    {
      icon: "fas fa-calendar-alt",
      label: "Date & Time",
      color: "text-teal-500",
    },
    { icon: "fas fa-check-square", label: "Check Box", color: "text-teal-500" },
    { icon: "fas fa-list", label: "List", color: "text-teal-500" },
    { icon: "fas fa-check-circle", label: "Choice", color: "text-teal-500" },
    { icon: "fas fa-camera", label: "Photo", color: "text-purple-500" },
    {
      icon: "fas fa-microphone",
      label: "Voice Recorder",
      color: "text-purple-500",
    },
    {
      icon: "fas fa-file-alt",
      label: "Attached file",
      color: "text-purple-500",
    },
    { icon: "fas fa-table", label: "Table", color: "text-green-500" },
    { icon: "fas fa-image", label: "Image", color: "text-gray-500" },
    { icon: "fas fa-calculator", label: "Calculation", color: "text-red-500" },
  ];
  const [formItemDetails, setFormItemDetails] = useState<FormItemDetails[]>([]);
  const [formItems, setFormItems] = useState<ReactElement[]>([]);
  const [formItemsLength, setFormItemsLength] = useState(0);
  const [formName, setFormName] = useState("");
  const [selectedFormItem, setSelectedFormItem] = useState("");
  const [itemToDelete, setItemToDelete] = useState("");
  const [itemToCopy, setItemToCopy] = useState("");

  const createFormItem = (f: {
    icon: string;
    label: string;
    color: string;
  }) => {
    const newFormItem = (
      <FormItem
        key={formItemsLength}
        id={formItemsLength.toString()}
        f={f}
        setItemToCopy={setItemToCopy}
        setItemToDelete={setItemToDelete}
        setSelectedFormItem={setSelectedFormItem}
      />
    );
    setFormItems([...formItems, newFormItem]);

    const newFormItemDetail = {
      title: f.label,
      type: "text",
      required: false,
      placeholder: "placeholder",
      id: formItemsLength.toString(),
      size: "normal",
      color: f.color,
      icon: f.icon,
    };
    setFormItemDetails([...formItemDetails, newFormItemDetail]);
    setFormItemsLength(formItemsLength + 1);
  };
  useEffect(() => {
    if (itemToCopy !== "") {
      duplicateFormItem();
      setItemToCopy("");
    }
  }, [itemToCopy]);
  const duplicateFormItem = () => {
    const formItemToCopy = formItems.filter(
      (item) => item.key === selectedFormItem.slice(1)
    );
    const index = formItems.indexOf(formItemToCopy[0]);
    const copy = React.cloneElement(formItemToCopy[0], {
      key: formItemsLength.toString(),
      id: formItemsLength.toString(),
      f: {
        icon: formItemToCopy[0].props.f.icon,
        label: `(copy) ${formItemToCopy[0].props.f.label}`,
        color: formItemToCopy[0].props.f.color,
      },
    });
    const newFormItems = [...formItems];
    newFormItems.splice(index + 1, 0, copy);
    setFormItems(newFormItems);
    setFormItemsLength(formItemsLength + 1);
  };
  const deleteFormItem = () => {
    const newItems = formItems.filter((item) => item.key !== itemToDelete);
    setFormItems(newItems);
    document.getElementById("deleteModal")!.classList.add("hidden");
    setItemToDelete("");
  };
  const unselectFormItem = (e: MouseEvent) => {
    if (
      ((e.target as HTMLElement) !== document.getElementById("leftPanel")! &&
        (e.target as HTMLElement).closest("#leftPanel")) ||
      (e.target as HTMLElement).closest("#upButton") ||
      (e.target as HTMLElement).closest("#downButton") ||
      (e.target as HTMLElement).closest("#editModal")
    ) {
      console.log("uselect not needed");
    } else {
      const formItems = Array.from(
        document.getElementById("leftPanel")!.children
      );
      formItems.forEach((item) => {
        item.classList.remove("bg-orange-100");
      });
      setSelectedFormItem("");
    }
    document.removeEventListener("click", unselectFormItem);
  };
  useEffect(() => {
    if (selectedFormItem !== "") {
      const formItems = Array.from(
        document.getElementById("leftPanel")!.children
      );
      formItems.forEach((item) => {
        item.classList.remove("bg-orange-100");
      });
      document.getElementById(selectedFormItem)?.classList.add("bg-orange-100");
      document.addEventListener("click", unselectFormItem);
    }
  }, [formItems, selectedFormItem]);

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg space-y-2">
      <div className="w-full flex items-center p-4 bg-white rounded-lg">
        <div className="w-1/2 flex justify-between">
          <label className="text-md font-semibold text-gray-800 mr-2">
            Form
          </label>
          <div className="flex-1">
            <input
              type="text"
              maxLength={150}
              placeholder="Name your form"
              className="w-full border-b border-gray-300 focus:outline-none text-gray-500 bg-transparent"
              onChange={(e) => {
                setFormName(e.target.value);
              }}
            />
            <p className="text-right text-gray-500 text-xs">
              {formName.length} / 150
            </p>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-end space-x-10 pl-20">
          <i className="fas fa-list text-green-500"></i>
          <i className="fas fa-users text-gray-400"></i>
          <i className="fas fa-file-export text-gray-400"></i>
          <i className="fas fa-share-alt text-gray-400"></i>
          <i className="fas fa-cog text-gray-400"></i>
          <i className="fas fa-search text-gray-400"></i>
        </div>
      </div>
      <div className="w-full flex">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col">
          <div
            id="leftPanel"
            className="w-full h-[300px] bg-gray-200 rounded-lg shadow space-y-1 overflow-auto"
          >
            {formItems.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>
          <div className="flex justify-start space-x-2 mt-2">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
              disabled={selectedFormItem === ""}
              onClick={() => {
                duplicateFormItem();
              }}
            >
              Duplicate
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
              disabled={selectedFormItem === ""}
              onClick={() => {
                setItemToDelete(selectedFormItem.slice(1));
                document
                  .getElementById("deleteModal")
                  ?.classList.remove("hidden");
              }}
            >
              Delete
            </button>
            <button
              id="upButton"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
              disabled={selectedFormItem === ""}
              onClick={() => {
                const formItemToMove = formItems.filter(
                  (item) => item.key === selectedFormItem.slice(1)
                );
                const index = formItems.indexOf(formItemToMove[0]);
                if (index === 0) return;
                const newFormItems = [...formItems];
                [newFormItems[index - 1], newFormItems[index]] = [
                  newFormItems[index],
                  newFormItems[index - 1],
                ];
                setFormItems(newFormItems);
              }}
            >
              <i className="fas fa-arrow-up"></i>
            </button>
            <button
              id="downButton"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
              disabled={selectedFormItem === ""}
              onClick={() => {
                const formItemToMove = formItems.filter(
                  (item) => item.key === selectedFormItem.slice(1)
                );
                const index = formItems.indexOf(formItemToMove[0]);
                if (index === formItemsLength - 1) return;
                const newFormItems = [...formItems];
                [newFormItems[index], newFormItems[index + 1]] = [
                  newFormItems[index + 1],
                  newFormItems[index],
                ];
                setFormItems(newFormItems);
              }}
            >
              <i className="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
        {/* Right Panel */}
        <div className="w-1/2 ml-4">
          <div className="grid grid-cols-3 gap-2">
            {fields.map((field, index) => (
              <button
                key={index}
                className="bg-gray-200 p-2 rounded-lg flex items-center justify-center"
                onClick={() => createFormItem(field)}
              >
                <i className={`${field.icon} ${field.color}`} />
                <span className="ml-2">{field.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => {
            console.log("Save form");
            if (formName.length === 0)
              return toast("Form Name is Required", { type: "error" });
          }}
        >
          <i className="fas fa-check mr-2"></i> Save
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center">
          <i className="fas fa-sign-out-alt mr-2"></i> Quit
        </button>
      </div>
      {/* Delete Modal */}
      <div
        id="deleteModal"
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center hidden"
      >
        <div className="max-w-md bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Delete</h2>
          <p className="mb-4">
            Can you confirm you want to delete the selected element?
          </p>
          <div className="flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
              onClick={deleteFormItem}
            >
              Delete
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
              onClick={() => {
                document.getElementById("deleteModal")!.classList.add("hidden");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* edit Modal */}
      <div
        id="editModal"
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center hidden"
      >
        <div className="bg-white shadow-lg rounded-lg w-full max-w-lg max-w-4xl p-3">
          {formItemDetails.map((itemD, index) => {
            if (itemD.id === selectedFormItem.slice(1)) {
              switch (itemD.title) {
                case "Input field":
                  return <EditInputField key={index} itemD={itemD} />;
                case "Text Area":
                  return <EditTextArea key={index} itemD={itemD} />;
                case "Date & Time":
                  return <EditDateTime key={index} itemD={itemD} />;
                case "Check Box":
                  return <EditCheckBox key={index} itemD={itemD} />;
                case "List":
                  return <EditList key={index} itemD={itemD} />;
                case "Choice":
                  return <EditChoice key={index} itemD={itemD} />;
                case "Photo":
                  return <EditPhoto key={index} itemD={itemD} />;
                case "Voice Recorder":
                  return <EditVoiceRecorder key={index} itemD={itemD} />;
                case "Attached file":
                  return <EditAttachedFile key={index} itemD={itemD} />;
                case "Table":
                  return <EditTable key={index} itemD={itemD} />;
                case "Image":
                  return <EditImage key={index} itemD={itemD} />;
                case "Calculation":
                  return <EditCalculation key={index} itemD={itemD} />;
              }
            }
          })}
        </div>
      </div>
    </div>
  );
}
