import { FormItemDetails } from "@/types/types";
import RenderList from "./renderList";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import RenderChoice from "./renderChoice";
import RenderPhoto from "./renderPhoto";
import VoiceRecorder from "./renderVoiceRecorder";
import RenderAttachedFile from "./renderAttachedFile";
import RenderTable from "./renderTable";
import RenderImage from "./renderImage";
import RenderCalculation from "./renderCalculation";
import RenderInputField from "./renderInputField";
import RenderTextArea from "./renderTextArea";
import RenderDateTime from "./renderDate&Time";
import RenderCheckbox from "./renderCheckbox";
import axios from "axios";
import { Loader2 } from "lucide-react";

export interface FormState {
  [key: string]: string | boolean | string[] | File[] | Blob[] | string[][];
}

type Props = {
  companyName: string;
  showFillFormModal: boolean;
  setShowFillFormModal: (showFillFormModal: boolean) => void;
  formItemDetails: FormItemDetails[];
  setFormItemDetails: (formItemDetails: FormItemDetails[]) => void;
  formToFillTitle: string;
  setFormToFillTitle: (formToFillTitle: string) => void;
};
export default function FillForm({
  companyName,
  showFillFormModal,
  setShowFillFormModal,
  formItemDetails,
  setFormItemDetails,
  formToFillTitle,
  setFormToFillTitle,
}: Props) {
  const [formState, setFormState] = useState<FormState>({});
  const [isSavingForm, setIsSavingForm] = useState(false);
  useEffect(() => {
    const initState: FormState = {};
    formItemDetails.map((itemD) => {
      if (itemD.title === "Date & Time") {
        if (itemD.type === "datetime-local") {
          if (itemD.defaultDate !== "" && itemD.defaultTime !== "") {
            initState[itemD.newTitle] =
              itemD.defaultDate! + "T" + itemD.defaultTime!;
          } else if (itemD.defaultDate !== "") {
            initState[itemD.newTitle] = itemD.defaultDate! + "T00:00";
          } else if (itemD.defaultTime !== "") {
            initState[itemD.newTitle] =
              `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()}T` + itemD.defaultTime!;
          } else {
            initState[itemD.newTitle] = "";
          }
        } else if (itemD.type === "date") {
          initState[itemD.newTitle] = itemD.defaultDate!;
        } else {
          initState[itemD.newTitle] = itemD.defaultTime!;
        }
      } else if (itemD.title === "Check Box") {
        initState[itemD.newTitle] = itemD.checkBoxDefaultValue!;
      } else if (itemD.title === "List") {
        if (itemD.listMultipleSelection) {
          initState[itemD.newTitle] = itemD.listMulDefaultValue!;
        } else {
          initState[itemD.newTitle] = itemD.listDefaultValue!;
        }
      } else if (itemD.title === "Choice") {
        initState[itemD.newTitle] = itemD.listDefaultValue!;
      } else if (itemD.title === "Attached file") {
        initState[itemD.newTitle] = [];
      } else if (itemD.title === "Photo") {
        initState[itemD.newTitle] = [];
      } else if (itemD.title === "Voice Recorder") {
        initState[itemD.newTitle] = [];
      } else if (itemD.title === "Image") {
        initState[itemD.newTitle] = itemD.imageFileNames!;
      } else if (itemD.title === "Calculation") {
        initState[itemD.newTitle] = "0";
      } else if (itemD.title === "Table") {
        const emptyArray = Array.from(
          { length: itemD.tableMaxRows! },
          (i: number) => [
            i + 1,
            ...new Array(itemD.tableCols!.length - 1).fill(""),
          ]
        );
        emptyArray.forEach((row, index) => {
          row[0] = index + 1;
        });
        initState[itemD.newTitle] = emptyArray;
        initState[`${itemD.newTitle}RowCount`] = "1";
      } else {
        initState[itemD.newTitle] = "";
      }
    });
    setFormState(initState);
  }, [formItemDetails]);
  return (
    <div
      className={`${
        showFillFormModal ? "" : "hidden"
      } fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-start justify-center overflow-scroll`}
    >
      <form className="max-w-[90vw] bg-gray-500 p-6 rounded-lg shadow-lg flex flex-col items-start justify-start space-y-5">
        <h1 className="w-full text-center text-2xl font-bold">
          {formToFillTitle}
        </h1>
        {formItemDetails.map((itemD, index) => {
          if (itemD.title === "Input field") {
            return (
              <RenderInputField
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Text Area") {
            return (
              <RenderTextArea
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Date & Time") {
            return (
              <RenderDateTime
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Check Box") {
            return (
              <RenderCheckbox
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "List") {
            return (
              <RenderList
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Choice") {
            return (
              <RenderChoice
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Photo") {
            return (
              <RenderPhoto
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Voice Recorder") {
            return (
              <VoiceRecorder
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Attached file") {
            return (
              <RenderAttachedFile
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Table") {
            return (
              <RenderTable
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
              />
            );
          }
          if (itemD.title === "Image") {
            return <RenderImage key={index} itemD={itemD} />;
          }
          if (itemD.title === "Calculation") {
            return (
              <RenderCalculation
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                formItemDetails={formItemDetails}
              />
            );
          }
        })}
        <div className="w-full flex items-center justify-between text-white">
          <button
            type="submit"
            className="bg-green-500 p-2 rounded-lg cursor-pointer"
            onClick={async (e) => {
              e.preventDefault();
              console.log(formState);
              setIsSavingForm(true);
              const errors: string[] = [];
              formItemDetails.map((itemD) => {
                if (itemD.required) {
                  if (itemD.title === "Table") {
                    let flag = 0;
                    (formState[itemD.newTitle] as string[][]).map((row) => {
                      row.map((colItem) => {
                        if (
                          parseInt(row[0]) <=
                          parseInt(
                            formState[`${itemD.newTitle}RowCount`] as string
                          )
                        ) {
                          if (colItem === "") {
                            flag = 1;
                          }
                        }
                      });
                    });
                    if (flag === 1) {
                      errors.push(
                        `Every field in ${itemD.newTitle} is required`
                      );
                    }
                  }
                  if (
                    formState[itemD.newTitle] === "" ||
                    formState[itemD.newTitle] === null ||
                    formState[itemD.newTitle] === undefined ||
                    (formState[itemD.newTitle] as string[]).length === 0 ||
                    (formState[itemD.newTitle] as File[]).length === 0 ||
                    (formState[itemD.newTitle] as Blob[]).length === 0 ||
                    (formState[itemD.newTitle] as string[][]).length === 0
                  ) {
                    errors.push(`${itemD.newTitle} is required`);
                  }
                }
              });
              if (errors.length > 0) {
                toast(errors.join(",\n"), { type: "error" });
                setIsSavingForm(false);
                return;
              }
              // save the form
              try {
                const response = await axios.post("/api/saveFilledForm", {
                  title: formToFillTitle,
                  formItemDetails,
                  formState,
                  companyName,
                });
                if (response.data.success) {
                  toast("Form saved Successfully", { type: "success" });
                  setFormToFillTitle("");
                  setFormItemDetails([]);
                  setShowFillFormModal(false);
                } else {
                  toast("Error saving the form, Please try again", {
                    type: "error",
                  });
                }
              } catch (error) {
                console.log(error);
                toast("Error saving the form, Please try again", {
                  type: "error",
                });
              } finally {
                setIsSavingForm(false);
              }
            }}
          >
            {isSavingForm ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            className="bg-red-500 p-2 rounded-lg cursor-pointer"
            onClick={() => {
              setFormToFillTitle("");
              setFormItemDetails([]);
              setShowFillFormModal(false);
            }}
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
