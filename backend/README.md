# Authentication Endpoints (USERS)

This document describes the authentication-related endpoints in the backend.
Each endpoint section includes purpose, request shape, validations, responses, and example requests.

---

## 1) POST /user/register

Purpose

- Create a new user account and return a JWT token and created user object (password is NOT returned).

Request

- Method: `POST`
- URL: `/user/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `fullname` (object, required)
    - `firstname` (string, required) — min length 3
    - `lastname` (string, required) — min length 3
  - `email` (string, required) — valid email
  - `password` (string, required) — min length 6

Example request body

```
{
  "fullname": { "firstname": "Jane", "lastname": "Doe" },
  "email": "jane.doe@example.com",
  "password": "s3cr3t!"
}
```

Validations

- `email` must be a valid email
- `fullname.firstname` and `fullname.lastname` must each be at least 3 characters
- `password` must be at least 6 characters

Responses

- 201 Created — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "User registered successfully.",
    "token": "<jwt-token>",
    "user": {
      "_id": "<user-id>",
      "fullname": { "firstname": "Jane", "lastname": "Doe" },
      "email": "jane.doe@example.com",
      "socketId": null
    }
  }
  ```

---

## 2) POST /user/login

Purpose

- Authenticate a user using email and password. Returns a JWT token and user object on success.

Request

- Method: `POST`
- URL: `/user/login`
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `email` (string, required) — valid email
  - `password` (string, required) — min length 6

Example request body

```
{ "email": "jane.doe@example.com", "password": "s3cr3t!" }
```

Validations

- `email` must be a valid email
- `password` must be at least 6 characters

Responses

- 200 OK — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "User logged in successfully.",
    "token": "<jwt-token>",
    "user": {
      "_id": "<user-id>",
      "fullname": { "firstname": "Jane", "lastname": "Doe" },
      "email": "jane.doe@example.com",
      "socketId": null
    }
  }
  ```

---

## 3) GET /user/profile

Purpose

- Return the profile of the authenticated user.

Request

- Method: `GET`
- URL: `/user/profile`
- Auth: Bearer token via `Authorization: Bearer <jwt>` header OR cookie `token` set by server

Behavior

- Protected route which verifies JWT, checks blacklist, and loads the user

Responses

- 200 OK — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "Profile fetched successfully.",
    "user": {
      "_id": "<user-id>",
      "fullname": { "firstname": "Jane", "lastname": "Doe" },
      "email": "jane.doe@example.com",
      "socketId": null
    }
  }
  ```

---

## 4) GET /user/logout

Purpose

- Log out the authenticated user by blacklisting their JWT and clearing the `token` cookie.

Request

- Method: `GET`
- URL: `/user/logout`
- Auth: Bearer token or cookie `token`

Behavior

- Protected route. The controller extracts the token from cookies or `Authorization` header, creates a `BlacklistToken` entry (stored with a TTL of 24 hours), clears the cookie, and returns success.

Responses

- 200 OK — Success

  - Body example:

  ```json
  { "status": true, "message": "Logged out successfully." }
  ```

---

# Authentication Endpoints (CAPTAINS)

This document describes the authentication-related endpoints in the backend for captains.
Each endpoint section includes purpose, request shape, validations, responses, and example requests.

---

## 1) POST /captain/register

Purpose

- Create a new captain account and return a JWT token and created captain object (password is NOT returned).

Request

- Method: `POST`
- URL: `/captain/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `fullname` (object, required)
    - `firstname` (string, required) — min length 3
    - `lastname` (string, required) — min length 3
  - `email` (string, required) — valid email
  - `password` (string, required) — min length 6
  - `vehicle` (object, required)
    - `color` (string, required) — min length 3
    - `plateNumber` (string, required) — min length 3
    - `capacity` (number, required) — min length 1
    - `type` (string, required)

Example request body

```
{
  "fullname":{
      "firstname":"Jane",
    "lastname":"Doe"
  },
    "email":"jane.doe@example.com",
    "password":"prowess",
    "vehicle":{
      "color":"Red",
    "plateNumber":"GJ05KH4563",
    "capacity":1,
    "vehicleType":"auto"
  }
}
```

Validations

- `email` must be a valid email
- `fullname.firstname` and `fullname.lastname` must each be at least 3 characters
- `password` must be at least 6 characters
- `vehicle.color` and `vehicle.plateNumber` must each be at least 3 characters
- `vehicle.capacity` must each be at least 1 characters
- `vehicle.type` required

Responses

- 201 Created — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "Captain registered successfully.",
    "token": "<jwt-token>",
    "captain": {
      "_id": "<captain-id>",
      "fullname": { "firstname": "Jane", "lastname": "Doe" },
      "email": "jane.doe@example.com",
      "socketId": null,
      "color": "Red",
      "plateNumber": "GJ05KH4563",
      "capacity": 1,
      "vehicleType": "auto"
    }
  }
  ```

---

## 2) POST /captain/login

Purpose

- Authenticate a captain using email and password. Returns a JWT token and captain object on success.

Request

- Method: `POST`
- URL: `/captain/login`
- Headers: `Content-Type: application/json`
- Body (JSON):
  - `email` (string, required) — valid email
  - `password` (string, required) — min length 6

Example request body

```
{ "email": "jane.doe@example.com", "password": "prowess" }
```

Validations

- `email` must be a valid email
- `password` must be at least 6 characters

Responses

- 200 OK — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "Captain logged in successfully.",
    "token": "<jwt-token>",
    "captain": {
      "_id": "<captain-id>",
      "fullname": { "firstname": "Jane", "lastname": "Doe" },
      "vehicle": {
        "color": "Red",
        "plateNumber": "GJ05KH4563",
        "capacity": 1,
        "vehicleType": "auto"
      },
      "email": "jane.doe@example.com",
      "status": "inactive",
      "socketId": null
    }
  }
  ```

---

## 3) GET /captain/profile

Purpose

- Return the profile of the authenticated captain.

Request

- Method: `GET`
- URL: `/captain/profile`
- Auth: Bearer token via `Authorization: Bearer <jwt>` header OR cookie `token` set by server

Behavior

- Protected route which verifies JWT, checks blacklist, and loads the captain

Responses

- 200 OK — Success

  - Body example:

  ```json
  {
    "status": true,
    "message": "Profile fetched successfully.",
    "captain": {
      "_id": "<captain-id>",
      "fullname": { "firstname": "Jane", "lastname": "Doe" },
      "vehicle": {
        "color": "Red",
        "plateNumber": "GJ05KH4563",
        "capacity": 1,
        "vehicleType": "auto"
      },
      "email": "jane.doe@example.com",
      "status": "inactive",
      "socketId": null
    }
  }
  ```

---

## 4) GET /captain/logout

Purpose

- Log out the authenticated captain by blacklisting their JWT and clearing the `token` cookie.

Request

- Method: `GET`
- URL: `/captain/logout`
- Auth: Bearer token or cookie `token`

Behavior

- Protected route. The controller extracts the token from cookies or `Authorization` header, creates a `BlacklistToken` entry (stored with a TTL of 24 hours), clears the cookie, and returns success.

Responses

- 200 OK — Success

  - Body example:

  ```json
  { "status": true, "message": "Logged out successfully." }
  ```

---
