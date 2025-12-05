# Backend API Documentation

## `/user/register` Endpoint

### Description

- Registers a new user and returns an authentication token plus the created user (password is not returned).

## HTTP Method

`POST`

### Endoint

`user/register`

### Request body (JSON)

The request body should be in JSON format and include the following fields:

- `fullname` (object, required)
  - `firstname` (string, required): User's First name — (minimum 3 characters)
  - `lastname` (string, required): User's Last name (minimum 3 characters)
- `email` (string, required): User's email address — (must be a valid email).
- `password` (string, required):User's email password — (minimum 6 characters).

### Example request body

````
{
  "fullname": {
---

## `/user/profile` Endpoint

### Description

- Returns the authenticated user's profile. Requires a valid JWT (sent in `Authorization: Bearer <token>` or as a `token` cookie).

### HTTP Method

`GET`

### Headers

- `Authorization: Bearer <jwt>` (recommended) OR cookie `token` set by the server

### Behavior

- The route is protected by `auth.middleware` which verifies the token and loads the user onto `req.user`.
- If the token is missing, expired, invalid, or blacklisted, the endpoint returns `401 Unauthorized`.

### Example Success Response (200)

```json
{
  "status": true,
  "message": "Profile fetched successfully.",
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
````

### Example Unauthorized Response (401)

```json
{
  "status": false,
  "message": "Access denied!"
}
```

---

## `/user/login` Endpoint

### Description

- Authenticates a user using their email and password, returning a JWT token upon success.

## HTTP Method

`POST`

### Endoint

`user/login`

### Request body (JSON)

The request body should be in JSON format and include the following fields:

- `email` (string, required): User's email address — (must be a valid email).
- `password` (string, required):User's email password — (minimum 6 characters).

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

````

## `/user/logout` Endpoint

### Description

- Logs out the current user by blacklisting the provided JWT and clearing the `token` cookie. Blacklisted tokens are stored with a 24-hour TTL so they cannot be used until they naturally expire.

### HTTP Method

`GET`

### Headers / Cookie

- `Authorization: Bearer <jwt>` OR cookie `token`

### Behavior

- The route requires authentication. On success the controller creates a blacklist entry for the token (persisted in `BlacklistToken` collection) and clears the cookie.
- Subsequent requests using the same token will be rejected by the `auth.middleware` which checks the blacklist before verifying the token.

### Example Success Response (200)

```json
{
  "status": true,
  "message": "Logged out successfully."
}
```

### Example Unauthorized Response (400/401)

```json
{
  "status": false,
  "message": "Unauthorized!"
}
```

### Notes

- Ensure the `auth.middleware` checks the `BlacklistToken` collection (or equivalent) to deny blacklisted tokens.
- The blacklist uses a TTL so tokens are automatically removed after 24 hours; adjust TTL if your JWT lifetime differs.
- Consider also invalidating refresh tokens if implemented.

````

    "firstname": "Jane",
    "lastname": "Doe"

},
"email": "jane.doe@example.com",
"password": "testuser"
}

````

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
````
