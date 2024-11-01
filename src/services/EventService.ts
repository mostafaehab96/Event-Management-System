import { EventType, IEvent } from "../models/Event";
import EventRepository from "../repositories/EventRepository";
import validateDate from "../utils/date-validator";

export type EventData = {
  title: string;
  description: string;
  date: string;
  createdBy: string;
};

export default class EventService {
  public static async getEvents(): Promise<IEvent[] | null> {
    return EventRepository.getEvents();
  }

  public static async getEventById(id: string): Promise<IEvent | null> {
    try {
      return EventRepository.getEventById(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getEventBytitle(title: string): Promise<IEvent | null> {
    return EventRepository.getEventBytitle(title);
  }

  public static async createEvent(event: EventData) {
    const date = validateDate(event.date);
    if (!date) {
      return Promise.reject("The date is invalid!");
    }
    const { title, description, createdBy } = event;

    const eventsPerDay = (
      await EventRepository.getUserEventsByDate(createdBy, date)
    ).length;
    if (eventsPerDay >= 5)
      return Promise.reject("User can't create more than 5 events per day!");

    const newEvent: EventType = {
      title,
      description,
      date,
      createdBy,
      users: new Map(),
    };

    return EventRepository.createEvent(newEvent);
  }

  public static async updateEvent(id: string, data: Record<string, any>) {
    if (!data.date) {
      return EventRepository.updateEvent(id, data);
    }
    const date = validateDate(data.date);
    if (!date) {
      return null;
    }

    return EventRepository.updateEvent(id, data);
  }

  public static async registerUserToEvent(event_id: string, username: string) {
    let event;
    try {
      event = await EventRepository.getEventById(event_id);
    } catch (err) {
      return null;
    }
    if (!event) return null;

    if (event.users.get(username))
      return Promise.reject("User already registered!");

    if (!validateDate(event.date.toString()))
      return Promise.reject("The event already passed!");

    const users = event.users;
    users.set(username, true);
    return EventRepository.updateEvent(event_id, { users });
  }

  public static async deleteEvent(id: string): Promise<IEvent | null> {
    try {
      return EventRepository.deleteEvent(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
