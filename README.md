# Redline

## Summary

This is a platform to write blog posts locally. When finished, you can convert your blog posts into HTML files.

### Backend

The backend is built with Express and saves you posts into a folder `/posts`. The API docs can be found at `/server/README.md`. 

To start the backend:
```bash
cd server && npm install && npm run build:server && npm run start:server

```

### Frontend

The frontend is built with Vite, React, MDXEditor, and Tailwind CSS.

Start the frontend:
```bash
cd frontend && npm install && npm run dev
```

One feature of the frontend is the ability to statically render all blog posts. 

Build and run the renderer: 
```bash
npm run build:renderer && npm run render
```

This will output any blog posts as rendered HTML files in `/public`. To edit the logo, change the `Logo` component.  