# Users
## Register
Allows the user to create an account.

**URL** : `/register`

**Method** : `POST`

**Auth required** : `NO`

**Data type** : `application/json`

**Data example**

```json
{
	"name": "Name",
	"username": "Username",
    "last_name": "LastName",
    "email": "emailadress@gmail.com",
	"password": "password",
	"phone_number: "1234"
}
```

## Success Response

**Code** : `201 OK`

## Error Response

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "parameters_error": [
        "Error: Missing parameters."
    ],
    "email_already_used": [
        "Error: Email already used."
    ]
}
```

## Login
Allows the user to log in to their previously created account.

**URL** : `/login`

**Method** : `POST`

**Auth required** : `NO`

**Data type** :`application/json`

**Data example**

```json
{
    "email": "emailadress@gmail.com",
	"password": "password",
}
```

## Success Response

**Code** : `200 OK`

## Error Response

**Code** : `400 BAD REQUEST or 401 Unauthorized`

**Content** :

```json
{
    "parameters_error": [
        "Error: Missing parameters."
    ],
    "user_not_found": [
        "Error: Unknown user."
    ]
}
```

## User information

Allows the user to get his profile informations.

**URL** : `/users/:id`

**Method** : `GET`

**Auth required** : `YES`

**Data type** : `token in Authorization header, ID as parameter`

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
    "name": "user's name",
	"last_name": "user's last_name",
	"username": "user's username",
	"email": "user's email",
	"phone_number": "user's phone_number",
	"images": "array of user's images",
}
```

## Error Response

**Code** : `400 BAD REQUEST or 401 Unauthorized or 403 Forbidden`

**Content** :

```json
{
    "not_authenticated": [
        "Error: You need to be authenticated"
    ],
    "user_not_found": [
        "Error: User not found"
    ]
}
```

## Update Profile

Allows the user to modify his personnal informations.

**URL** : `/users`

**Method** : `PUT`

**Auth required** : `YES`

**Data type** : `Token as Authorization header, body as application/json`

```json
{
	"name": "Name",
	"username": "Username",
    "last_name": "LastName",
    "email": "emailadress@gmail.com",
	"password": "password",
	"phone_number: "1234"
}
```

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
    "name": "user's name",
	"last_name": "user's last_name",
	"username": "user's username",
	"email": "user's email",
	"phone_number": "user's phone_number",
	"images": "array of user's images",
}
```

## Error Response

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "not_authenticated": [
        "Error: You need to be authenticated"
    ],
    "user_not_found": [
        "Error: User not found"
    ]
}
```

## Delete

Allows the user to delete his profile.

**URL** : `/users`

**Method** : `DELETE`

**Auth required** : `YES`

**Data type** : `Token as Authorization header`

## Success Response

**Code** : `204 No Content`

## Error Response

**Code** : `401 Unauthorized or 403 Forbidden`