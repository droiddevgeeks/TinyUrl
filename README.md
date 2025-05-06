# TinyURL API

A URL shortening service built with [NestJS](https://nestjs.com/). This project allows users to shorten long URLs and retrieve the original URLs using the shortened ones.

## Features

- Shorten long URLs into compact, shareable links.
- Retrieve the original URL using the shortened link.
- Centralized logging for all API requests and responses.
- Environment-based configuration using `.env` files.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (optional, for development)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/droiddevgeeks/TinyUrl.git
   cd TinyUrl
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the root directory and configure the following:

   ```env
   PORT=3000
   ```

## Running the Application

1. Start the development server:

   ```bash
   npm run start:dev
   ```

2. The application will be available at http://localhost:3000.

## API Endpoints

1. Shorten a URL
   POST /url/shorten

   ### Example Request Payload

   ```json
   {
     "originalUrl": "https://example.com"
   }
   ```

   ### Example Response Payload

   ```json
   {
     "shortUrl": "http://localhost:3000/url/abc123"
   }
   ```

2. Retrieve the Original URL
   GET /url/:shortUrl

   ### Example Response Payload

   ```json
   {
     "originalUrl": "https://example.com"
   }
   ```

### Project Structure

```markdown
src/
├── app.module.ts          # Main application module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── middleware/
│   └── logger.middleware.ts # Centralized logging middleware
├── url/
│   ├── tinyurl.controller.ts # URL controller
│   ├── tinyurl.service.ts    # URL service
│   ├── dto/
│   │   └── create-url.dto.ts # Data Transfer Object for URL creation
```

## Centralized Logging
All incoming requests and outgoing responses are logged using a custom middleware (```LoggerMiddleware```). Logs include:

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
