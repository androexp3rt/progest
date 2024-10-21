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

export default function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [showFillFormModal, setShowFillFormModal] = useState(false);
  const [formTofill, setFormToFill] = useState<FormItemDetails[]>([]);
  const [formToFillTitle, setFormToFillTitle] = useState("");
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;

  const getForms = async () => {
    setLoadingForms(true);
    try {
      const response = await axios.get(`/api/getFormsByCompany/${companyName}`);
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
    const getCompanyForms = async () => {
      setLoadingForms(true);
      try {
        const response = await axios.get(
          `/api/getFormsByCompany/${companyName}`
        );
        if (response.data.success) {
          setForms(response.data.forms);
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
              <span className="w-1/3">Name</span>
              <span className="w-1/3"># of Fields</span>
              <span className="w-1/3">Actions</span>
            </div>
            {forms?.map((form, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 border border-black rounded-lg"
                >
                  <span className="w-1/3 text-ellipsis whitespace-nowrap overflow-hidden">
                    {form.title}
                  </span>
                  <span className="w-1/3 text-ellipsis whitespace-nowrap overflow-hidden">
                    {form.formItems.length}
                  </span>
                  <div className="w-1/3 flex justify-center items-center gap-2">
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
                    <span onClick={() => deleteForm(form._id)}>
                      <BoxIcon name="bx-trash" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <FillForm
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
