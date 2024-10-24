"use client";
import { User } from "@/model/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newUserFromAdminSchema } from "@/schemas/newUserFromAdminSchema";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { data: session } = useSession();

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

  const getAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const responseStream = await fetch("/api/getAllUsers", {
        cache: "no-store",
      });
      const response = await responseStream.json();
      if (response.success) {
        const fetchedUsers: User[] = response.users;
        setUsers(fetchedUsers);
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
        getAllUsers();
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
        getAllUsers();
      } else {
        toast(res.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      toast("Error deleting User", { type: "error" });
    }
  };
  useEffect(() => {
    const getAUsers = async () => {
      setLoadingUsers(true);
      try {
        const responseStream = await fetch("/api/getAllUsers", {
          cache: "no-store",
        });
        const response = await responseStream.json();
        if (response.success) {
          const fetchedUsers: User[] = response.users;
          setUsers(fetchedUsers);
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
    getAUsers();
  }, [session]);

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
              <div className="w-full flex max-sm:flex-col items-center justify-between text-center font-bold max-sm:p-1 p-2 gap-2 bg-amber-200 rounded-lg">
                <div className="max-sm:w-full sm:w-5/6 flex items-center justify-between">
                  <span className="max-sm:w-1/5 w-1/6">Company Name</span>
                  <span className="max-sm:w-1/5 w-1/6">Role</span>
                  <span className="max-sm:w-1/5 w-1/6">Name</span>
                  <span className="max-sm:w-1/5 w-1/6">Email</span>
                  <span className="max-sm:w-1/5 w-1/6">Password</span>
                </div>
                <span className="max-sm:hidden w-1/6">Actions</span>
              </div>
              {users?.map((user, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex max-sm:flex-col items-center justify-between text-center font-bold max-sm:px-1 p-2 gap-2 border border-black rounded-lg"
                  >
                    <div className="max-sm:w-full sm:w-5/6 flex items-center justify-between text-center">
                      <span className="max-sm:w-1/5 sm:w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.companyName}
                      </span>
                      <span className="max-sm:w-1/5 sm:w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.role}
                      </span>
                      <span className="max-sm:w-1/5 sm:w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.name}
                      </span>
                      <span className="max-sm:w-1/5 sm:w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.email}
                      </span>
                      <span className="max-sm:w-1/5 sm:w-1/6 text-ellipsis whitespace-nowrap overflow-hidden">
                        {user.password}
                      </span>
                    </div>
                    <div className="max-sm:w-full sm:w-1/6 flex justify-center items-center gap-2">
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
