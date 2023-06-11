# node-express-mongo-vue

## morgan
HTTP request logger middleware for node.js. It creates a new morgan logger middleware function using the given format and options. The format argument may be a string of a predefined name
### Options
Morgan accepts these properties in the options object.
1. immediate : Write log line on request instead of response. This means that a requests will be logged even if the server crashes, but data from the response (like the response code, content length, etc.) cannot be logged.
2. skip: Function to determine if logging is skipped, defaults to false
    ```
    // EXAMPLE: only log error responses
    morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
    })
    ```
3. common: Standard Apache common log output.
4. dev: Concise output colored by response status for development use. The :status token will be colored green for success codes, red for server error codes, yellow for client error codes
5. tiny: The minimal output.
etc.

Reference: https://github.com/expressjs/morgan#readme

## helmet
Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
By default, Helmet sets the following headers:
```
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
```
Reference: https://helmetjs.github.io/

## dotenv
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
Create a .env file in the root of your project:
```
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```
app.js
```
require('dotenv').config()
console.log(process.env.S3_BUCKET)
```

## express.static
To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
```
app.use(express.static('public'))
```

## Schema Validation in MongoDB
```
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "fullname not provided. Cannot create user without fullname "],
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email field is not provided. Cannot create user without email "],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!'
    }

  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}/.test(v);
      },
      message: '{VALUE} is not a valid 10 digit number!'
    }

  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```
Reference: https://www.topcoder.com/thrive/articles/schema-validation-in-mongodb-atlas

Regular Expression Reference: https://uibakery.io/regex-library/email

## express-slow-down
Basic rate-limiting middleware for Express that slows down responses rather than blocking them outright. Use to limit repeated requests to public APIs and/or endpoints such as password reset.

Plays nice with Express Rate Limit

Note: when using express-slow-down and express-rate-limit with an external store, you'll need to create two instances of the store and provide different prefixes so that they don't double-count requests.
```
const slowDown = require("express-slow-down");

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

//  apply to all requests
app.use(speedLimiter);
```
## express-rate-limit
```
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
```

## Content-Security-Policy
Ref: https://content-security-policy.com/