# Typewriter

I hate WordPress.

So I just wrote my own bare-bones CMS.

# Auth

Authentication follows a very simple flow

1. The user is manually created on the Auth0 dashboard
2. An email is sent to the registered address with a QR code for use with any OTP generation app
3. The user registers the code on their app

With OTP generation setup, login is equally straightforward

1. The user accesses the login page and provides their email
2. A request is sent to the backend to check if the email exists in the database
3. On success, the user is presented with an OTP field, which requests a generated code from the app
4. Code is sent back and the user is logged in.