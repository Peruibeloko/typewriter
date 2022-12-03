# Typewriter

Its a bare-bones CMS, there's really no reason to use this.

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

Returns a listing of the title, creation timestamp, author and title of all posts in a paginated fashion

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

### `GET /post/count` - Count posts

Returns how many posts there are in your blog

### `GET /post/latest` - Get latest post ID

Returns the ID for the latest post

### `GET /post/first` - Get first post ID

Returns the ID for the first post ever made. Ever.

### `GET /post/random` - Get random post ID

Returns the ID for a random post

### `GET /post/:id` - Get post by ID

Pretty straightforward.

This is useful for accessing posts directly, using permalinks.

### `PATCH /post/:id` - Update post (Auth needed)

Updates the specified post

Payload

```json
{
  "title": "New Title!! (Now with 100% more examples!)"
}
```

### `DELETE /post/:id` - Delete post (Auth needed)

Deletes the specified post

### `GET /post/:id/next` - Get next post ID

- Tomorrow's post (You'll get the ID for this post)
- Today's post (You are here)
- Yesterday's post

### `GET /post/:id/prev` - Get previous post ID

- Tomorrow's post
- Today's post (You are here)
- Yesterday's post (You'll get the ID for this post)
