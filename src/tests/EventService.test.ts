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
    const response = await EventService.registerUserToEvent(
      "nonExistentEventId",
      "newUser"
    );

    expect(response).toBeNull();
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
});
