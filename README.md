# Buttery Management System

A comprehensive web application for managing buttery operations across multiple locations with role-based access control.

## 🚀 Features

- **User Management**: Role-based access (Admin, Vendor, Inventory Manager)
- **Product Catalog**: Complete product management with categories
- **Sales Tracking**: Record sales with multiple payment methods
- **Inventory Management**: Real-time stock tracking and low-stock alerts
- **Location Management**: Multi-location support
- **Reports & Analytics**: Comprehensive reporting dashboard
- **Real-time Dashboard**: Live statistics and recent activity

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MySQL
- **UI Components**: shadcn/ui
- **Authentication**: JWT with HTTP-only cookies
- **Database**: MySQL with connection pooling

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/brunleobe/Buttery-Management-System.git
   cd Buttery-Management-System
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your configuration:
   \`\`\`env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=ogabrunle2007$
   DB_NAME=ButteryDB
   JWT_SECRET=brunleandtimididthisprojectbecauseofmercy
   \`\`\`

4. **Set up the database**
   
   Create and populate your MySQL database using the provided SQL file:
   \`\`\`bash
   mysql -u root -pogabrunle2007$ < BMS1.sql
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Login Credentials

### Admin User (Full Access)
- **Email**: `mercy@example.com`
- **Password**: `admin123`

### Vendor Users
- **Email**: `jessica@example.com` / **Password**: `vendor123`
- **Email**: `esther@example.com` / **Password**: `vendor123`
- **Email**: `sharon@example.com` / **Password**: `vendor123`
- **Email**: `elozino@example.com` / **Password**: `vendor123`

### Inventory Manager Users
- **Email**: `emmanuel@example.com` / **Password**: `manager123`
- **Email**: `sylvanus@example.com` / **Password**: `manager123`

## 🏗️ Database Schema

The application uses the following main tables:

- **User**: System users with roles and contact information
- **ButteryLocation**: Physical buttery locations
- **Product**: Product catalog with pricing
- **Sales**: Sales transactions
- **SaleItem**: Individual items in each sale
- **InventoryTransaction**: Stock movement tracking
- **ProductTransaction**: Links products to inventory transactions
- **Product_Location**: Maps products to locations

## 🎯 Role-Based Access

| Feature | Admin | Inventory Manager | Vendor |
|---------|-------|------------------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Record Sales | ✅ | ❌ | ✅ |
| Manage Inventory | ✅ | ✅ | ❌ |
| View Products | ✅ | ✅ | ✅ |
| View Reports | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Sales
- `GET /api/sales` - Get sales history
- `POST /api/sales` - Record new sale

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Locations & Categories
- `GET /api/locations` - Get all locations
- `GET /api/categories` - Get all categories

## 🚀 Deployment

### Environment Variables for Production

\`\`\`env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=ogabrunle2007$
DB_NAME=ButteryDB
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
\`\`\`

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Mercy Odediran** - Project Lead
- **Jessica Ogbonna** - Frontend Developer
- **Emmanuel Ogundele** - Backend Developer
- **Esther Opiah** - UI/UX Designer
- **Sylvanus Obot** - Database Administrator
- **Sharon Orji** - Quality Assurance
- **Elozino Ofeh-Mamuzoh** - DevOps Engineer

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/brunleobe/Buttery-Management-System/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Barcode scanner integration
- [ ] Receipt printing functionality
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-currency support
- [ ] Backup and restore functionality
