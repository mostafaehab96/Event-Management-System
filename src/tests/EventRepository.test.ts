// tests/EventRepository.test.ts
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import EventRepository from "../repositories/EventRepository";
import Event, { EventType } from "../models/Event";

describe("EventRepository", () => {
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

  it("should create a new event", async () => {
    const eventData: EventType = {
      title: "Sample Event",
      description: "A sample event description",
      date: new Date(),
      createdBy: "user123",
      users: new Map([["user123", true]]),
    };

    const createdEvent = await EventRepository.createEvent(eventData);
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

    await EventRepository.createEvent(eventData1);
    await EventRepository.createEvent(eventData2);

    const events = await EventRepository.getEvents();
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

    const createdEvent = await EventRepository.createEvent(eventData);
    const id = createdEvent._id.toString();

    const foundEvent = await EventRepository.getEventById(id);
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
    const foundEvent = await EventRepository.getEventBytitle(
      "Unique Event Title"
    );

    expect(foundEvent).not.toBeNull();
    expect(foundEvent?.title).toBe("Unique Event Title");
  });

  it("should update an existing event", async () => {
    const eventData: EventType = {
      title: "Event to Update",
      description: "Original description",
      date: new Date(),
      createdBy: "user1000",
      users: new Map([["user1000", true]]),
    };

    const createdEvent = await EventRepository.createEvent(eventData);
    const updatedData = {
      title: "Updated Event Title",
      description: "Updated description",
    };

    const updatedEvent = await EventRepository.updateEvent(
      createdEvent._id.toString(),
      updatedData
    );
    console.log(updatedEvent.title);

    expect(updatedEvent).not.toBeNull();
    expect(updatedEvent.title).toBe("Updated Event Title");
    expect(updatedEvent.description).toBe("Updated description");
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
    const deletedEvent = await EventRepository.deleteEvent(
      createdEvent._id.toString()
    );

    expect(deletedEvent).not.toBeNull();
    expect(deletedEvent?.title).toBe("Event to Delete");

    const foundEvent = await EventRepository.getEventById(
      createdEvent._id.toString()
    );
    expect(foundEvent).toBeNull();
  });

  it("should retrieve events created by a user on a specific date", async () => {
    const createdBy = "user123";
    const targetDate = new Date("2024-11-01");

    // Create some events with different dates and users
    await Event.create({
      title: "Event 1",
      description: "Event on the target date",
      date: targetDate,
      createdBy,
      users: new Map([[createdBy, true]]),
    });
    await Event.create({
      title: "Event 2",
      description: "Another event on the target date",
      date: targetDate,
      createdBy,
      users: new Map([[createdBy, true]]),
    });
    await Event.create({
      title: "Event 3",
      description: "Event on a different date",
      date: new Date("2024-10-31"),
      createdBy,
      users: new Map([[createdBy, true]]),
    });
    await Event.create({
      title: "Event 4",
      description: "Event by a different user",
      date: targetDate,
      createdBy: "user456",
      users: new Map([["user456", true]]),
    });

    const events = await EventRepository.getUserEventsByDate(
      createdBy,
      targetDate
    );

    expect(events).toHaveLength(2); // Expect only the 2 events matching date and user
    expect(events[0].title).toBe("Event 1");
    expect(events[1].title).toBe("Event 2");
  });
});
