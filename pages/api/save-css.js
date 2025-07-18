import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { css } = req.body;

    if (!css) {
      return res.status(400).json({ message: "CSS content is required" });
    }

    // Path to the CSS file
    const cssPath = path.join(process.cwd(), "frontend", "src", "index.css");

    // Write the CSS to the file
    fs.writeFileSync(cssPath, css, "utf8");

    res.status(200).json({ message: "CSS saved successfully" });
  } catch (error) {
    console.error("Error saving CSS:", error);
    res.status(500).json({ message: "Failed to save CSS" });
  }
}
