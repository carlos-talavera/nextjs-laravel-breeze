# nextjs-laravel-breeze

Example of a Next.js application that fetches data on the server and consumes a Laravel API using Breeze for authentication.

## Table of Contents

- [Features](#features)
- [Motivation](#motivation)
- [Custom auth cookie... why?](#custom-auth-cookie-why)
- [Custom middlewares](#custom-middlewares)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [API Testing](#api-testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Server-Side Rendering (SSR)**: Efficiently fetch and render data on the server.
- **Laravel Breeze**: Authentication system using Laravel Breeze.
- **TypeScript**: Type-safe code for better developer experience.
- **Validations with Zod**: Schema-based validation for safer data handling.
- **shadcn as UI Library**: Modern UI components for building sleek interfaces.
- **pnpm**: Fast, disk space efficient package manager.
- **Turbopack**: Blazing fast bundler for development.
- **Data Fetching with Search Params and Pagination**: Example implementation of data fetching with query parameters and pagination.
- **Server Actions**: Execute server-side actions seamlessly.
- **Paths Revalidations**: Dynamically revalidate paths for up-to-date content (needed after mutating records on the same page).
- **Next.js Built-in Middleware**: Middleware for handling requests efficiently.
- **Authenticated User Retrieval**: Fetch authenticated user details on both client and server components.

## Motivation

Laravel offers it's own [example](https://github.com/laravel/breeze-next). However, when I was developing an application using this stack, I noticed several things that weren't compatible with what I wanted to achieve:

1. It relies heavily on client-side data fetching. What I wanted was to fetch data on the server, since the application wasn't highly interactive, so I didn't need any complex logic for revalidating information and making it highly available and dynamic.
2. All the authentication logic is also handled on the client, which gives a terrible user experience from my perspective, since you as user have to wait for the client to "realize" that you are or not authenticated. This means that the components are rendered and only until then the application decides what to do, instead of deciding what to do first and then rendering the result. I thought I could leverage the Next.js built-in middleware to achieve this. Use the right tools for the right job, or something like that.
3. This point may seem not important, but on these times, at least for me it is. The example uses JavaScript instead of TypeScript, and while I understand that the example has its age, it could be improved and converted to TypeScript to also show the benefits of using types, not only for autocompletion, but also for having a better sense of what are you doing. That's what I think is the best about strong typing, that the care you need to have makes you understand the project better.
4. As it basically works on the client, it doesn't show the possibilities of using API Route Handlers and server actions, so it also doesn't show the subtleties of Laravel Sanctum that are "magically" handled when making requests from the client. Discovering what were the key factors to make it work server to server instead of client to server was a really interesting process (spoiler alert: the subtleties are on the headers).

The other features are just what I think is a must nowadays, like using Zod and some UI library to make your life easier, as well as pnpm so you don't have to see that huge `node_modules` folder that easily scares anyone out.

## Custom auth cookie... why?

I mentioned on the features that you can retrieve the info. of the authenticated user on both client and server components, and for this I use a custom auth cookie. The reason? The cookies that Laravel provides by itself are not enough to ensure that the user is authenticated. They are created when you make any request, so there's no guarantee that you're "in" and it isn't as easy as redirecting to the login if the cookie has an invalid value or doesn't exist. Of course you can just make a request to any route that is protected using those cookies and see if it works or not, but that leads us to the other problem. 

You don't actually have access to the information of the user because you can't decrypt the cookies set by Laravel because you didn't encrypt them on the first place. That also means that you can't tell if the value of the cookie is valid unless you make a request to the API and see what happens. Basically, your application relies on information that was created somewhere else and that you only know that you have to use, but aren't able to know anything about their validity internally, you have to go to ask somebody else.

Therefore, the only logical conclusion was to create a cookie that was handled internally by Next.js that guaranteed a valid session and could be read by Next.js itself seamlessly. For this purpose, the `auth_user` cookie is created using the [jose package](https://www.npmjs.com/package/jose), which is a lightweight JWT library that works on the edge runtime, so it allows us to use it on the middleware without worrying for having or not the needed APIs to generate these tokens.

This cookie is HttpOnly to (try) to provide a bit of security to the application, so accessing to it from the client requires an intermediate API Route Handler (clever, ha? Well, let me believe it's clever).

## Custom middlewares

Custom middlewares are also used to handle the conversion from camelCase to snake_case and viceversa (a middleware for the requests and a middleware for the responses). A detailed explanation is offered on [this article](https://dev.to/charliet1802/transforming-api-requests-and-responses-in-laravel-11-the-easy-way-21i5) that I wrote a while ago when I was dealing with this discrepancy in naming conventions.

## Requirements

This is just a reference because I created the project using the (almost) latest versions of every technology as of now, but using versions a bit older will probably work too.

- **Node.js**: v22.x or higher
- **pnpm**: v9.x or higher
- **PHP**: v8.x or higher
- **Composer**: v2.x or higher
- **Laravel**: v11.x or higher

## Installation

### Frontend

1. **Clone the repository**:
    ```bash
    git clone https://github.com/carlos-talavera/nextjs-laravel-breeze.git
    cd nextjs-laravel-breeze/frontend
    ```

2. **Install dependencies**:
    ```bash
    pnpm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the `frontend` directory with the following content:

    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
    FRONTEND_URL=http://localhost:3000
    JWT_SECRET=super-secret
    ```

    - `NEXT_PUBLIC_BACKEND_URL`: The URL of the Laravel backend API. This variable is shared between client and server components, hence the `NEXT_PUBLIC` prefix.
    - `FRONTEND_URL`: The URL of the frontend application. It is used for the `Referer` header on requests so Laravel accepts them.
    - `JWT_SECRET`: A secret key used for creating a custom auth cookie using the `jose` library, which works on the edge runtime (middleware).

### Backend

1. **Navigate to the backend directory**:
    ```bash
    cd ../backend
    ```

2. **Install dependencies**:
    ```bash
    composer install
    ```

3. **Set up environment variables**:
    Copy the `.env.example` file to `.env` and configure it as needed:
    ```bash
    cp .env.example .env
    ```

    The default variables include configurations for the database, application key, and other settings that Laravel requires to run correctly. Refer to the `.env.example` file for detailed information.

4. **Generate application key**:
    ```bash
    php artisan key:generate
    ```

5. **Run migrations**:
    ```bash
    php artisan migrate
    ```

## Usage

### Starting the Development Servers

#### Frontend

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Start the development server**:
    ```bash
    pnpm dev
    ```

#### Backend

I don't use Sail, since I find it easier to use my own Docker images (and easily adjust a dev image to a prod image), but to simplify this setup, there's nothing better than just installing PHP and enabling the needed extensions and running the dev server.

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2. **Start the development server**:
    ```bash
    php artisan serve
    ```

Now you should have both the frontend and backend servers running locally.

## Development

### Linting and Formatting

#### Frontend

1. **Lint the code**:
    ```bash
    pnpm lint
    ```

2. **Format the code using Prettier**:
    ```bash
    pnpm format
    ```

#### Backend

- Laravel Pint is used for code formatting in the backend. You can run:
    ```bash
    vendor/bin/pint
    ```

### Building for Production

#### Frontend

1. **Build the frontend application**:
    ```bash
    pnpm build
    ```

2. **Start the application in production mode**:
    ```bash
    pnpm start
    ```

### Running Tests

#### Backend

1. **Run the tests**:
    ```bash
    php artisan test
    ```

## API Testing

A Postman's collection is included to test the API. It uses environment variables, so you must create an environment with a variable called `base_url` (e. g. `localhost:8000`) that will be used for all the requests. There's a route for obtaining Laravel Sanctum's cookies that sets the cookies and creates another variable called `xsrf-token` that will be used on every request. This route must be used before and after logging in and before logging out (at least that's what the experience taught me).

## Troubleshooting

One known issue is that when using Turbopack for development, sometimes accessing to an URL directly results on a context error. To resolve this, the server must be stopped and started again.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the repository**.
2. **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Make your changes**.
4. **Commit your changes**:
    ```bash
    git commit -m 'Add some feature'
    ```
5. **Push to the branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
6. **Create a pull request**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.