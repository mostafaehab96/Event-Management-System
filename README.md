# Event API Documentation

This API allows you to manage events and register users for events. It includes endpoints for creating, retrieving, updating, and deleting events, as well as a user registration feature for specific events.

## Base URL

```
http://localhost:8080/api/events
```

## Endpoints

### 1. Get All Events

- **URL**: `/`
- **Method**: `GET`
- **Description**: Retrieves a list of all events.
- **Response**:
  - **200 OK**: Successfully retrieves all events.
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "date": "ISODateString",
          "createdBy": "string",
          "users": { "userId": true }
        },
        ...
      ]
    }
    ```

### 2. Create Event

- **URL**: `/`
- **Method**: `POST`
- **Description**: Creates a new event.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "ISODateString",
    "createdBy": "string"
  }
  ```
- **Response**:
  - **201 Created**: Successfully creates the event.
    ```json
    {
      "status": "success",
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "date": "ISODateString",
        "createdBy": "string",
        "users": {}
      }
    }
    ```
  - **400 Bad Request**: Missing or invalid request data.
    ```json
    {
      "status": "error",
      "message": "Validation error: missing required fields."
    }
    ```

### 3. Get Event by ID

- **URL**: `/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific event by its ID.
- **Response**:
  - **200 OK**: Successfully retrieves the event.
    ```json
    {
      "status": "success",
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "date": "ISODateString",
        "createdBy": "string",
        "users": {}
      }
    }
    ```
  - **404 Not Found**: Event with the given ID does not exist.
    ```json
    {
      "status": "error",
      "message": "Event not found."
    }
    ```

### 4. Update Event by ID

- **URL**: `/:id`
- **Method**: `PUT`
- **Description**: Updates an existing event by its ID.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "ISODateString"
  }
  ```
- **Response**:
  - **200 OK**: Successfully updates the event.
    ```json
    {
      "status": "success",
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "date": "ISODateString",
        "createdBy": "string",
        "users": {}
      }
    }
    ```
  - **400 Bad Request**: Invalid request data.
  - **404 Not Found**: Event with the given ID does not exist.
    ```json
    {
      "status": "error",
      "message": "Event not found."
    }
    ```

### 5. Delete Event by ID

- **URL**: `/:id`
- **Method**: `DELETE`
- **Description**: Deletes an event by its ID.
- **Response**:
  - **200 OK**: Successfully deletes the event.
    ```json
    {
      "status": "success",
      "message": "Event deleted successfully."
    }
    ```
  - **404 Not Found**: Event with the given ID does not exist.
    ```json
    {
      "status": "error",
      "message": "Event not found."
    }
    ```

### 6. Register User to Event

- **URL**: `/:id/register`
- **Method**: `PUT`
- **Description**: Registers a user to an event.
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**:
  - **200 OK**: Successfully registers the user to the event.
    ```json
    {
      "status": "success",
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "date": "ISODateString",
        "createdBy": "string",
        "users": { "userId": true }
      }
    }
    ```
  - **400 Bad Request**: User is already registered or missing data.
    ```json
    {
      "status": "error",
      "message": "User is already registered for this event."
    }
    ```
  - **404 Not Found**: Event with the given ID does not exist.
    ```json
    {
      "status": "error",
      "message": "Event not found."
    }
    ```

---
