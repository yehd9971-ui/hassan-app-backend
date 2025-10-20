# Hassan App Backend API

Backend API for Hassan App built with Node.js, Express, TypeScript, and MongoDB Atlas.

## 🚀 Features

- **Authentication System**: JWT-based authentication with rate limiting
- **Poems Management**: CRUD operations for poems with validation
- **API Versioning**: Structured API with version control
- **Security**: Helmet, CORS, MongoDB injection protection
- **Rate Limiting**: Configurable rate limits for different endpoints
- **TypeScript**: Full TypeScript support with type safety
- **MongoDB Atlas**: Cloud database integration

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Atlas account

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hassan-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /hassan-app/login` - User login
- `POST /hassan-app/register` - User registration

### Poems API (v1)
- `GET /api/v1/poems` - Get all poems
- `POST /api/v1/poems` - Create new poem (requires auth)
- `GET /api/v1/poems/:id` - Get poem by ID
- `PUT /api/v1/poems/:id` - Update poem (requires auth)
- `DELETE /api/v1/poems/:id` - Delete poem (requires auth)

### Health Check
- `GET /health` - Server health status

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 3000) | No |
| `REDIS_URL` | Redis URL for rate limiting | No |

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **MongoDB Injection Protection**: Sanitizes input
- **JWT Authentication**: Secure token-based auth

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## 🚀 Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Other Platforms
The application is compatible with:
- Heroku
- Vercel
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Mohammed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request