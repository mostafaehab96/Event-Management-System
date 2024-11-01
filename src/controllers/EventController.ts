import { Request, Response, NextFunction } from "express";
import EventService from "../services/EventService";

export default class EventController {
  public static async getEvents(req: Request, res: Response) {
    const title: string = req.query.title as string;

    if (title) {
      const event = await EventService.getEventBytitle(title);
      res.status(200).json({ event });
    } else {
      const events = await EventService.getEvents();
      res.status(200).json({ status: "success", data: events });
    }
  }

  public static async getEventById(req: Request, res: Response) {
    const { id } = req.params;
    const event = await EventService.getEventById(id);
    if (event) {
      res.status(200).json({ status: "success", data: event });
    } else {
      res.status(404).json({ status: "error", message: "Event not found!" });
    }
  }

  public static async createEvent(req: Request, res: Response) {
    const { title, description, date, createdBy } = req.body;
    if (!title || !description || !date || !createdBy) {
      res.status(400).json({
        status: "error",
        message: "Validation error: missing required fields.",
      });
    } else {
      try {
        const event = await EventService.createEvent({
          title,
          description,
          date,
          createdBy,
        });
        res.status(201).json({ status: "success", data: event });
      } catch (err) {
        res
          .status(404)
          .json({ status: "error", message: `Validation error: ${err}` });
      }
    }
  }

  public static async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;
    const response = await EventService.deleteEvent(id);
    if (response) {
      res
        .status(200)
        .json({ status: "success", message: "Event deleted successfully" });
    } else {
      res.status(404).json({ status: "error", message: "Event Not Found!" });
    }
  }

  public static async updateEvent(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const event = await EventService.updateEvent(id, req.body);
      res.status(200).json({ status: "success", data: event });
    } catch (err) {
      const status = err === "Id doesn't exist!" ? 404 : 400;
      res.status(status).json({ status: "error", message: err });
    }
  }
  public static async registerUserToEvent(req: Request, res: Response) {
    const { id } = req.params;
    const { username } = req.body;
    try {
      const event = await EventService.registerUserToEvent(id, username);
      res.status(200).json({ status: "success", data: event });
    } catch (err) {
      const status = err === "Event doesn't exist!" ? 404 : 400;
      res.status(status).json({ status: "error", message: err });
    }
  }
}
