import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/post/new", (req, res) => {
  const markdown = req.body.markdown;
  const filePath = path.join(__dirname, "posts", `post-${Date.now()}.md`);

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
