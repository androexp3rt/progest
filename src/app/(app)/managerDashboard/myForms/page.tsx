"use client";
import { Form } from "@/model/form";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoxIcon from "@/components/boxIcon";
import { Loader2 } from "lucide-react";
import { FormItemDetails } from "@/types/types";
import FillForm from "@/components/fillForm/fillForm";
import { FilledForm } from "@/model/filledForm";
import { useRouter } from "next/navigation";

interface FilledFormsMap {
  [formName: string]: FilledForm[] | undefined;
}

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
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;
  const email: string = session?.user.email;

  const getFilledForms = async (formName: string) => {
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
  };

  const getForms = async () => {
    setLoadingForms(true);
    try {
      const response = await axios.get(`/api/getFormsByCompany/${companyName}`);
      if (response.data.success) {
        setForms(response.data.forms);
        response.data.forms.map((form: Form) => {
          getFilledForms(form.title);
        });
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
    const getCompanyForms = async () => {
      setLoadingForms(true);
      try {
        const response = await axios.get(
          `/api/getFormsByCompany/${companyName}`
        );
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
    getCompanyForms();
  }, [session, companyName]);

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
  const modifyForm = () => {};
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
              <span className="w-[30%]">Name</span>
              <span className="w-[10%]"># of Fields</span>
              <span className="w-[10%]"># of Records</span>
              <span className="flex-1">Actions</span>
            </div>
            {forms?.map((form, index) => {
              return (
                <div key={index}>
                  <div className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 border border-black rounded-lg">
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
                    <div className="flex-1 flex justify-center items-center gap-2">
                      <button
                        className="p-2 bg-white/50 rounded-lg"
                        onClick={modifyForm}
                      >
                        Modify
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
                            ? "Hide Records"
                            : "Show Records"}
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
                      <span onClick={() => deleteForm(form._id)}>
                        <BoxIcon name="bx-trash" />
                      </span>
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
                        <span className="w-[50%] flex items-center justify-center">
                          <span
                            onClick={() =>
                              deleteFilledForm(record._id, record.title)
                            }
                          >
                            <i className="fa fa-trash" />
                          </span>
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
    </div>
  );
}
