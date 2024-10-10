"use client";
import { User } from "@/model/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoxIcon from "@/components/boxIcon";
import { Loader2 } from "lucide-react";

export default function ManagerDashboard() {
  const [pageState, setPageState] = useState("Users");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;
  const getUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`/api/getUsersByCompany/${companyName}`);
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log(error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };
  useEffect(() => {
    const getCompanyUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get(
          `/api/getUsersByCompany/${companyName}`
        );
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.log(error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    getCompanyUsers();
  }, [session]);

  const showCreateUserForm = () => {
    const newUserForm = document.getElementById("createUserForm")!;
    newUserForm.classList.remove("hidden");
  };
  const hideCreateUserForm = () => {
    const newUserForm = document.getElementById("createUserForm")!;
    (newUserForm as HTMLFormElement).reset();
    newUserForm.classList.add("hidden");
  };
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/createUser", {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        companyName,
      });
      if (response.data.success) {
        toast(response.data.message, { type: "success" });
        hideCreateUserForm();
        getUsers();
      } else {
        toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (id: unknown) => {
    try {
      const res = await axios.post("/api/deleteUserById", { id });
      if (res.data.success) {
        toast(res.data.message, { type: "success" });
        getUsers();
      } else {
        toast(res.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      toast("Error deleting User", { type: "error" });
    }
  };
  const showUsersPage = () => {
    setPageState("Users");
    users ? "" : getUsers();
  };
  const showFormsPage = () => {
    setPageState("Forms");
  };
  const liClass = "w-full h-10 p-2 rounded-lg text-center cursor-pointer";
  return (
    <main className="relative w-full h-screen flex justify-start bg-slate-400">
      {/* sidebar */}

      <div className="w-60 h-full flex flex-col justify-start items-center px-2 py-5 space-y-20 bg-black text-white">
        <h1 className="max-sm:w-30 max-sm:text-lg w-full text-2xl text-center">
          {companyName ?? "companyName"}
        </h1>
        <ul className="w-full flex flex-col space-y-2">
          <li
            className={`${liClass} ${
              pageState === "Users" ? "bg-[#C4A682]" : "bg-white/10"
            }`}
            onClick={showUsersPage}
          >
            Users
          </li>
          <li
            className={`${liClass} ${
              pageState === "Forms" ? "bg-[#C4A682]" : "bg-white/10"
            }`}
            onClick={showFormsPage}
          >
            Forms
          </li>
        </ul>
      </div>
      {/* content */}
      <div
        id="pageContent"
        className="w-full h-full flex flex-col space-y-10 p-5"
      >
        <h1 className="w-full text-center text-3xl font-bold">{pageState}</h1>
        {pageState === "Users" ? (
          <div className="flex flex-col items-center bg-white/30 backdrop-blur-sm rounded-lg p-2 space-y-5">
            <Button className="max-w-md" onClick={showCreateUserForm}>
              Create a new User
            </Button>
            <form
              id="createUserForm"
              className="flex flex-col items-center hidden gap-2"
            >
              <div className="w-full flex items-center justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
                <Input
                  className="w-1/3 bg-white"
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setNewUserName(e.target.value)}
                />
                <Input
                  className="w-1/3 bg-white"
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <Input
                  className="w-1/3 bg-white"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button className="max-w-md" type="submit" onClick={createUser}>
                  Submit
                </Button>
                <Button className="max-w-md" onClick={hideCreateUserForm}>
                  Discard
                </Button>
              </div>
            </form>
            {loadingUsers ? (
              <Loader2 className="animate-spin" />
            ) : users.length === 0 ? (
              <div className="w-full flex flex-col space-y-2">
                <p className="text-center text-xl font-bold">
                  No Users Found, Please Create a User
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col space-y-2">
                <div className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 bg-slate-500 rounded-lg">
                  <span className="w-1/4">Name</span>
                  <span className="w-1/4">Email</span>
                  <span className="w-1/4">Password</span>
                  <span className="w-1/4">Actions</span>
                </div>
                {users?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 border border-black rounded-lg"
                    >
                      <span className="w-1/4 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.name}
                      </span>
                      <span className="w-1/4  text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.email}
                      </span>
                      <span className="w-1/4 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.password}
                      </span>
                      <div className="w-1/4 flex justify-center items-center gap-2">
                        <span onClick={() => deleteUser(user._id)}>
                          <BoxIcon name="bx-trash" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
