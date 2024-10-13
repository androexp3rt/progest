import React from "react";
type Props = {
  companyName: string;
  pageState: string;
  setPageState: (pageState: string) => void;
};
export default function ManagerSidebar({
  companyName,
  pageState,
  setPageState,
}: Props) {
  const hideFormsMenu = () => {
    const downArrow = document.getElementById("downArrow")!;
    const formsMenu = document.getElementById("formsMenu")!;
    formsMenu.classList.add("hidden");
    downArrow.style.transform = "rotate(0deg)";
  };
  const toggleFormsMenu = () => {
    const downArrow = document.getElementById("downArrow")!;
    const formsMenu = document.getElementById("formsMenu")!;
    if (formsMenu.classList.contains("hidden")) {
      formsMenu.classList.remove("hidden");
      downArrow.style.transform = "rotate(180deg)";
    } else {
      formsMenu.classList.add("hidden");
      downArrow.style.transform = "rotate(0deg)";
    }
  };
  return (
    <div className="relative w-60 h-full flex flex-col justify-start items-center px-2 py-5 space-y-20 bg-black text-white shadow-md">
      <h1 className="max-sm:w-30 max-sm:text-lg w-full text-2xl text-center">
        {companyName ?? "companyName"}
      </h1>
      <ul className="w-full flex flex-col space-y-2">
        <li
          className={`w-full flex items-center justify-start space-x-3 p-2 rounded-lg cursor-pointer ${
            pageState === "Users" ? "bg-[#C4A682]" : "bg-white/10"
          }`}
          onClick={() => {
            setPageState("Users");
            hideFormsMenu();
          }}
        >
          <i className="fas fa-user text-lg" />
          <span className="text-lg">Users</span>
        </li>
        <li className="w-full flex flex-col">
          <div
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              pageState === "Create Form" || pageState === "My Forms"
                ? "bg-[#C4A682]"
                : "bg-white/10"
            }`}
            onClick={toggleFormsMenu}
          >
            <span className="space-x-3">
              <i className="fas fa-list text-lg" />
              <span className="text-lg">Forms</span>
            </span>
            <i id="downArrow" className="fas fa-chevron-down" />
          </div>
          <ul id="formsMenu" className="hidden p-2 space-y-2">
            <li
              className={`p-2 rounded-lg cursor-pointer ${
                pageState === "Create Form" ? "bg-[#C4A682]" : "bg-white/10"
              }`}
              onClick={() => {
                setPageState("Create Form");
              }}
            >
              Create a form
            </li>
            <li
              className={`p-2 rounded-lg cursor-pointer ${
                pageState === "My Forms" ? "bg-[#C4A682]" : "bg-white/10"
              }`}
              onClick={() => {
                setPageState("My Forms");
              }}
            >
              My forms
            </li>
          </ul>
        </li>
      </ul>

      <div className="absolute bottom-0 w-full flex items-center justify-center p-4 border-t border-white/50">
        <i className="fas fa-power-off text-xl mx-auto block"></i>
      </div>
    </div>
  );
}
