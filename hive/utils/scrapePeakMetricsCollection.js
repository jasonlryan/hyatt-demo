const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * PeakMetrics API Collection Scraper
 * Scrapes the complete API collection from Postman's API
 */
class PeakMetricsCollectionScraper {
  constructor() {
    this.collectionId = "e5841b1f-9419-4cc7-9842-a82341c6a2b8";
    this.publishedId = "TW6wJodn";
    this.ownerId = "4839979";
    this.outputDir = path.join(__dirname, "..", "..", "docs", "scraped");
  }

  /**
   * Create output directory if it doesn't exist
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDir}`);
    }
  }

  /**
   * Scrape the collection metadata
   */
  async scrapeCollectionMetadata() {
    try {
      console.log("🔍 Scraping collection metadata...");
      const url = `https://docs.api.peakmetrics.com/view/metadata/${this.publishedId}`;
      const response = await axios.get(url);

      const metadataPath = path.join(
        this.outputDir,
        "collection_metadata.json"
      );
      fs.writeFileSync(metadataPath, JSON.stringify(response.data, null, 2));
      console.log(`✅ Saved collection metadata: ${metadataPath}`);

      return response.data;
    } catch (error) {
      console.error("❌ Failed to scrape collection metadata:", error.message);
      throw error;
    }
  }

  /**
   * Scrape the full collection data
   */
  async scrapeCollectionData() {
    try {
      console.log("🔍 Scraping full collection data...");
      const url = `https://docs.api.peakmetrics.com/api/collections/${this.ownerId}/${this.publishedId}?segregateAuth=true&versionTag=latest`;
      const response = await axios.get(url);

      const collectionPath = path.join(this.outputDir, "collection_data.json");
      fs.writeFileSync(collectionPath, JSON.stringify(response.data, null, 2));
      console.log(`✅ Saved collection data: ${collectionPath}`);

      return response.data;
    } catch (error) {
      console.error("❌ Failed to scrape collection data:", error.message);
      throw error;
    }
  }

  /**
   * Convert Postman collection to OpenAPI format
   */
  async convertToOpenAPI(collectionData) {
    try {
      console.log("🔄 Converting Postman collection to OpenAPI format...");

      const openAPISpec = {
        openapi: "3.1.0",
        info: {
          title: collectionData.info?.name || "PeakMetrics API",
          description:
            collectionData.info?.description ||
            "Complete PeakMetrics API documentation",
          version: "2.0.0",
        },
        servers: [
          {
            url: "https://api.peakmetrics.com",
            description: "Main API server",
          },
          {
            url: "https://flux.peakm.com",
            description: "Alerting API server",
          },
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        paths: {},
        tags: [],
      };

      // Process collection items
      if (collectionData.item) {
        await this.processCollectionItems(collectionData.item, openAPISpec);
      }

      // Save the OpenAPI spec
      const openAPIPath = path.join(
        this.outputDir,
        "peakmetrics_openapi_from_collection.json"
      );
      fs.writeFileSync(openAPIPath, JSON.stringify(openAPISpec, null, 2));
      console.log(`✅ Saved OpenAPI spec: ${openAPIPath}`);

      // Also save as YAML
      const yamlPath = path.join(
        this.outputDir,
        "peakmetrics_openapi_from_collection.yaml"
      );
      const yamlContent = this.jsonToYaml(openAPISpec);
      fs.writeFileSync(yamlPath, yamlContent);
      console.log(`✅ Saved OpenAPI spec (YAML): ${yamlPath}`);

      return openAPISpec;
    } catch (error) {
      console.error("❌ Failed to convert to OpenAPI:", error.message);
      throw error;
    }
  }

  /**
   * Process collection items recursively
   */
  async processCollectionItems(items, openAPISpec) {
    for (const item of items) {
      if (item.item) {
        // This is a folder, process recursively
        await this.processCollectionItems(item.item, openAPISpec);
      } else if (item.request) {
        // This is a request, convert to OpenAPI path
        await this.convertRequestToPath(item, openAPISpec);
      }
    }
  }

  /**
   * Convert a Postman request to OpenAPI path
   */
  async convertRequestToPath(item, openAPISpec) {
    try {
      const request = item.request;
      const method = request.method?.toLowerCase();
      const url = request.url;

      if (!method || !url) {
        console.log(`⚠️ Skipping item without method or URL: ${item.name}`);
        return;
      }

      // Extract path from URL
      let path = url.raw || url;
      if (typeof path === "string") {
        // Remove base URL if present
        path = path.replace("https://api.peakmetrics.com", "");
        path = path.replace("https://flux.peakm.com", "");

        // Extract path parameters
        const pathParams = this.extractPathParams(path);
        path = this.normalizePath(path);
      } else {
        path = "/";
      }

      // Initialize path if it doesn't exist
      if (!openAPISpec.paths[path]) {
        openAPISpec.paths[path] = {};
      }

      // Create the operation
      const operation = {
        tags: [item.name || "Default"],
        summary: item.name || `${method.toUpperCase()} ${path}`,
        description: item.description || "",
        parameters: [],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          },
        },
      };

      // Add parameters
      if (request.header) {
        for (const header of request.header) {
          if (header.key && header.key.toLowerCase() !== "authorization") {
            operation.parameters.push({
              name: header.key,
              in: "header",
              required: header.disabled !== true,
              schema: {
                type: "string",
              },
              description: header.description || "",
            });
          }
        }
      }

      if (request.url?.query) {
        for (const query of request.url.query) {
          operation.parameters.push({
            name: query.key,
            in: "query",
            required: query.disabled !== true,
            schema: {
              type: "string",
            },
            description: query.description || "",
          });
        }
      }

      // Add request body if present
      if (request.body && request.body.mode === "raw") {
        operation.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
              example: request.body.raw,
            },
          },
        };
      }

      // Add the operation to the path
      openAPISpec.paths[path][method] = operation;

      console.log(`✅ Converted: ${method.toUpperCase()} ${path}`);
    } catch (error) {
      console.error(
        `❌ Failed to convert request ${item.name}:`,
        error.message
      );
    }
  }

  /**
   * Extract path parameters from URL
   */
  extractPathParams(path) {
    const params = [];
    const matches = path.match(/\{([^}]+)\}/g);
    if (matches) {
      for (const match of matches) {
        const paramName = match.slice(1, -1);
        params.push(paramName);
      }
    }
    return params;
  }

  /**
   * Normalize path for OpenAPI
   */
  normalizePath(path) {
    // Ensure path starts with /
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    // Remove query parameters
    path = path.split("?")[0];

    return path;
  }

  /**
   * Convert JSON to YAML (simple implementation)
   */
  jsonToYaml(obj, indent = 0) {
    const spaces = "  ".repeat(indent);
    let yaml = "";

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          yaml +=
            spaces + "- " + this.jsonToYaml(item, indent + 1).trim() + "\n";
        } else {
          yaml += spaces + "- " + item + "\n";
        }
      });
    } else if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          yaml += spaces + key + ":\n" + this.jsonToYaml(value, indent + 1);
        } else {
          yaml += spaces + key + ": " + value + "\n";
        }
      });
    }

    return yaml;
  }

  /**
   * Generate comprehensive documentation report
   */
  async generateReport() {
    console.log("📊 Generating documentation report...");

    const report = {
      timestamp: new Date().toISOString(),
      collectionId: this.collectionId,
      publishedId: this.publishedId,
      ownerId: this.ownerId,
      outputDirectory: this.outputDir,
      files: [],
      summary: {
        totalFiles: 0,
        totalSize: 0,
        endpoints: [],
        folders: [],
      },
    };

    // Scan output directory
    if (fs.existsSync(this.outputDir)) {
      const files = fs.readdirSync(this.outputDir);

      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = fs.statSync(filePath);

        report.files.push({
          name: file,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        });

        report.summary.totalFiles++;
        report.summary.totalSize += stats.size;

        if (file.includes("openapi")) {
          report.summary.endpoints.push(file);
        } else if (file.includes("collection")) {
          report.summary.folders.push(file);
        }
      }
    }

    // Save the report
    const reportPath = path.join(
      this.outputDir,
      "collection_scraping_report.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Saved collection scraping report: ${reportPath}`);

    return report;
  }

  /**
   * Main scraping function
   */
  async scrapeAll() {
    console.log("🚀 Starting PeakMetrics API collection scraping...\n");

    try {
      // Ensure output directory exists
      this.ensureOutputDir();

      // Scrape collection metadata
      const metadata = await this.scrapeCollectionMetadata();

      // Scrape full collection data
      const collectionData = await this.scrapeCollectionData();

      // Convert to OpenAPI format
      const openAPISpec = await this.convertToOpenAPI(collectionData);

      // Generate report
      const report = await this.generateReport();

      console.log("\n🏁 Collection scraping completed!");
      console.log(`📊 Total files scraped: ${report.summary.totalFiles}`);
      console.log(`📁 Output directory: ${this.outputDir}`);
      console.log(
        `📄 Report saved: ${path.join(
          this.outputDir,
          "collection_scraping_report.json"
        )}`
      );

      return {
        metadata,
        collectionData,
        openAPISpec,
        report,
      };
    } catch (error) {
      console.error("💥 Collection scraping failed:", error.message);
      throw error;
    }
  }
}

// Export the scraper
module.exports = { PeakMetricsCollectionScraper };

// Run the scraper if called directly
if (require.main === module) {
  const scraper = new PeakMetricsCollectionScraper();
  scraper
    .scrapeAll()
    .then(() => {
      console.log("\n✅ Collection scraping completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Collection scraping failed:", error);
      process.exit(1);
    });
}
