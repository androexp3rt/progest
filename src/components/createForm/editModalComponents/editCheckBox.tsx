import { FormItemDetails } from "@/types/types";
import React from "react";

type Props = {
  itemD: FormItemDetails;
};

export default function EditCheckBox({ itemD }: Props) {
  return (
    <form className="w-full flex flex-col pb-5 space-y-2">
      <p>Title :</p>
      <input type="text" placeholder={itemD.title} />
      <p>Type :</p>
      <select>
        <option value=""></option>
      </select>
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
