import React, { ReactElement, useCallback, useEffect, useState } from "react";
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
import DeleteModal from "./deleteModal";

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
  const [nameEditFormItem, setNameEditFormItem] = useState("");
  const [editedName, setEditedName] = useState("");

  const createFormItem = (f: {
    icon: string;
    label: string;
    color: string;
  }) => {
    const newFormItem = (
      <FormItem
        key={formItemsLength}
        id={formItemsLength.toString()}
        title={f.label}
        color={f.color}
        icon={f.icon}
        setItemToCopy={setItemToCopy}
        setItemToDelete={setItemToDelete}
        setSelectedFormItem={setSelectedFormItem}
        setNameEditFormItem={setNameEditFormItem}
        setEditedName={setEditedName}
      />
    );
    let newFormItemDetail: FormItemDetails = {
      title: f.label,
      newTitle: f.label,
      id: formItemsLength.toString(),
      size: "normal",
      color: f.color,
      newColor: "white",
      icon: f.icon,
    };
    if (f.label === "Date & Time") {
      newFormItemDetail = {
        ...newFormItemDetail,
        type: "datetime-local",
        defaultDate: "",
        defaultTime: "",
        required: true,
      };
    } else if (f.label === "Check Box") {
      newFormItemDetail = {
        ...newFormItemDetail,
        checkBoxDefaultValue: false,
        required: false,
      };
    } else if (f.label === "List") {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        listItems: [],
        listMultipleSelection: false,
        listMulDefaultValue: [],
        listDefaultValue: "No items in list",
      };
    } else if (f.label === "Choice") {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        listItems: [],
        listDefaultValue: "No items in list",
      };
    } else if (f.label === "Photo") {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        multiplePics: false,
        minPics: 0,
        maxPics: 1,
        maxPicSize: 2,
      };
    } else if (f.label === "Attached file") {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        multipleAttachments: false,
      };
    } else if (f.label === "Table") {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        tableCols: ["S.No."],
      };
    } else if (f.label === "Image") {
      newFormItemDetail = {
        ...newFormItemDetail,
        imageFiles: [],
      };
    } else if (f.label === "Input field") {
      newFormItemDetail = {
        ...newFormItemDetail,
        type: "text",
        required: true,
        placeholder: "Default Text",
      };
    } else if (f.label === "Calculation") {
      newFormItemDetail = {
        ...newFormItemDetail,
        type: "add",
        calcInput1: "",
        calcInput2: "",
      };
    }
    setFormItems([...formItems, newFormItem]);
    setFormItemDetails([...formItemDetails, newFormItemDetail]);
    setFormItemsLength(formItemsLength + 1);
  };
  useEffect(() => {
    if (nameEditFormItem !== "" && editedName !== "") {
      const nfid = [...formItemDetails];
      const nfidArray = nfid.filter(
        (item) => item.id === nameEditFormItem.slice(1)
      );
      const nfi = [...formItems];
      const nfiArray = nfi.filter(
        (item) => item.key === nameEditFormItem.slice(1)
      );
      const item = nfiArray[0];
      const copy = React.cloneElement(item, {
        key: item.key,
        id: item.props.id,
        icon: item.props.icon,
        title: editedName,
        color: item.props.color,
      });
      const i = nfi.indexOf(item);
      nfi.splice(i, 1, copy);
      const itemD = nfidArray[0];
      itemD.newTitle = editedName;
      const index = nfid.indexOf(itemD);
      nfid.splice(index, 1, itemD);
      setFormItems(nfi);
      setFormItemDetails(nfid);
      setNameEditFormItem("");
      setEditedName("");
    }
  }, [
    nameEditFormItem,
    setNameEditFormItem,
    editedName,
    setEditedName,
    formItems,
    setFormItems,
    formItemDetails,
    setFormItemDetails,
  ]);
  const duplicateFormItem = useCallback(() => {
    const fiToCopy = formItems.filter(
      (item) => item.key === selectedFormItem.slice(1)
    );
    const index = formItems.indexOf(fiToCopy[0]);
    const ficopy = React.cloneElement(fiToCopy[0], {
      key: formItemsLength.toString(),
      id: formItemsLength.toString(),
      icon: fiToCopy[0].props.icon,
      title: `(copy) ${fiToCopy[0].props.title}`,
      color: fiToCopy[0].props.color,
    });
    const newFormItems = [...formItems];
    newFormItems.splice(index + 1, 0, ficopy);
    const fidToCopy = formItemDetails.filter(
      (itemD) => itemD.id === selectedFormItem.slice(1)
    );
    const i = formItemDetails.indexOf(fidToCopy[0]);
    const fidcopy = {
      ...fidToCopy[0],
      newTitle: `(copy) ${fidToCopy[0].newTitle}`,
      id: formItemsLength.toString(),
    };
    const newFormItemDetails = [...formItemDetails];
    newFormItemDetails.splice(i + 1, 0, fidcopy);
    setFormItemDetails(newFormItemDetails);
    setFormItems(newFormItems);
    setFormItemsLength(formItemsLength + 1);
  }, [formItems, selectedFormItem, formItemDetails, formItemsLength]);
  useEffect(() => {
    if (itemToCopy !== "") {
      duplicateFormItem();
      setItemToCopy("");
    }
  }, [itemToCopy]);
  const deleteFormItem = () => {
    const newItems = formItems.filter((item) => item.key !== itemToDelete);
    const nfid = formItemDetails.filter((itemD) => itemD.id !== itemToDelete);
    setFormItemDetails(nfid);
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
    } else {
      if (document.getElementById("leftPanel")) {
        const fItems = Array.from(
          document.getElementById("leftPanel")!.children
        );
        fItems.forEach((item) => {
          item.classList.remove("bg-orange-100");
        });
        setSelectedFormItem("");
      }
    }
    document.removeEventListener("click", unselectFormItem);
  };
  useEffect(() => {
    if (selectedFormItem !== "") {
      const fItems = Array.from(document.getElementById("leftPanel")!.children);
      fItems.forEach((item) => {
        item.classList.remove("bg-orange-100");
      });
      document.getElementById(selectedFormItem)?.classList.add("bg-orange-100");
      document.addEventListener("click", unselectFormItem);
    }
  }, [selectedFormItem, unselectFormItem]);

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
      <DeleteModal deleteFormItem={deleteFormItem} />
      {/* edit Modal */}
      <div
        id="editModal"
        className="fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center hidden overflow-auto"
      >
        <div className="bg-white shadow-lg rounded-lg w-full max-w-lg max-w-4xl p-3">
          {formItemDetails.map((itemD, index) => {
            if (itemD.id === selectedFormItem.slice(1)) {
              switch (itemD.title) {
                case "Input field":
                  return (
                    <EditInputField
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Text Area":
                  return (
                    <EditTextArea
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Date & Time":
                  return (
                    <EditDateTime
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Check Box":
                  return (
                    <EditCheckBox
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "List":
                  return (
                    <EditList
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Choice":
                  return (
                    <EditChoice
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Photo":
                  return (
                    <EditPhoto
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Voice Recorder":
                  return (
                    <EditVoiceRecorder
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Attached file":
                  return (
                    <EditAttachedFile
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Table":
                  return (
                    <EditTable
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Image":
                  return (
                    <EditImage
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
                case "Calculation":
                  return (
                    <EditCalculation
                      key={index}
                      itemD={itemD}
                      formItemDetails={formItemDetails}
                      setFormItemDetails={setFormItemDetails}
                    />
                  );
              }
            }
          })}
        </div>
      </div>
    </div>
  );
}
