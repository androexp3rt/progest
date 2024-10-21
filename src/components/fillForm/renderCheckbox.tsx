import { FormItemDetails } from "@/types/types";
import { FormState } from "./fillForm";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderCheckbox({
  itemD,
  formState,
  setFormState,
}: Props) {
  return (
    <div className="w-full flex items-center justify-start space-x-2">
      <input
        id={itemD.newTitle}
        type="checkbox"
        defaultChecked={(formState[itemD.newTitle] as string) !== ""}
        onChange={(e) => {
          if (e.target.checked) {
            setFormState({ ...formState, [itemD.newTitle]: itemD.newTitle });
          } else {
            setFormState({ ...formState, [itemD.newTitle]: "" });
          }
        }}
        className={`bg-gray-200 rounded-lg ${
          itemD.size === "smaller"
            ? "w-6 h-6"
            : itemD.size === "normal"
            ? "w-8 h-8"
            : "w-10 h-10"
        }`}
      />
      <label
        htmlFor={itemD.newTitle}
        className={`${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        } font-bold text-${itemD.newColor}`}
      >
        {itemD.newTitle}
      </label>
    </div>
  );
}
