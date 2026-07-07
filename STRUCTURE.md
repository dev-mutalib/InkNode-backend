# Project Structure

```
Blog-backend/
├── .env
├── .env.example
├── .gitignore
├── bun.lock
├── package.json
├── STRUCTURE.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   ├── cloudinary.js
    │   └── database.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── category.controller.js
    │   ├── comment.controller.js
    │   ├── post.controller.js
    │   ├── tag.controller.js
    │   └── user.controller.js
    ├── middleware/
    │   ├── admin.middleware.js
    │   ├── auth.middleware.js
    │   └── upload.middleware.js
    ├── models/
    │   ├── category.model.js
    │   ├── comment.model.js
    │   ├── post.model.js
    │   ├── tag.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── category.routes.js
    │   ├── comment.routes.js
    │   ├── post.routes.js
    │   ├── tag.routes.js
    │   └── user.routes.js
    ├── services/
    │   ├── auth.service.js
    │   ├── category.service.js
    │   ├── comment.service.js
    │   ├── post.service.js
    │   ├── tag.service.js
    │   └── user.service.js
    └── utils/
        ├── cloudinary.js
        ├── jwt.js
        ├── readingTime.js
        └── slug.js
```
