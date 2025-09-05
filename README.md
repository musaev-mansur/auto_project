# CarsPark - Car Management System

A modern car dealership platform with multilingual support (RU/EN/NL/FR) and comprehensive car management features.

## 🌐 Live Demo

**[View Live Project](https://autoproject-xi78.onrender.com/)**

![CarsPark Preview](./auto.gif)

## 🚀 Features

- 🌍 **Multilingual Support** - Russian/English/Dutch/French localization
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
- Multilingual interface (RU/EN/NL/FR)
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
- `created_at` - Creation date
- `updated_at` - Update date

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
- `body_type` - Body type
- `color` - Color
- `power` - Engine power (hp)
- `engine_volume` - Engine volume (L)
- `euro_standard` - Euro standard
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
- `created_at` - Creation date
- `updated_at` - Update date
- `admin_id` - Creator admin ID

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/profile` - Get admin profile

### Cars
- `GET /api/cars` - Get all cars (with pagination and filters)
- `POST /api/cars` - Create new car
- `GET /api/cars/[id]` - Get specific car
- `PUT /api/cars/[id]` - Update car
- `DELETE /api/cars/[id]` - Delete car

### Parts
- `GET /api/parts` - Get all parts (with pagination and filters)
- `POST /api/parts` - Create new part
- `GET /api/parts/[id]` - Get specific part
- `PUT /api/parts/[id]` - Update part
- `DELETE /api/parts/[id]` - Delete part

### Admins
- `GET /api/admins` - Get all admins (with pagination)

### File Upload & S3 Management
- `POST /api/images/upload` - Upload images to Amazon S3
- `DELETE /api/images/delete` - Delete images from S3

### API Documentation
- `GET /api/docs/` - Swagger UI documentation
- `GET /api/redoc/` - ReDoc documentation
- `GET /api/schema/` - OpenAPI schema

## 🚀 Быстрый запуск

### Windows
```cmd
start-local.bat
```

### Linux/Mac
```bash
chmod +x start-local.sh
./start-local.sh
```

Приложение будет доступно по адресу: **http://localhost:80**

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository:**
```bash
git clone <repository-url>
cd auto_project
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
# Django Settings
SECRET_KEY="your-django-secret-key"
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL="sqlite:///db.sqlite3"

# AWS S3 Configuration (optional for local development)
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET_NAME="aslan-auto-img"
```

3. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up the database:**
```bash
python manage.py migrate
python manage.py createsuperuser
```

5. **Start the development server:**
```bash
# Backend (Django)
python manage.py runserver

# Frontend (Next.js) - in another terminal
cd frontend
npm install
npm run dev
```

6. **Open your browser:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Docs: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

### Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build -d
```

2. **Access the application:**
- Application: [http://localhost:80](http://localhost:80)
- API Documentation: [http://localhost:80/api/docs/](http://localhost:80/api/docs/)

## ☁️ Amazon S3 Setup (Optional)

### 1. Create S3 Bucket
1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Create a new bucket named `aslan-auto-img`
3. Set region to `eu-west-1` (or your preferred region)
4. Configure bucket for public read access

### 2. Configure CORS
Add this CORS configuration to your S3 bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 3. Create IAM User
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user with programmatic access
3. Attach the `AmazonS3FullAccess` policy
4. Save the Access Key ID and Secret Access Key

### 4. Update Environment Variables
Add your AWS credentials to `.env`:
```env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET_NAME="aslan-auto-img"
```

### 5. Migrate Existing Images (Optional)
Run the migration script to move existing images to S3:
```bash
npm run migrate:s3
```

## 🧪 Test Data

After running migrations, you can create test data:

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `admin123`

> Use the admin credentials to access the dealer dashboard at `/dealer`

## 📚 API Usage Examples

### Admin Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get Cars with Filters
```bash
# Get published cars with pagination
curl "http://localhost:8000/api/cars?page=1&limit=10&status=published"

# Get cars by brand
curl "http://localhost:8000/api/cars?brand=BMW"

# Get cars with price range
curl "http://localhost:8000/api/cars?price_from=20000&price_to=50000"
```

### Create New Car
```bash
curl -X POST http://localhost:8000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2021,
    "mileage": 30000,
    "transmission": "automatic",
    "fuel": "petrol",
    "drive": "front",
    "body_type": "sedan",
    "color": "Silver",
    "power": 200,
    "engine_volume": 2.5,
    "euro_standard": "Euro 6",
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
- **Django 5.0** - Python web framework
- **Django REST Framework** - API development
- **Django ORM** - Database abstraction layer
- **PostgreSQL** - Production database
- **SQLite** - Local development database
- **drf-spectacular** - OpenAPI documentation

### Features
- **Multilingual Support** - i18n with React Context (RU/EN/NL/FR)
- **Amazon S3 Integration** - Cloud image storage and management
- **Image Upload** - Drag & drop with preview and validation
- **Responsive Design** - Mobile-first approach
- **Form Validation** - Client and server-side validation
- **API Documentation** - Swagger UI and ReDoc

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **PostgreSQL** - Production database
- **Amazon S3** - Cloud image storage

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

**Made with ❤️ using Django, Next.js and modern web technologies**