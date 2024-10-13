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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newUserFromAdminSchema } from "@/schemas/newUserFromAdminSchema";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [pageState, setPageState] = useState("Users");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;

  const form = useForm<z.infer<typeof newUserFromAdminSchema>>({
    resolver: zodResolver(newUserFromAdminSchema),
    defaultValues: {
      companyName: "",
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const getUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get("/api/getAllUsers");
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
        const response = await axios.get("/api/getAllUsers");
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
    form.reset({}, { keepErrors: false });
  };
  const onSubmit = async (data: z.infer<typeof newUserFromAdminSchema>) => {
    try {
      const response = await axios.post("/api/createUserFromAdmin", data);
      if (response.data.success) {
        toast(response.data.message, { type: "success" });
        hideCreateUserForm();
        getUsers();
      } else {
        toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      toast("Error Creating User", { type: "error" });
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
    getUsers();
  };
  const showFormsPage = () => {
    setPageState("Forms");
  };
  const liClass = "w-full h-10 p-2 rounded-lg text-center cursor-pointer";
  return (
    <main className="relative w-full h-[calc(100vh-theme(space.20))] flex justify-start bg-slate-400">
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
            <Form {...form}>
              <form
                id="createUserForm"
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-between p-2 gap-2 hidden"
              >
                <div className="w-full flex items-start justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
                  <FormField
                    name="companyName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          {...field}
                          type="text"
                          name="companyName"
                          placeholder="Company Name"
                          className="bg-white"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <select
                          {...field}
                          className="outline-none h-10 bg-white rounded-lg px-2"
                        >
                          <option value="" disabled>
                            Select User Role
                          </option>
                          <option value="user">user</option>
                          <option value="manager">manager</option>
                          <option value="admin">admin</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          {...field}
                          type="text"
                          name="name"
                          placeholder="Name"
                          className="bg-white"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          {...field}
                          type="text"
                          name="email"
                          placeholder="Email"
                          className="bg-white"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          {...field}
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="bg-white"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button className="max-w-md" type="submit">
                    Submit
                  </Button>
                  <span
                    className="max-w-md inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2"
                    onClick={hideCreateUserForm}
                  >
                    Discard
                  </span>
                </div>
              </form>
            </Form>
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
                  <span className="w-1/6">Company Name</span>
                  <span className="w-1/6">Role</span>
                  <span className="w-1/6">Name</span>
                  <span className="w-1/6">Email</span>
                  <span className="w-1/6">Password</span>
                  <span className="w-1/6">Actions</span>
                </div>
                {users?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 border border-black rounded-lg"
                    >
                      <span className="w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.companyName}
                      </span>
                      <span className="w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.role}
                      </span>
                      <span className="w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.name}
                      </span>
                      <span className="w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.email}
                      </span>
                      <span className="w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.password}
                      </span>
                      <div className="w-1/6 flex justify-center items-center gap-2">
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
