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
import { Loader2 } from "lucide-react";

export default function Users() {
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;
  const creatorEmail: string = session?.user.email;
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

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
      const responseStream = await fetch(
        `/api/getUsersByCompany/${companyName}`,
        {
          cache: "no-store",
        }
      );
      const response = await responseStream.json();
      if (response.success) {
        setUsers(response.users);
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
    const getAllUsers = async () => {
      setLoadingUsers(true);
      try {
        const responseStream = await fetch(
          `/api/getUsersByCompany/${companyName}`,
          {
            cache: "no-store",
          }
        );
        const response = await responseStream.json();
        if (response.success) {
          setUsers(response.users);
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
    getAllUsers();
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
    const newData = { ...data, companyName, creatorEmail };
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
    <div className="w-full h-full flex flex-col bg-background bg-auto bg-no-repeat bg-center">
      <div className="w-full h-full flex flex-col space-y-10 max-sm:p-2 p-5 overflow-auto bg-gradient-to-br from-blue-600/50 to-blue-200/50">
        <h1 className="w-full text-center text-3xl font-bold">Users</h1>
        <div className="flex flex-col items-center bg-white/30 backdrop-blur-sm rounded-lg max-sm:px-1 max-sm:py-2 p-2 space-y-5 max-sm:text-xs">
          <Button
            className="max-w-md max-sm:text-xs"
            onClick={showCreateUserForm}
          >
            Create a new User
          </Button>
          <Form {...form}>
            <form
              id="createUserForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center justify-between p-2 gap-2 hidden"
            >
              <div className="w-full flex max-sm:flex-col max-sm:items-center items-start justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
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
                <Button className="max-w-md max-sm:text-xs" type="submit">
                  Submit
                </Button>
                <Button
                  type="button"
                  className="max-w-md max-sm:text-xs"
                  onClick={hideCreateUserForm}
                >
                  Discard
                </Button>
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
              <div className="w-full flex items-center justify-between text-center font-bold p-2 gap-2 bg-amber-200 rounded-lg">
                <div className="max-sm:w-full sm:w-3/4 flex items-center justify-between">
                  <span className="max-sm:w-1/3 sm:w-1/4">Name</span>
                  <span className="max-sm:w-1/3 sm:w-1/4">Email</span>
                  <span className="max-sm:w-1/3 sm:w-1/4">Password</span>
                </div>
                <span className="max-sm:hidden sm:w-1/4">Actions</span>
              </div>
              {users?.map((user, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex max-sm:flex-col items-center justify-between text-center font-bold max-sm:px-1 p-2 gap-2 border border-black rounded-lg"
                  >
                    <div className="max-sm:w-full sm:w-3/4 flex items-center justify-between text-center">
                      <span className="max-sm:w-1/3 sm:w-1/4 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.name}
                      </span>
                      <span className="max-sm:w-1/3 sm:w-1/4 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.email}
                      </span>
                      <span className="max-sm:w-1/3 sm:w-1/4 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.password}
                      </span>
                    </div>
                    <div className="max-sm:w-full sm:w-1/4 flex justify-center items-center gap-2">
                      <button
                        className="max-sm:p-1 sm:p-2 max-sm:rounded-md sm:rounded-lg bg-white"
                        onClick={() => deleteUser(user._id)}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
