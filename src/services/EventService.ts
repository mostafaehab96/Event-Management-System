import { EventType, IEvent } from "../models/Event";
import EventRepository from "../repositories/EventRepository";
import validateDate from "../utils/date-validator";
import { Types } from "mongoose";

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
    if (Types.ObjectId.isValid(id)) {
      return EventRepository.getEventById(id);
    }
    return null;
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
    const existingEvent = await EventRepository.getEventBytitle(title);
    if (existingEvent && existingEvent.createdBy === createdBy)
      return Promise.reject("Duplicate titles are not allowed!");

    const eventsPerDay = (
      await EventRepository.getUserEventsByDate(createdBy, date)
    ).length;

    if (eventsPerDay >= 5) {
      return Promise.reject("User can't create more than 5 events per day!");
    }

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
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject("Id doesn't exist!");
    }
    const event = await EventRepository.getEventById(id);
    const date = validateDate(data.date);
    if (!date) {
      return Promise.reject("Date must be in the future!");
    }
    const eventsPerDay = (
      await EventRepository.getUserEventsByDate(event.createdBy, date)
    ).length;

    if (eventsPerDay >= 5) {
      return Promise.reject("User can't create more than 5 events per day!");
    }

    return EventRepository.updateEvent(id, data);
  }

  public static async registerUserToEvent(event_id: string, username: string) {
    let event;
    if (Types.ObjectId.isValid(event_id)) {
      event = await EventRepository.getEventById(event_id);
    }
    if (!username) return Promise.reject("username can't be null!");

    if (!event) return Promise.reject("Event doesn't exist!");

    if (event.users.get(username))
      return Promise.reject("User already registered!");

    const now = new Date();

    if (event.date < now) return Promise.reject("The event already passed!");

    const users = event.users;
    users.set(username, true);
    return EventRepository.updateEvent(event_id, { users });
  }

  public static async deleteEvent(id: string): Promise<IEvent | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return EventRepository.deleteEvent(id);
  }
}
