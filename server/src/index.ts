import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

app.post("/post/update", (req, res) => {
  const markdown = req.body.markdown;
  const firstHeadingMatch = markdown.match(/^(#+)\s+(.*)$/m);
  const heading = firstHeadingMatch ? firstHeadingMatch[2].replace(/[^a-zA-Z0-9]/g, '_') : 'untitled';
  const filePath = path.join(__dirname, "../posts", `${heading.toLowerCase()}.md`);
  
  fs.writeFile(filePath, markdown, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving file." });
    }
    res.json({ message: "Post updated." });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
