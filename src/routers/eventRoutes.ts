import { Router } from "express";
import EventController from "../controllers/EventController";

const router = Router();

router
  .route("/")
  .get(EventController.getEvents)
  .post(EventController.createEvent);

router
  .route("/:id")
  .get(EventController.getEventById)
  .delete(EventController.deleteEvent)
  .put(EventController.updateEvent);

router.put("/:id/register", EventController.registerUserToEvent);

export default router;
