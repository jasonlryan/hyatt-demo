import fs from "fs";
import path from "path";

export class FileGenerator {
  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.generatedDir = path.join(
      baseDir,
      "frontend/src/components/orchestrations/generated"
    );
  }

  async generateOrchestrationPage(orchestrationId, orchestrationName, pageCode) {
    await this.ensureDirectoryExists(this.generatedDir);

    const fileName = `${orchestrationId}.tsx`;
    const filePath = path.join(this.generatedDir, fileName);

    const fullPageCode = `// Auto-generated orchestration page for ${orchestrationName}
// Generated at: ${new Date().toISOString()}
// Do not edit manually - regenerate via Orchestration Builder

${pageCode}`;

    await fs.promises.writeFile(filePath, fullPageCode, "utf8");

    await this.updateIndexFile(orchestrationId, orchestrationName);

    return filePath;
  }

  async ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  async updateIndexFile(orchestrationId, orchestrationName) {
    const indexPath = path.join(this.generatedDir, "index.ts");

    let indexContent = "";
    if (fs.existsSync(indexPath)) {
      indexContent = await fs.promises.readFile(indexPath, "utf8");
    }

    const exportLine = `export { default as ${orchestrationId}Page } from './${orchestrationId}';`;

    if (!indexContent.includes(exportLine)) {
      indexContent += `\n${exportLine}`;
      await fs.promises.writeFile(indexPath, indexContent, "utf8");
    }
  }

  async cleanupOrchestrationPage(orchestrationId) {
    const filePath = path.join(this.generatedDir, `${orchestrationId}.tsx`);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
