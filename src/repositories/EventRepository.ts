import { IPVersion } from "net";
import Event, { IEvent, EventType } from "../models/Event";

export default class EventRepository {
  public static async getEvents(): Promise<IEvent[]> {
    return Event.find();
  }

  public static async getEventById(id: string): Promise<IEvent | null> {
    return Event.findById(id);
  }
  public static async getEventBytitle(title: string): Promise<IEvent | null> {
    return Event.findOne({ title });
  }

  public static async getUserEventsByDate(
    createdBy: string,
    date: Date
  ): Promise<IEvent[] | null> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return Event.find({ createdBy, date: { $gte: start, $lte: end } });
  }

  public static async createEvent(event: EventType): Promise<IEvent> {
    const newEvent = new Event(event);
    return newEvent.save();
  }

  public static async updateEvent(
    id: string,
    data: Record<string, any>
  ): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(id, data, { new: true });
  }

  public static async deleteEvent(id: string): Promise<IEvent | null> {
    return Event.findByIdAndDelete(id);
  }
}
