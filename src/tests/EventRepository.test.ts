// tests/EventRepository.test.ts
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import EventRepository from "../repositories/EventRepository";
import Event, { EventType } from "../models/Event";

describe("EventRepository", () => {
  let mongoServer: MongoMemoryServer;
  const eventRepository = new EventRepository();

  // Start the in-memory server and connect to it
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Disconnect and stop the in-memory server after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear the database between tests
  afterEach(async () => {
    await Event.deleteMany({});
  });

  it("should create a new event", async () => {
    const eventData: EventType = {
      title: "Sample Event",
      description: "A sample event description",
      date: new Date(),
      createdBy: "user123",
      users: new Map([["user123", true]]),
    };

    const createdEvent = await eventRepository.createEvent(eventData);
    expect(createdEvent).toHaveProperty("_id");
    expect(createdEvent.title).toBe("Sample Event");
    expect(createdEvent.description).toBe("A sample event description");
  });

  it("should retrieve all events", async () => {
    // Create two events for testing
    const eventData1: EventType = {
      title: "Event 1",
      description: "First event description",
      date: new Date(),
      createdBy: "user123",
      users: new Map([["user123", true]]),
    };

    const eventData2: EventType = {
      title: "Event 2",
      description: "Second event description",
      date: new Date(),
      createdBy: "user456",
      users: new Map([["user456", true]]),
    };

    await eventRepository.createEvent(eventData1);
    await eventRepository.createEvent(eventData2);

    const events = await eventRepository.getEvents();
    expect(events.length).toBe(2);
    expect(events[0].title).toBe("Event 1");
    expect(events[1].title).toBe("Event 2");
  });

  it("should retrieve an event by ID", async () => {
    const eventData = {
      title: "Event by ID",
      description: "Find this event by ID",
      date: new Date(),
      createdBy: "user789",
      users: new Map([["user789", true]]),
    };

    const createdEvent = await eventRepository.createEvent(eventData);
    const id = createdEvent._id.toString();

    const foundEvent = await eventRepository.getEventById(id);
    expect(foundEvent).not.toBeNull();
    expect(foundEvent?.title).toBe("Event by ID");
  });

  it("should retrieve an event by title", async () => {
    const eventData: EventType = {
      title: "Unique Event Title",
      description: "Event with a unique title",
      date: new Date(),
      createdBy: "user999",
      users: new Map([["user999", true]]),
    };

    await eventRepository.createEvent(eventData);
    const foundEvent = await eventRepository.getEventBytitle(
      "Unique Event Title"
    );

    expect(foundEvent).not.toBeNull();
    expect(foundEvent?.title).toBe("Unique Event Title");
  });
});
