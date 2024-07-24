
# UI Component Generator - Figr

## Overview

The UI Component Generator is a tool for creating and managing UI components with customizable styles. It allows users to define and modify styles for various components such as Buttons, Inputs, and Selects, using a user-friendly interface. Built with Next.js, Prisma, and PostgreSQL, this application provides a robust solution for designing and generating styled components.

## Tech Stack

- **Next.js**: A React framework for building server-side rendered (SSR) and statically generated applications.
- **Prisma**: An ORM for PostgreSQL that simplifies database interactions.
- **PostgreSQL**: A powerful, open-source relational database system.

## Features

- Create and manage UI components with customizable styles.
- Define and modify values for colors, border-radius, and spacing.
- Generate different variants of components with varied styles.
- Persistent storage of user-defined component styles using PostgreSQL.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (>= 12.x)
- PostgreSQL client (e.g., pgAdmin)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/ui-component-generator.git
   cd ui-component-generator
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up PostgreSQL Database**

   - Create a new PostgreSQL database.
   - Update the database connection details in the `.env` file.

   Example `.env` configuration:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/your-database
   NEXTAUTH_SECRET=your-secret
   ```

4. **Run Prisma Migrations**

   ```bash
   npm db-migrate
   ```

5. **Generate Prisma Schema types**

   ```bash
   npm generate
   ```

6. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application should be running at `http://localhost:3000`.

### Usage

1. **Navigate to the App**

   Open your browser and go to `http://localhost:3000`.

2. **Create and Customize Components**

   - Use the UI to create new components and customize their styles.
   - Save and view the components with your defined styles.

### Running Tests

To run tests, use the following command:

```bash
npm test
```

### Deployment

For deployment, consider using Vercel or any other hosting provider of your choice. Ensure that the environment variables are correctly configured on the hosting platform.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact

For any questions or inquiries, please contact:

- [Your Name](mailto:your-email@example.com)
- [Your LinkedIn](https://www.linkedin.com/in/your-profile)
- [Your GitHub](https://github.com/your-username)

