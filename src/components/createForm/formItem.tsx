type Props = {
  f: {
    icon: string;
    label: string;
    color: string;
  };
  id: string;
  setItemToCopy: (id: string) => void;
  setItemToDelete: (id: string) => void;
  setSelectedFormItem: (id: string) => void;
  // unselectFormItem: (e: MouseEvent) => void;
};

export default function FormItem({
  f,
  id,
  setItemToCopy,
  setItemToDelete,
  setSelectedFormItem,
}: // unselectFormItem,
Props) {
  let isNewItem = true;
  const idElement = document.getElementById(`s${id}`);
  if (idElement) {
    isNewItem = false;
  }

  return (
    <div
      id={`s${id}`}
      className="flex items-center justify-between p-2 bg-green-100"
      onClick={(e) => {
        if (
          (e.target as HTMLElement).closest(`#s${id}`) &&
          e.target !== document.getElementById(`${id}inputElement`)
        ) {
          setSelectedFormItem(`s${id}`);
        }
      }}
    >
      <div className="flex items-center">
        <i className={`${f.icon} ${f.color}`} />
        <input
          id={`${id}inputElement`}
          type="text"
          className={`ml-2 text-lg font-semibold outline-green-400 rounded-md p-2 ${
            isNewItem ? "" : "hidden"
          }`}
          autoFocus
          defaultValue={`${f.label}`}
          onBlur={(e) => {
            e.target.classList.add("hidden");
            document.getElementById(`${id}spanElement`)!.innerHTML =
              e.target.value;
            document
              .getElementById(`${id}spanElement`)!
              .classList.remove("hidden");
          }}
        />
        <span
          id={`${id}spanElement`}
          className={`ml-2 text-lg font-semibold p-2 ${
            isNewItem ? "hidden" : ""
          }`}
        >
          {f.label}
        </span>
      </div>
      <div className="flex space-x-5">
        <i
          className="fas fa-edit text-gray-500 cursor-pointer"
          onClick={() => {
            document.getElementById("editModal")!.classList.remove("hidden");
          }}
        />
        <i
          className="fas fa-copy text-gray-500 cursor-pointer"
          onClick={() => {
            setItemToCopy(`s${id}`);
          }}
        />
        <i
          className="fas fa-trash text-gray-500 cursor-pointer"
          onClick={() => {
            setItemToDelete(id);
            document.getElementById("deleteModal")?.classList.remove("hidden");
          }}
        />
      </div>
    </div>
  );
}
