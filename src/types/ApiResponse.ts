import { Ticket } from "@/model/ticket";

export interface ApiResponse {
    success: boolean;
    message: string;
    tickets?: Ticket[];
};