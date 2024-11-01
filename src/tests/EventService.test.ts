import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import EventService, { EventData } from "../services/EventService";
import Event, { EventType } from "../models/Event";
import EventRepository from "../repositories/EventRepository";

describe("EventService", () => {
  let mongoServer: MongoMemoryServer;

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

  it("should retrieve all events", async () => {
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

    await EventRepository.createEvent(eventData1);
    await EventRepository.createEvent(eventData2);

    const events = await EventService.getEvents();
    expect(events.length).toBe(2);
    expect(events[0].title).toBe("Event 1");
    expect(events[1].title).toBe("Event 2");
  });

  it("should retrieve an event by ID", async () => {
    const eventData: EventType = {
      title: "Event by ID",
      description: "Find this event by ID",
      date: new Date(),
      createdBy: "user789",
      users: new Map([["user789", true]]),
    };

    const createdEvent = await EventRepository.createEvent(eventData);
    const id = createdEvent._id.toString();

    const foundEvent = await EventService.getEventById(id);
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

    await EventRepository.createEvent(eventData);
    const foundEvent = await EventService.getEventBytitle("Unique Event Title");

    expect(foundEvent).not.toBeNull();
    expect(foundEvent?.title).toBe("Unique Event Title");
  });

  it("should register a user to an event successfully", async () => {
    const eventData: EventData = {
      title: "Sample Event",
      description: "A sample event description",
      date: "2025-2-2",
      createdBy: "user123",
    };

    const createdEvent = await EventService.createEvent(eventData);
    const updatedEvent = await EventService.registerUserToEvent(
      createdEvent._id.toString(),
      "newUser"
    );

    expect(updatedEvent?.users.has("newUser")).toBe(true);
  });

  it("should not register a user to a non-existent event", async () => {
    await expect(
      EventService.registerUserToEvent("nonExistentEventId", "newUser")
    ).rejects.toBe("Event doesn't exist!");
  });

  it("should not register a user who is already registered", async () => {
    const eventData: EventType = {
      title: "Sample Event",
      description: "A sample event description",
      date: new Date(Date.now() + 86400000), // 1 day in the future
      createdBy: "user123",
      users: new Map([["existingUser", true]]),
    };

    const createdEvent = await EventRepository.createEvent(eventData);
    await expect(
      EventService.registerUserToEvent(
        createdEvent._id.toString(),
        "existingUser"
      )
    ).rejects.toBe("User already registered!");
  });

  it("should not register a user to an event that has already passed", async () => {
    const eventData: EventType = {
      title: "Past Event",
      description: "An event that has already passed",
      date: new Date(Date.now() - 86400000), // 1 day in the past
      createdBy: "user123",
      users: new Map(),
    };

    const createdEvent = await EventRepository.createEvent(eventData);
    await expect(
      EventService.registerUserToEvent(createdEvent._id.toString(), "newUser")
    ).rejects.toBe("The event already passed!");
  });

  it("should delete an existing event", async () => {
    const eventData: EventType = {
      title: "Event to Delete",
      description: "This event will be deleted",
      date: new Date(),
      createdBy: "user1001",
      users: new Map([["user1001", true]]),
    };

    const createdEvent = await EventRepository.createEvent(eventData);
    const deletedEvent = await EventService.deleteEvent(
      createdEvent._id.toString()
    );

    expect(deletedEvent).not.toBeNull();
    expect(deletedEvent?.title).toBe("Event to Delete");

    const foundEvent = await EventRepository.getEventById(
      createdEvent._id.toString()
    );
    expect(foundEvent).toBeNull();
  });
});
