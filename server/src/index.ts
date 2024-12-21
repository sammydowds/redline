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
  const date = new Date();
  const filePath = path.join(__dirname, "../posts", `post-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.md`);
  
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
