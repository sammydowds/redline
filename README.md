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

### Writing a Blog Post

1. Create a blog post by creating a markdown file in `/server/backend/posts/<post_name>.md`
2. Start the backend
3. Start the frontend
4. Visit the frontend (http://localhost:5173/) and click on the link to the blog post to open the editor
5. Add the following attributes to the frontmatter: `title`, `status`:`public`
5b. (Optional) To create an mp3 via AI of your blog post add `tts`:`true`
6. Write some text
7. Open a terminal, and run `npm run render` to output the blog post as HTML