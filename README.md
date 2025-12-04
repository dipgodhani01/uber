# Backend API Documentation

## `/users/register` Endpoint

### Description

- Registers a new user and returns an authentication token plus the created user (password is not returned).

## HTTP Method

`POST`

### Request body (JSON)

- `fullname` (object, required)
  - `firstname` (string, required) — min length: 3
  - `lastname` (string, required) — min length: 3
- `email` (string, required) — must be a valid email
- `password` (string, required) — min length: 6

### Example request body

```
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "testuser"
}
```

### Example Responses

- 201 Created — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "User registered successfully.",
    "token": "<jwt-token>",
    "user": {
      "_id": "<user-id>",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane.doe@example.com",
      "socketId": null
    }
  }
  ```
