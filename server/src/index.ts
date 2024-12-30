import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import matter from "front-matter";
import assert from "assert";
import 'dotenv/config'
import { title } from "process";
const multer = require('multer')


const POSTS_TARGET_URL = process.env.POSTS_TARGET_URL
assert(POSTS_TARGET_URL, "POSTS_TARGET_URL environment variable is missing, please provide.")

const app = express();
const PORT = process.env.PORT || 5000;
const storage = multer.diskStorage({
  destination: (req: Request, file: File, cb: any) => {
    cb(null, `${POSTS_TARGET_URL}/photos`); 
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors())

app.post("/post/update", (req, res) => {
  const markdown = req.body.markdown;
  const data = matter(markdown) as any;
  const heading = data?.attributes?.title ? data?.attributes.title.replace(/[^a-zA-Z0-9]/g, '_') : 'untitled';
  const filePath = path.join(__dirname, POSTS_TARGET_URL, `${heading.toLowerCase()}.md`);
  
  fs.writeFile(filePath, markdown, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving file." });
    }
    res.json({ message: "Post updated." });
  });
});

app.post('/photo/upload', upload.single('image'), (req, res) => {
  // @ts-ignore
  res.status(200).json({ message: 'File uploaded successfully!', url: req.file.filename});
});

app.get("/editor/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, POSTS_TARGET_URL, `${filename}.md`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({ message: "File not found." });
    }
    
    const parsedData = matter(data); 
    res.json({ data: { ...parsedData, raw: data }}); 
  });
});

app.get("/posts", async (req, res) => {
  try {
    const postsDirectory = path.join(__dirname, POSTS_TARGET_URL);
    const files = await fs.promises.readdir(postsDirectory);

    const availablePosts = await Promise.all(
      files
        .filter((fileName) => fileName.endsWith(".md"))
        .map(async (fileName) => {
          const filePath = path.join(postsDirectory, fileName);
          const data = await fs.promises.readFile(filePath, "utf8");
          const parsedData = matter(data);
          return { ...parsedData, fileName: fileName.split(".")[0] };
        })
    );

    res.json({ posts: availablePosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while processing posts." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
