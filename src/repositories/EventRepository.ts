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
