# Autoforge Backend API

Defence Drone Technology Platform — REST API

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image/video storage)
- Nodemailer (email)

## Setup

```bash
cd autoforge-backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

**Important:** Admin credentials are stored in `.env` only — no database entry needed.

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | User login |
| POST | /api/auth/admin/login | Public | Admin login (env-based) |
| GET | /api/auth/me | Private | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/products | Public | Get all products (filter: category, search) |
| GET | /api/products/:id | Public | Get product by ID |
| POST | /api/products | Admin | Create product (multipart) |
| PUT | /api/products/:id | Admin | Update product (multipart) |
| DELETE | /api/products/:id | Admin | Delete product |

### Categories
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Services
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/services?type=lab-setup | Public |
| GET | /api/services/admin/all | Admin |
| POST | /api/services | Admin |
| PUT | /api/services/:id | Admin |
| DELETE | /api/services/:id | Admin |

### Training Programs
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/training | Public |
| GET | /api/training/:id | Public |
| POST | /api/training | Admin |
| PUT | /api/training/:id | Admin |
| DELETE | /api/training/:id | Admin |

### Partners
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/partners | Public |
| POST | /api/partners | Admin |
| PUT | /api/partners/:id | Admin |
| DELETE | /api/partners/:id | Admin |

### Recognitions
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/recognitions | Public |
| POST | /api/recognitions | Admin |
| PUT | /api/recognitions/:id | Admin |
| DELETE | /api/recognitions/:id | Admin |

### Quotations
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/quotations/product | Private |
| POST | /api/quotations/cart | Private |
| POST | /api/quotations/service | Private |
| GET | /api/quotations | Admin |
| GET | /api/quotations/stats | Admin |
| PUT | /api/quotations/:id/status | Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/admin/dashboard | Admin |
| GET | /api/admin/users | Admin |

## Admin Auth Logic

Admin login checks `email` against `ADMIN_EMAIL` and `password` against `ADMIN_PASSWORD` from `.env`.
No admin record is stored in MongoDB. JWT with `role: "admin"` is issued on success.

## Cloudinary Folders
- `autoforge/products` — product images
- `autoforge/services` — service images  
- `autoforge/training` — training images
- `autoforge/partners` — partner logos
- `autoforge/recognitions` — recognition logos

## File Upload
All file uploads use `multipart/form-data`.
- Products: field name `images` (multiple)
- Services/Training: field name `image` (single)
- Partners/Recognitions: field name `logo` (single)
