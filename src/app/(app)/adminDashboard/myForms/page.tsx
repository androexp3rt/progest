"use client";
import { Form } from "@/model/form";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormItemDetails, FormState } from "@/types/types";
import FillForm from "@/components/fillForm/fillForm";
import { FilledFormsMap } from "@/types/types";
import CreateForm from "@/components/createForm/createForm";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [filledForms, setFilledForms] = useState<FilledFormsMap>({});
  const [loadingForms, setLoadingForms] = useState(false);
  const [loadingFilledForms, setLoadingFilledForms] = useState(false);
  const [showFillFormModal, setShowFillFormModal] = useState(false);
  const [formTofill, setFormToFill] = useState<FormItemDetails[]>([]);
  const [formToFillTitle, setFormToFillTitle] = useState("");
  const [showRecords, setshowRecords] = useState(false);
  const [formNameToShowRecords, setFormNameToShowRecords] = useState("");
  const [eFormItemDetails, setEFormItemDetails] = useState<FormItemDetails[]>(
    []
  );
  const [eFormItems, setEFormItems] = useState<ReactElement[]>([]);
  const [eFormItemsLength, setEFormItemsLength] = useState(0);
  const [eFormName, setEFormName] = useState("");
  const [showModifyFormModal, setShowModifyFormModal] = useState(false);
  const [eCompanyName, setECompanyName] = useState("");

  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;
  const email: string = session?.user.email;
  const role: string = session?.user.role;

  const getFilledForms = useCallback(async (formName: string) => {
    setLoadingFilledForms(true);
    try {
      const response = await axios.get(
        `/api/getFilledForms/${formName}/${companyName}`
      );
      if (response.data.success) {
        setFilledForms((prevFilledForms) => ({
          ...prevFilledForms,
          [formName]: response.data.forms,
        }));
      } else {
        setFilledForms((prevFilledForms) => ({
          ...prevFilledForms,
          [formName]: [],
        }));
      }
    } catch (error) {
      console.log(error);
      setFilledForms((prevFilledForms) => ({
        ...prevFilledForms,
        [formName]: [],
      }));
    } finally {
      setLoadingFilledForms(false);
    }
  }, []);
  const getForms = async () => {
    setLoadingForms(true);
    try {
      const response = await axios.get(`/api/getAllForms`);
      if (response.data.success) {
        setForms(response.data.forms);
      } else {
        setForms([]);
      }
    } catch (error) {
      console.log(error);
      setForms([]);
    } finally {
      setLoadingForms(false);
    }
  };
  useEffect(() => {
    const getAllForms = async () => {
      setLoadingForms(true);
      try {
        const response = await axios.get(`/api/getAllForms`);
        if (response.data.success) {
          setForms(response.data.forms);
          response.data.forms.map((form: Form) => {
            getFilledForms(form.title);
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingForms(false);
      }
    };
    getAllForms();
  }, [session, getFilledForms]);

  const deleteForm = async (id: unknown) => {
    try {
      const res = await axios.post("/api/deleteFormById", { id });
      if (res.data.success) {
        toast(res.data.message, { type: "success" });
        getForms();
      } else {
        toast(res.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      toast("Error deleting Form", { type: "error" });
    }
  };
  const displayFormToFill = ({
    title,
    fid,
  }: {
    title: string;
    fid: FormItemDetails[];
  }) => {
    setFormToFillTitle(title);
    setFormToFill(fid);
    setShowFillFormModal(true);
  };
  const deleteFilledForm = async (id: unknown, formName: string) => {
    try {
      const res = await axios.post("/api/deleteFilledFormById", { id });
      if (res.data.success) {
        toast(res.data.message, { type: "success" });
        getFilledForms(formName);
      } else {
        toast(res.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      toast("Error deleting Form", { type: "error" });
    }
  };
  const exportToExcel = (recordState: FormState, recordName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([recordState]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${recordName}.xlsx`);
  };
  const exportAllRecordsToExcel = (formName: string) => {
    const exportArr: FormState[] = [];
    filledForms[formName]?.map((record) => {
      exportArr.push(record.formState);
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportArr);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${formName}.xlsx`);
  };
  useEffect(() => {
    if (!showFillFormModal && formToFillTitle !== "") {
      getFilledForms(formToFillTitle);
      setFormToFillTitle("");
    }
  }, [showFillFormModal, formToFillTitle, getFilledForms]);
  return (
    <div className="w-full h-full flex flex-col space-y-5 p-5 bg-slate-400 overflow-auto">
      <h1 className="w-full text-center text-3xl font-bold">Forms</h1>
      <div className="flex flex-col items-center bg-white/30 backdrop-blur-sm rounded-lg p-2 space-y-5">
        {loadingForms ? (
          <Loader2 className="animate-spin" />
        ) : forms.length === 0 ? (
          <div className="w-full flex flex-col space-y-2">
            <p className="text-center text-xl font-bold">
              No Forms Found, Please Create a Form first
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-2">
            <div className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 bg-slate-500 rounded-lg">
              <span className="w-[20%]">Company Name</span>
              <span className="w-[30%]">Name</span>
              <span className="w-[10%]"># of Fields</span>
              <span className="w-[10%]"># of Records</span>
              <span className="flex-1">Actions</span>
            </div>
            {forms?.map((form, index) => {
              return (
                <div key={index}>
                  <div className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 border border-black rounded-lg">
                    <span className="w-[20%] text-ellipsis whitespace-nowrap overflow-hidden">
                      {form.companyName}
                    </span>
                    <span className="w-[30%] text-ellipsis whitespace-nowrap overflow-hidden">
                      {form.title}
                    </span>
                    <span className="w-[10%] text-ellipsis whitespace-nowrap overflow-hidden">
                      {form.formItems.length}
                    </span>
                    <span className="w-[10%] flex items-center justify-center text-center text-ellipsis whitespace-nowrap overflow-hidden">
                      {loadingFilledForms ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        filledForms[form.title]?.length ?? 0
                      )}
                    </span>
                    <div className="flex-1 flex flex-wrap justify-center gap-2 overflow-hidden">
                      <button
                        disabled={
                          !filledForms[form.title] ||
                          (filledForms[form.title] &&
                            filledForms[form.title]!.length === 0)
                        }
                        className="p-2 flex items-center justify-center space-x-2 bg-white/50 rounded-lg disabled:text-gray-200"
                        onClick={() => {
                          if (
                            showRecords &&
                            formNameToShowRecords === form.title &&
                            filledForms[form.title] &&
                            filledForms[form.title]!.length > 0
                          ) {
                            setshowRecords(false);
                            setFormNameToShowRecords("");
                          } else {
                            setshowRecords(true);
                            setFormNameToShowRecords(form.title);
                          }
                        }}
                      >
                        <span>
                          {showRecords &&
                          formNameToShowRecords === form.title &&
                          filledForms[form.title] &&
                          filledForms[form.title]!.length > 0
                            ? "Records"
                            : "Records"}
                        </span>
                        <i
                          className={`fa fa-chevron-down transform ${
                            showRecords &&
                            formNameToShowRecords === form.title &&
                            filledForms[form.title] &&
                            filledForms[form.title]!.length > 0
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        className="p-2 bg-white/50 rounded-lg"
                        onClick={() => exportAllRecordsToExcel(form.title)}
                      >
                        Export
                      </button>
                      <button
                        className="p-2 bg-white/50 rounded-lg"
                        onClick={() =>
                          displayFormToFill({
                            title: form.title,
                            fid: form.formItemDetails,
                          })
                        }
                      >
                        Fill Form
                      </button>
                      <button
                        className="p-2 bg-white/50 rounded-lg"
                        onClick={() => {
                          setEFormItemDetails(form.formItemDetails);
                          setEFormItems(form.formItems);
                          setEFormItemsLength(form.formItemsLength);
                          setEFormName(form.title);
                          setECompanyName(form.companyName);
                          setShowModifyFormModal(true);
                        }}
                      >
                        <i className="fa fa-edit" />
                      </button>
                      <button
                        className="p-2 flex items-center justify-center space-x-2 bg-white/50 rounded-lg disabled:text-gray-200"
                        onClick={() => deleteForm(form._id)}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${
                      showRecords &&
                      formNameToShowRecords === form.title &&
                      filledForms[form.title] &&
                      filledForms[form.title]!.length > 0
                        ? "flex"
                        : "hidden"
                    } flex-col`}
                  >
                    <div className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 bg-slate-500 rounded-lg">
                      <span className="w-[5%]">#</span>
                      <span className="w-[22%]">FilledBy</span>
                      <span className="w-[22%]">Created At</span>
                      <span className="w-[50%]">Actions</span>
                    </div>
                    {filledForms[form.title]?.map((record, i) => (
                      <div
                        key={i}
                        className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 border border-black rounded-lg"
                      >
                        <span className="w-[5%] text-ellipsis whitespace-nowrap overflow-hidden">
                          {i + 1}
                        </span>
                        <span className="w-[22%] text-ellipsis whitespace-nowrap overflow-hidden">
                          {record.filledBy}
                        </span>
                        <span className="w-[22%] text-ellipsis whitespace-nowrap overflow-hidden">
                          {record.createdAt.toString()}
                        </span>
                        <span className="w-[50%] flex items-center justify-center space-x-2">
                          <button
                            className="p-2 bg-white/50 rounded-lg"
                            onClick={() =>
                              exportToExcel(record.formState, record.title)
                            }
                          >
                            Export to Excel
                          </button>
                          <button
                            className="p-2 bg-white/50 rounded-lg"
                            onClick={() =>
                              deleteFilledForm(record._id, record.title)
                            }
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <FillForm
        email={email}
        companyName={companyName}
        showFillFormModal={showFillFormModal}
        setShowFillFormModal={setShowFillFormModal}
        formItemDetails={formTofill}
        setFormItemDetails={setFormToFill}
        formToFillTitle={formToFillTitle}
        setFormToFillTitle={setFormToFillTitle}
      />
      <div
        className={`${
          showModifyFormModal ? "" : "hidden"
        } fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex flex-col items-start justify-center overflow-scroll px-5 space-y-2`}
      >
        <CreateForm
          eFormItemDetails={eFormItemDetails}
          eFormItems={eFormItems}
          eFormItemsLength={eFormItemsLength}
          eFormName={eFormName}
          eCompanyName={eCompanyName}
          setShowModifyFormModal={setShowModifyFormModal}
          role={role}
        />
      </div>
    </div>
  );
}
