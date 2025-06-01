# TinyURL API  [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/droiddevgeeks/TinyUrl)

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
     "shortUrl": "http://localhost:3000/abc123"
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
├── cache/
│   └──cache.module.ts       # Redis cache module setup ([src/cache/cache.module.ts](src/cache/cache.module.ts))
│   └──cache.provider.ts     # Redis client provider ([src/cache/cache.provider.ts](src/cache/cache.provider.ts))
│   └──cache.service.ts      # Cache service abstraction ([src/cache/cache.service.ts](src/cache/cache.service.ts))
├── app.module.ts            # Main application module
├── app.controller.ts        # Root controller
├── app.service.ts           # Root service
├── middleware/
│   └── logger.middleware.ts # Centralized logging middleware
|   └── throttler.exception.filter.ts # Handles rate-limiting exceptions ([src/middleware/throttler.exception.filter.ts](src/middleware/throttler.exception.filter.ts))
│   └── throttler.gaurd.ts           # Custom throttler guard with logging ([src/middleware/throttler.gaurd.ts](src/middleware/throttler.gaurd.ts))
├── url/
│   ├── tinyurl.controller.ts # URL controller
│   ├── tinyurl.service.ts    # URL service
│   ├── dto/
│   │   └── create-url.dto.ts # Data Transfer Object for URL creation
```

## Centralized Logging
All incoming requests and outgoing responses are logged using a custom middleware (```LoggerMiddleware```). Logs include:

## Caching Layer

This project uses Redis for caching URL mappings to improve performance and reduce database load. The cache is managed via:

- [`CacheModule`](src/cache/cache.module.ts): Registers the cache service and provider.
- [`CacheProvider`](src/cache/cache.provider.ts): Configures and provides a Redis client.
- [`CacheService`](src/cache/cache.service.ts): Exposes methods to set/get cache entries and manages Redis connection lifecycle.

Make sure to configure your `.env` file with the correct Redis connection details.

## Rate Limiting

- [`throttler.exception.filter.ts`](src/middleware/throttler.exception.filter.ts): Catches and formats rate-limiting errors with a user-friendly message.
- [`throttler.gaurd.ts`](src/middleware/throttler.gaurd.ts): Logs throttler keys for better monitoring and debugging of rate-limited requests.

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
