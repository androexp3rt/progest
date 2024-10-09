import mongoose, { Schema, Document } from 'mongoose';

export interface Ticket extends Document {
    title: string;
    content: string;
    createdAt: Date;
    isResolved: boolean;
    username: string;
    ticketId: string;
}

export const TicketSchema: Schema<Ticket> = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isResolved: {
        type: Boolean,
        required: true,
        default: false,
    },
    username: {
        type: String,
        required: true
    },
    ticketId: {
        type: String,
        required: true,
        unique: true,
    },
});

const TicketModel =
    (mongoose.models.Ticket as mongoose.Model<Ticket>) ||
    mongoose.model<Ticket>('Ticket', TicketSchema);

export default TicketModel;