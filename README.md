# Buttery Management System

A comprehensive web application for managing buttery operations including inventory, sales, user management, and reporting.

## Features

- **User Management**: Role-based access control (Admin, Inventory Manager, Vendor)
- **Product Management**: Add, edit, and track products with categories
- **Sales Management**: Record sales with multiple payment methods
- **Inventory Tracking**: Real-time stock levels and low-stock alerts
- **Reporting**: Dashboard with sales analytics and performance metrics
- **Multi-location Support**: Manage multiple buttery locations

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: JWT with HTTP-only cookies
- **Database**: Configurable (MySQL, PostgreSQL, SQLite, MongoDB)
- **State Management**: React hooks and context

## Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd buttery-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Login

- **Email**: admin@buttery.com
- **Password**: admin123

## Database Configuration

The application supports multiple database types. Configure your database in `.env.local`:

### MySQL
\`\`\`env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=buttery_management
\`\`\`

### PostgreSQL
\`\`\`env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=buttery_management
\`\`\`

### SQLite
\`\`\`env
DB_TYPE=sqlite
DB_PATH=./database.sqlite
\`\`\`

### MongoDB
\`\`\`env
DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_NAME=buttery_management
\`\`\`

### Database URL (Alternative)
\`\`\`env
DATABASE_URL=mysql://user:password@localhost:3306/buttery_management
\`\`\`

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `DB_TYPE` | Database type | No | `mysql` |
| `DB_HOST` | Database host | No | `localhost` |
| `DB_PORT` | Database port | No | `3306` |
| `DB_USER` | Database username | No | `root` |
| `DB_PASSWORD` | Database password | No | - |
| `DB_NAME` | Database name | No | `buttery_management` |
| `DATABASE_URL` | Complete database URL | No | - |

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── products/          # Product management
│   ├── sales/            # Sales management
│   ├── inventory/        # Inventory management
│   ├── reports/          # Reports and analytics
│   └── users/            # User management
├── components/           # Reusable UI components
├── lib/                 # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database abstraction layer
│   └── utils.ts         # General utilities
├── hooks/               # Custom React hooks
└── public/              # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Master Data
- `GET /api/locations` - Get all locations
- `GET /api/categories` - Get all categories

## Development

### Adding a New Database

1. Install the database driver:
   \`\`\`bash
   npm install your-database-driver
   \`\`\`

2. Update the `DatabaseService` class in `lib/db.ts`

3. Add configuration options to `.env.example`

### Adding New Features

1. Create API routes in `app/api/`
2. Add corresponding frontend pages in `app/`
3. Update the database service if needed
4. Add proper TypeScript types

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

### Docker
\`\`\`bash
docker build -t buttery-management .
docker run -p 3000:3000 buttery-management
\`\`\`

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
