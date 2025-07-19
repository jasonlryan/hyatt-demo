export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id)
      return res.status(400).json({ message: "Missing orchestration id" });

    const fs = require("fs");
    const path = require("path");

    // Documentation path mapping
    const documentationPaths = {
      hyatt: "docs/orchestrations/HyattOrchestrator.md",
      builder: "docs/orchestrations/OrchestrationBuilder.md",
      template: "docs/orchestrations/TemplateOrchestrator.md",
      hive: "docs/orchestrations/HiveOrchestrator.md",
    };

    const docPath = path.join(
      process.cwd(),
      documentationPaths[id] || `docs/orchestrations/${id}.md`
    );

    if (!fs.existsSync(docPath)) {
      return res.status(404).json({ message: "Documentation not found" });
    }

    const markdown = fs.readFileSync(docPath, "utf8");
    res.status(200).json({
      markdown,
      metadata: {
        orchestrationId: id,
        lastModified: fs.statSync(docPath).mtime.toISOString(),
      },
    });
  } catch (error) {
    console.error("Documentation loading failed:", error);
    res.status(500).json({ message: "Failed to load documentation" });
  }
}
