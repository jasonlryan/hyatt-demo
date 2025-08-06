const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * PeakMetrics API Documentation Scraper
 * Scrapes the complete API documentation from docs.api.peakmetrics.com
 */
class PeakMetricsDocsScraper {
  constructor() {
    this.baseURL = "https://docs.api.peakmetrics.com";
    this.outputDir = path.join(__dirname, "..", "..", "docs", "scraped");
    this.documentation = {
      info: {},
      servers: [],
      paths: {},
      components: {},
      tags: [],
    };
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
   * Scrape the main documentation page
   */
  async scrapeMainPage() {
    try {
      console.log("🔍 Scraping main documentation page...");
      const response = await axios.get(this.baseURL);

      // Save the raw HTML for analysis
      const htmlPath = path.join(this.outputDir, "main_page.html");
      fs.writeFileSync(htmlPath, response.data);
      console.log(`✅ Saved main page HTML: ${htmlPath}`);

      // Extract OpenAPI spec if available
      await this.extractOpenAPISpec(response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Failed to scrape main page:", error.message);
      throw error;
    }
  }

  /**
   * Extract OpenAPI specification from HTML
   */
  async extractOpenAPISpec(html) {
    try {
      // Look for OpenAPI spec in script tags
      const openAPIPattern = /window\.__INITIAL_STATE__\s*=\s*({.*?});/s;
      const match = html.match(openAPIPattern);

      if (match) {
        const initialState = JSON.parse(match[1]);
        console.log("✅ Found initial state data");

        // Save the initial state
        const statePath = path.join(this.outputDir, "initial_state.json");
        fs.writeFileSync(statePath, JSON.stringify(initialState, null, 2));
        console.log(`✅ Saved initial state: ${statePath}`);

        // Extract API documentation from state
        await this.extractFromState(initialState);
      } else {
        console.log("⚠️ No initial state found, trying alternative methods...");
        await this.scrapeIndividualEndpoints();
      }
    } catch (error) {
      console.error("❌ Failed to extract OpenAPI spec:", error.message);
      await this.scrapeIndividualEndpoints();
    }
  }

  /**
   * Extract API documentation from initial state
   */
  async extractFromState(initialState) {
    try {
      // Look for API documentation in the state
      if (initialState.apiDocs || initialState.documentation) {
        const apiDocs = initialState.apiDocs || initialState.documentation;

        // Save the API docs
        const apiDocsPath = path.join(this.outputDir, "api_docs.json");
        fs.writeFileSync(apiDocsPath, JSON.stringify(apiDocs, null, 2));
        console.log(`✅ Saved API docs: ${apiDocsPath}`);

        // Convert to OpenAPI format
        await this.convertToOpenAPI(apiDocs);
      } else {
        console.log("⚠️ No API docs found in initial state");
        await this.scrapeIndividualEndpoints();
      }
    } catch (error) {
      console.error("❌ Failed to extract from state:", error.message);
      await this.scrapeIndividualEndpoints();
    }
  }

  /**
   * Scrape individual API endpoints
   */
  async scrapeIndividualEndpoints() {
    console.log("🔍 Scraping individual API endpoints...");

    const endpoints = [
      "/access/token",
      "/workspaces",
      "/workspaces/{workspaceId}/narratives",
      "/workspaces/{workspaceId}/mentions",
      "/alerts/alert",
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Scraping endpoint: ${endpoint}`);
        const response = await axios.get(`${this.baseURL}${endpoint}`);

        const endpointPath = path.join(
          this.outputDir,
          `${endpoint
            .replace(/\//g, "_")
            .replace(/{/g, "")
            .replace(/}/g, "")}.html`
        );
        fs.writeFileSync(endpointPath, response.data);
        console.log(`✅ Saved endpoint: ${endpointPath}`);

        // Extract documentation from endpoint page
        await this.extractEndpointDocs(endpoint, response.data);

        // Add delay to be respectful
        await this.delay(1000);
      } catch (error) {
        console.log(`⚠️ Failed to scrape ${endpoint}: ${error.message}`);
      }
    }
  }

  /**
   * Extract documentation from individual endpoint pages
   */
  async extractEndpointDocs(endpoint, html) {
    try {
      // Look for OpenAPI spec in the page
      const openAPIPattern = /"openapi":\s*"([^"]+)"/;
      const match = html.match(openAPIPattern);

      if (match) {
        console.log(`✅ Found OpenAPI spec for ${endpoint}`);

        // Extract the full OpenAPI spec
        const specPattern = /({[\s\S]*"openapi"[\s\S]*})/;
        const specMatch = html.match(specPattern);

        if (specMatch) {
          const spec = JSON.parse(specMatch[1]);
          const specPath = path.join(
            this.outputDir,
            `${endpoint
              .replace(/\//g, "_")
              .replace(/{/g, "")
              .replace(/}/g, "")}_spec.json`
          );
          fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
          console.log(`✅ Saved OpenAPI spec: ${specPath}`);
        }
      }
    } catch (error) {
      console.log(
        `⚠️ Failed to extract docs from ${endpoint}: ${error.message}`
      );
    }
  }

  /**
   * Convert scraped data to OpenAPI format
   */
  async convertToOpenAPI(apiDocs) {
    try {
      console.log("🔄 Converting to OpenAPI format...");

      const openAPISpec = {
        openapi: "3.1.0",
        info: {
          title: "PeakMetrics API",
          description:
            "Complete PeakMetrics API documentation scraped from official docs",
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

      // Save the OpenAPI spec
      const openAPIPath = path.join(
        this.outputDir,
        "peakmetrics_openapi_complete.yaml"
      );
      fs.writeFileSync(openAPIPath, JSON.stringify(openAPISpec, null, 2));
      console.log(`✅ Saved complete OpenAPI spec: ${openAPIPath}`);

      // Also save as YAML
      const yamlPath = path.join(
        this.outputDir,
        "peakmetrics_openapi_complete.yaml"
      );
      const yamlContent = this.jsonToYaml(openAPISpec);
      fs.writeFileSync(yamlPath, yamlContent);
      console.log(`✅ Saved complete OpenAPI spec (YAML): ${yamlPath}`);
    } catch (error) {
      console.error("❌ Failed to convert to OpenAPI:", error.message);
    }
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
   * Scrape all documentation sections
   */
  async scrapeAllSections() {
    console.log("🔍 Scraping all documentation sections...");

    const sections = [
      "/intro",
      "/authentication",
      "/workspaces",
      "/narratives",
      "/mentions",
      "/alerts",
      "/errors",
    ];

    for (const section of sections) {
      try {
        console.log(`📖 Scraping section: ${section}`);
        const response = await axios.get(`${this.baseURL}${section}`);

        const sectionPath = path.join(
          this.outputDir,
          `${section.replace(/\//g, "_")}.html`
        );
        fs.writeFileSync(sectionPath, response.data);
        console.log(`✅ Saved section: ${sectionPath}`);

        // Add delay to be respectful
        await this.delay(1000);
      } catch (error) {
        console.log(`⚠️ Failed to scrape section ${section}: ${error.message}`);
      }
    }
  }

  /**
   * Generate comprehensive documentation report
   */
  async generateReport() {
    console.log("📊 Generating documentation report...");

    const report = {
      timestamp: new Date().toISOString(),
      baseURL: this.baseURL,
      outputDirectory: this.outputDir,
      files: [],
      summary: {
        totalFiles: 0,
        totalSize: 0,
        endpoints: [],
        sections: [],
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

        if (file.includes("_spec.json")) {
          report.summary.endpoints.push(file);
        } else if (file.endsWith(".html")) {
          report.summary.sections.push(file);
        }
      }
    }

    // Save the report
    const reportPath = path.join(this.outputDir, "scraping_report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Saved scraping report: ${reportPath}`);

    return report;
  }

  /**
   * Utility function to add delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Main scraping function
   */
  async scrapeAll() {
    console.log("🚀 Starting PeakMetrics API documentation scraping...\n");

    try {
      // Ensure output directory exists
      this.ensureOutputDir();

      // Scrape main page
      await this.scrapeMainPage();

      // Scrape all sections
      await this.scrapeAllSections();

      // Generate report
      const report = await this.generateReport();

      console.log("\n🏁 Scraping completed!");
      console.log(`📊 Total files scraped: ${report.summary.totalFiles}`);
      console.log(`📁 Output directory: ${this.outputDir}`);
      console.log(
        `📄 Report saved: ${path.join(this.outputDir, "scraping_report.json")}`
      );

      return report;
    } catch (error) {
      console.error("💥 Scraping failed:", error.message);
      throw error;
    }
  }
}

// Export the scraper
module.exports = { PeakMetricsDocsScraper };

// Run the scraper if called directly
if (require.main === module) {
  const scraper = new PeakMetricsDocsScraper();
  scraper
    .scrapeAll()
    .then(() => {
      console.log("\n✅ Documentation scraping completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Documentation scraping failed:", error);
      process.exit(1);
    });
}
