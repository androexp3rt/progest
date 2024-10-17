"use client";
import { User } from "@/model/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newUserFromManagerSchema } from "@/schemas/newUserFromManagerSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoxIcon from "@/components/boxIcon";
import { Loader2 } from "lucide-react";
import CreateForm from "@/components/createForm/createForm";
import ManagerSidebar from "@/components/sidebar/managerSidebar";

export default function ManagerDashboard() {
  const [pageState, setPageState] = useState("Users");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;

  const form = useForm<z.infer<typeof newUserFromManagerSchema>>({
    resolver: zodResolver(newUserFromManagerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

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
  }, [session, companyName]);

  const showCreateUserForm = () => {
    const newUserForm = document.getElementById("createUserForm")!;
    newUserForm.classList.remove("hidden");
  };
  const hideCreateUserForm = () => {
    const newUserForm = document.getElementById("createUserForm")!;
    (newUserForm as HTMLFormElement).reset();
    newUserForm.classList.add("hidden");
    form.reset();
  };
  const onSubmit = async (data: z.infer<typeof newUserFromManagerSchema>) => {
    const newData = { ...data, companyName };
    try {
      const response = await axios.post("/api/createUser", newData);
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

  return (
    <main className="relative w-full h-[calc(100vh-theme(space.20))] flex justify-start bg-slate-400 overflow-auto">
      {/* sidebar */}
      <ManagerSidebar
        companyName={companyName}
        pageState={pageState}
        setPageState={setPageState}
      />
      {/* content */}
      <div
        id="pageContent"
        className="w-full h-full flex flex-col space-y-5 p-5"
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
                className="flex flex-col items-center hidden gap-2"
              >
                <div className="w-full flex items-center justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
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
        ) : pageState === "Create Form" ? (
          <CreateForm
            eFormItemDetails={[]}
            eFormItems={[]}
            eFormItemsLength={0}
            eFormName=""
            companyName={companyName}
          />
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
