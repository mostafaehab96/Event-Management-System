import Event, { IEvent, EventType } from "../models/Event";

class EventRepository {
  public async getEvents(): Promise<IEvent[]> {
    return Event.find();
  }

  public async getEventById(id: string): Promise<IEvent | undefined> {
    return Event.findById(id);
  }
  public async getEventBytitle(title: string): Promise<IEvent | undefined> {
    return Event.findOne({ title });
  }

  public async createEvent(event: EventType): Promise<IEvent> {
    const newEvent = new Event(event);
    return newEvent.save();
  }
}

export default EventRepository;
