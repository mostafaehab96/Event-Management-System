import { Schema, Document, model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  createdBy: string;
  users: Map<string, boolean>;
}

export type EventType = {
  title: string;
  description: string;
  date: Date;
  createdBy: string;
  users: Map<string, boolean>;
};

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  createdBy: { type: String, required: true },
  users: { type: Map },
});

export default model<IEvent>("Event", EventSchema);
