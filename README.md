# Typewriter

I hate WordPress.

So I just wrote my own bare-bones CMS.

## Installation

Typewriter expects you to have a MongoDB instance running somewhere (I keep mine at a free tier cluster in MongoDB Atlas)

1. Clone this repo where you'd like to run it from
2. `npm i` or `pnpm i`
3. Set the `MONGODB_URL` (for data) and `BLOG_URL` (for CORS) environment variables (.env file at the root)
4. `npm start`

## Authentication

I opted for a (relatively) simple no-password method for authentication which follows an unusual approach, which combines an allowlist with TOTP.

All you need to do is create entries on the `allowlist` collection in the following format

```json
{
  "_id": "john@example.com",
  "isRegistered": false
}
```

And send a `POST` request to `/auth/signup` with the following data

```json
{
  "email": "john@example.com"
}
```

To recieve the secret code used to configure your preferred TOTP generator, like Google Authenticator. It uses standard configuration (30 second steps and 6 digit long codes)

You may invoke the `/auth/signup` endpoint manually and get the secret that way, or plug it into some frontend code and generate a QR Code from it.

## Usage

Typewriter's interface with the world is a REST API, which provides basic blogkeeping funcionality (create posts, get posts, etc)

### `GET /post` - Get all posts

Returns all posts using pagination

Control results using the `page` and `limit` (default is 10) query parameters.

### `POST /post` - Create post (Auth needed)

Creates a new post and stores it in the database.

Payload

```json
{
  "title": "My awesome post",
  "author": "John Smith",
  "post": "*This is some good stuff*"
}
```

### `GET /field` - Get fields from all posts

Retrieves just the informed fields from all posts

Uses same pagination mechanics as `getAllPosts`

Payload

```json
{
  "fields": "title author"
}
```

### `GET /count` - Count posts

Returns how many posts there are in the database

### `GET /latest` - Get latest post

Returns the latest post

### `GET /first` - Get first post

Returns the first post ever made. Ever.

### `GET /offset/:offset` - Get post by offset

Returns the post with the specified offset relative to the latest one.

for example, a `/offset/5` will return the fifth post back from the latest one

This is useful for navigating posts in an orderly manner, relative to time

### `GET /datetime/:datetime` - Get post by UNIX milis

UNIX Millis are the way Typewriter uses for creating permalinks

Since timestamps are immutable, a request to `/datetime/1642997670616` the same post everytime, whereas `/offset/3` could change in case a post gets deleted

This is useful for accessing posts directly, using permalinks.

### `PATCH /:datetime` - Update post (Auth needed)

Updates the specified post

Payload

```json
{
  "title": "New Title!! (Now with 100% more exemplification)"
}
```

### `DELETE /:datetime` - Delete post (Auth needed)

Deletes the specified post
