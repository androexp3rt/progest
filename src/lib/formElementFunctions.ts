type Props = {
  f: {
    icon: string;
    label: string;
    color: string;
  };
  setItemToBeDeleted: (itemToBeDeleted: HTMLDivElement | null) => void;
  setSelectedFormItem: (itemToBeDeleted: HTMLDivElement | null) => void;
};
export const createFormChild = ({
  f,
  setItemToBeDeleted,
  setSelectedFormItem,
}: Props) => {
  const form = document.getElementById("leftPanel")! as HTMLDivElement;
  const icon = document.createElement("i");
  icon.className = `${f.icon} ${f.color}`;
  const elem = document.createElement("input");
  elem.className =
    "ml-2 text-lg font-semibold outline-green-400 rounded-md p-2";
  elem.value = f.label;
  const innerDivOne = document.createElement("div");
  innerDivOne.className = "flex items-center";
  innerDivOne.appendChild(icon);
  innerDivOne.appendChild(elem);
  const edit = document.createElement("i");
  edit.className = "fas fa-edit text-gray-500 cursor-pointer";
  const copy = document.createElement("i");
  copy.className = "fas fa-copy text-gray-500 cursor-pointer";
  const del = document.createElement("i");
  del.className = "fas fa-trash text-gray-500 cursor-pointer";
  del.onclick = () => {
    setItemToBeDeleted(outerDiv);
    document.getElementById("deleteModal")?.classList.remove("hidden");
  };
  const innerDivTwo = document.createElement("div");
  innerDivTwo.className = "flex space-x-5";
  innerDivTwo.appendChild(edit);
  innerDivTwo.appendChild(copy);
  innerDivTwo.appendChild(del);
  const outerDiv = document.createElement("div");
  outerDiv.className = `flex items-center justify-between p-2 bg-green-100`;
  outerDiv.appendChild(innerDivOne);
  outerDiv.appendChild(innerDivTwo);
  form.appendChild(outerDiv);
  elem.focus();
  if (!form.children[0].classList.contains("rounded-t-lg")) {
    form.children[0].classList.add("rounded-t-lg");
  }
  outerDiv.onclick = (e) => {
    if (e.target !== elem) {
      outerDiv.classList.add("bg-orange-100");
      document.addEventListener("click", unselectFormItem);
      setSelectedFormItem(outerDiv);
    }
  };
  const unselectFormItem = (e: MouseEvent) => {
    if (e.target !== outerDiv) {
      outerDiv.classList.remove("bg-orange-100");
      document.removeEventListener("click", unselectFormItem);
      setSelectedFormItem(null);
    }
    const children = Array.from(form.children);
    children.forEach((child) => {
      if (e.target === child) {
        setSelectedFormItem(child as HTMLDivElement);
      }
    });
  };
};
type DuplicateFormChildProps = {
  selectedFormItem: HTMLDivElement | null;
  setSelectedFormItem: (selectedFormItem: HTMLDivElement | null) => void;
};
export const duplicateFormChild = ({
  selectedFormItem,
  setSelectedFormItem,
}: DuplicateFormChildProps) => {
  const form = document.getElementById("leftPanel")! as HTMLDivElement;
  const children = Array.from(form.children);
  const index = children.indexOf(selectedFormItem as Element);
  const copy = selectedFormItem!.cloneNode(true);
  (copy as HTMLDivElement).classList.remove("bg-orange-100");
  (copy.childNodes[0].childNodes[1] as HTMLInputElement).value = `(copy) ${
    (selectedFormItem!.children[0].children[1] as HTMLInputElement).value
  }`;
  (copy as HTMLDivElement).onclick = (e) => {
    const elem = copy.childNodes[0].childNodes[1] as HTMLInputElement;
    if (e.target !== elem) {
      (copy as HTMLDivElement).classList.add("bg-orange-100");
      document.addEventListener("click", unselectFormItem);
      setSelectedFormItem(copy as HTMLDivElement);
    }
  };
  const unselectFormItem = (e: MouseEvent) => {
    if (e.target !== copy) {
      (copy as HTMLDivElement).classList.remove("bg-orange-100");
      document.removeEventListener("click", unselectFormItem);
      setSelectedFormItem(null);
    }
    const children = Array.from(form.children);
    children.forEach((child) => {
      if (e.target === child) {
        setSelectedFormItem(child as HTMLDivElement);
      }
    });
  };
  children.splice(index + 1, 0, copy as HTMLDivElement);
  form.innerHTML = "";
  children.forEach((child) => {
    form.appendChild(child);
  });
  if (!form.children[0].classList.contains("rounded-t-lg")) {
    form.children[0].classList.add("rounded-t-lg");
  }
};
type DeleteFormItemProps = {
  itemToBeDeleted: HTMLDivElement | null;
  setItemToBeDeleted: (itemToBeDeleted: HTMLDivElement | null) => void;
};
const deleteFormItem = ({
  itemToBeDeleted,
  setItemToBeDeleted,
}: DeleteFormItemProps) => {
  const form = document.getElementById("leftPanel")! as HTMLDivElement;
  form.removeChild(itemToBeDeleted!);
  form.children[0]?.classList.add("rounded-t-lg");
  document.getElementById("deleteModal")!.classList.add("hidden");
  setItemToBeDeleted(null);
};
