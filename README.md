# AutoDealer - Car Management System

A modern car dealership platform with multilingual support (RU/EN) and comprehensive car management features.

## 🌐 Live Demo

**[View Live Project](https://autoproject-xi78.onrender.com/)**

![AutoDealer Preview](./auto.gif)

## 🚀 Features

- 🌍 **Multilingual Support** - Russian/English localization
- 🚗 **Car Management** - Full CRUD operations for vehicles
- 👨‍💼 **Admin Panel** - Dealer dashboard with comprehensive controls
- 🔍 **Advanced Filtering** - Search by brand, price, year, mileage
- 📱 **Responsive Design** - Mobile-first approach with modern UI
- 🖼️ **Image Gallery** - Multiple photo upload and display
- 📊 **Analytics** - View tracking and car statistics
- 🔐 **Authentication** - Secure admin login system
- 💼 **Professional Layout** - Clean, modern interface

## 📱 Screenshots

### Public Car Catalog
- Browse available cars with advanced filters
- Multilingual interface (RU/EN)
- Mobile-responsive design

### Car Details Page
- Comprehensive car information
- Image gallery with multiple photos
- Contact forms for inquiries

### Dealer Dashboard
- Add/edit/delete cars
- Status management (draft/published/sold)
- Admin quick actions

## 🗄️ Database Structure

### Models

#### Admin
- `id` - Unique identifier
- `email` - Admin email (unique)
- `password` - Hashed password
- `name` - Admin name
- `role` - Role (default: "admin")
- `createdAt` - Creation date
- `updatedAt` - Update date

#### Car
- `id` - Unique identifier
- `brand` - Car brand
- `model` - Car model
- `generation` - Generation (optional)
- `year` - Manufacturing year
- `mileage` - Mileage in km
- `transmission` - Transmission type
- `fuel` - Fuel type
- `drive` - Drive type
- `bodyType` - Body type
- `color` - Color
- `power` - Engine power (hp)
- `engineVolume` - Engine volume (L)
- `euroStandard` - Euro standard
- `vin` - VIN number (unique)
- `condition` - Condition
- `customs` - Customs cleared
- `vat` - VAT included
- `owners` - Number of owners
- `price` - Price
- `currency` - Currency
- `negotiable` - Negotiable price
- `city` - City location
- `description` - Description
- `photos` - Photos (JSON array)
- `status` - Status (draft/published/sold)
- `views` - View count
- `createdAt` - Creation date
- `updatedAt` - Update date
- `adminId` - Creator admin ID

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Admin login

### Cars
- `GET /api/cars` - Get all cars (with pagination and filters)
- `POST /api/cars` - Create new car
- `GET /api/cars/[id]` - Get specific car
- `PUT /api/cars/[id]` - Update car
- `DELETE /api/cars/[id]` - Delete car

### Admins
- `GET /api/admins` - Get all admins (with pagination)

### File Upload
- `POST /api/upload` - Upload car images
- `GET /api/files/[filename]` - Serve uploaded files

## 🛠️ Installation & Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd auto_project
```

2. **Install dependencies:**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
RENDER="false"
```

4. **Set up the database:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Seed the database with sample data:**
```bash
npm run db:seed
```

6. **Start the development server:**
```bash
npm run dev
```

7. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Test Data

After running `npm run db:seed`, the following test data is created:

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `admin123`

### Sample Cars
- **BMW X5** (2018) - Luxury SUV with premium features
- **Mercedes-Benz C-Class** (2019) - Executive sedan
- **Audi A4** (2020) - Modern business car

> Use the admin credentials to access the dealer dashboard at `/dealer`

## 📚 API Usage Examples

### Register Admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "password123",
    "name": "New Admin"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get Cars with Filters
```bash
# Get published cars with pagination
curl "http://localhost:3000/api/cars?page=1&limit=10&status=published"

# Get cars by brand
curl "http://localhost:3000/api/cars?brand=BMW"

# Get cars with price range
curl "http://localhost:3000/api/cars?priceFrom=20000&priceTo=50000"
```

### Create New Car
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2021,
    "mileage": 30000,
    "transmission": "automatic",
    "fuel": "petrol",
    "drive": "front",
    "bodyType": "sedan",
    "color": "Silver",
    "power": 200,
    "engineVolume": 2.5,
    "euroStandard": "Euro 6",
    "vin": "4T1B11HK5KU123456",
    "condition": "excellent",
    "customs": true,
    "vat": true,
    "owners": 1,
    "price": 35000,
    "currency": "EUR",
    "negotiable": true,
    "city": "Moscow",
    "description": "Excellent condition",
    "photos": ["/placeholder.jpg"],
    "status": "published"
  }'
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Full-stack framework
- **Prisma** - Type-safe ORM
- **SQLite** - Local database (PostgreSQL in production)
- **bcryptjs** - Password hashing

### Features
- **Multilingual Support** - i18n with React Context
- **Image Upload** - File handling and storage
- **Responsive Design** - Mobile-first approach
- **Form Validation** - Client and server-side validation

### Deployment
- **Render** - Cloud hosting platform
- **PostgreSQL** - Production database
- **Static File Serving** - Optimized image delivery

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Live Demo:** [https://autoproject-xi78.onrender.com/](https://autoproject-xi78.onrender.com/)
- **Admin Panel:** [https://autoproject-xi78.onrender.com/dealer](https://autoproject-xi78.onrender.com/dealer)

---

**Made with ❤️ using Next.js and modern web technologies**