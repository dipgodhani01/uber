# Authentication Endpoints

This document describes the authentication-related endpoints in the backend.
Each endpoint section includes purpose, request shape, validations, responses, and example requests.

Base URL (local): `http://localhost:3000`

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

Validations (implemented in `validations/user.validation.js`)

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

- 400 Bad Request — Validation errors or other client errors

  - Example (express-validator):

  ```json
  {
    "errors": [
      {
        "msg": "First name must be at least 3 characters long!",
        "param": "fullname.firstname"
      }
    ]
  }
  ```

- 409 Conflict — Email already exists (service throws this as an error message)
- 500 Internal Server Error — Unexpected server error

Notes & Implementation

- Passwords are hashed using `bcrypt` before storage (`user.model.hashPasswrod`).
- `user.service.createUser` checks for existing email and throws an error if the email already exists.
- A JWT is issued using `user.generateAuthToken()`; ensure `process.env.JWT_SECRET` is set.

Quick cURL

```
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Doe"},"email":"jane.doe@example.com","password":"s3cr3t!"}'
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

- Same as `loginValidation` in `validations/user.validation.js`.

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

  - The server also sets a cookie `token` with the JWT.

- 400 Bad Request — Validation errors
- 401 Unauthorized — Invalid email or password
- 500 Internal Server Error — Unexpected server error

Security note

- The controller currently fetches the user with `select('+password')` for verification. The returned `user` in the response should NOT include the password. The controller relies on Mongoose `select: false` but ensure you don't return the password field.

Quick cURL

```
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.doe@example.com","password":"s3cr3t!"}'
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

- Protected route using `auth.middleware` which verifies JWT, checks blacklist, and loads the user into `req.user`.

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

- 401 Unauthorized — Missing/invalid/blacklisted token

Quick cURL

```
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer <jwt-token>"
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

- 400 Bad Request — No token provided
- 401 Unauthorized — Invalid/blacklisted token

Quick cURL

```
curl -X GET http://localhost:3000/user/logout \
  -H "Authorization: Bearer <jwt-token>"
```

Notes & Recommendations

- Blacklist tokens are stored in `backend/models/blacklistToken.model.js` with a TTL of 24 hours. The `auth.middleware` should check that collection to deny blacklisted tokens.
- Ensure `auth.middleware` uses the `BlacklistToken` model (not `userModel`) when checking for blacklisted tokens.
- Keep `process.env.JWT_SECRET` set and secure. Match JWT expiration with blacklist TTL as desired.
- Consider storing refresh tokens (if implemented) and invalidating them on logout.

---

If you want, I can:

- Update `auth.middleware` to correctly use the `BlacklistToken` model and add helper service functions `blacklistToken(token)` and `isTokenBlacklisted(token)`.
- Add Postman collection or automated tests for these endpoints.
