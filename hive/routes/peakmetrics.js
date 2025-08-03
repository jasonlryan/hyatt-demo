const express = require("express");
const router = express.Router();
const { getInstance } = require("../services/PeakMetricsDataService");

// Middleware to check if PeakMetrics is enabled
const checkPeakMetricsEnabled = (req, res, next) => {
  if (process.env.ENABLE_PEAK_METRICS !== "true") {
    return res.status(503).json({
      error: {
        code: "FEATURE_DISABLED",
        message: "PeakMetrics feature is not enabled",
        timestamp: new Date().toISOString(),
      },
    });
  }
  next();
};

// Error handler middleware
const handleServiceError = (res, result) => {
  if (result.error) {
    const status = result.error.code === "PEAKMETRICS_ERROR" ? 500 : 400;
    return res.status(status).json({
      error: result.error,
      cached: result.cached,
      timestamp: result.timestamp,
    });
  }
  return false;
};

// Apply middleware to all routes
router.use(checkPeakMetricsEnabled);

/**
 * GET /api/peakmetrics/brands
 * Get all brands overview
 */
router.get("/brands", async (req, res) => {
  try {
    console.log(
      `🔍 PeakMetrics API called: GET /brands at ${new Date().toISOString()}`
    );
    const service = getInstance();
    const options = {
      sortBy: req.query.sortBy,
      filterByRisk: req.query.filterByRisk
        ? parseInt(req.query.filterByRisk)
        : undefined,
    };

    const result = await service.getAllBrandsOverview(options);

    if (handleServiceError(res, result)) return;

    res.json({
      data: result.data,
      cached: result.cached,
      timestamp: result.timestamp,
      count: result.data.length,
    });
  } catch (error) {
    console.error("API Error - GET /brands:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/peakmetrics/brands/:id
 * Get detailed information for a specific brand
 */
router.get("/brands/:id", async (req, res) => {
  try {
    const service = getInstance();
    const brandId = req.params.id;

    const result = await service.getBrandById(brandId);

    if (handleServiceError(res, result)) return;

    res.json({
      data: result.data,
      cached: result.cached,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error(`API Error - GET /brands/${req.params.id}:`, error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/peakmetrics/brands/:id/narratives
 * Get narratives for a specific brand
 */
router.get("/brands/:id/narratives", async (req, res) => {
  try {
    console.log(
      `🔍 PeakMetrics API called: GET /brands/${
        req.params.id
      }/narratives at ${new Date().toISOString()}`
    );
    const service = getInstance();
    const brandId = req.params.id;

    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      sort: req.query.sort || "relevancy",
      ...(req.query.since && { since: req.query.since }),
      ...(req.query.to && { to: req.query.to }),
      ...(req.query.sentimentMin && {
        sentimentMin: parseFloat(req.query.sentimentMin),
      }),
      ...(req.query.sentimentMax && {
        sentimentMax: parseFloat(req.query.sentimentMax),
      }),
    };

    const result = await service.getNarratives(brandId, options);

    if (handleServiceError(res, result)) return;

    res.json({
      data: result.data,
      cached: result.cached,
      timestamp: result.timestamp,
      count: result.data.length,
    });
  } catch (error) {
    console.error(
      `API Error - GET /brands/${req.params.id}/narratives:`,
      error
    );
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/peakmetrics/brands/:id/mentions
 * Get mentions for a specific brand
 */
router.get("/brands/:id/mentions", async (req, res) => {
  try {
    const service = getInstance();
    const brandId = req.params.id;

    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      sort: req.query.sort || "published",
      order: req.query.order || "desc",
      ...(req.query.since && { since: req.query.since }),
      ...(req.query.to && { to: req.query.to }),
      ...(req.query.channel && { channel: req.query.channel }),
    };

    const result = await service.getMentions(brandId, options);

    if (handleServiceError(res, result)) return;

    res.json({
      data: result.data,
      cached: result.cached,
      timestamp: result.timestamp,
      count: result.data.length,
    });
  } catch (error) {
    console.error(`API Error - GET /brands/${req.params.id}/mentions:`, error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/peakmetrics/brands/:id/trends
 * Get trend insights for a specific brand
 */
router.get("/brands/:id/trends", async (req, res) => {
  try {
    const service = getInstance();
    const brandId = req.params.id;

    const result = await service.getTrendInsights(brandId);

    if (handleServiceError(res, result)) return;

    res.json({
      data: result.data,
      cached: result.cached,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error(`API Error - GET /brands/${req.params.id}/trends:`, error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/peakmetrics/cache/stats
 * Get cache statistics (admin endpoint)
 */
router.get("/cache/stats", async (req, res) => {
  try {
    const service = getInstance();
    const stats = service.getCacheStats();

    res.json({
      data: stats,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("API Error - GET /cache/stats:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * POST /api/peakmetrics/cache/clear
 * Clear the cache (admin endpoint)
 */
router.post("/cache/clear", async (req, res) => {
  try {
    const service = getInstance();
    service.clearCache();

    res.json({
      message: "Cache cleared successfully",
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("API Error - POST /cache/clear:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/peakmetrics/health
 * Health check endpoint
 */
router.get("/health", async (req, res) => {
  try {
    const service = getInstance();
    const isAvailable = service.isAvailable();
    const stats = service.getCacheStats();

    res.json({
      status: isAvailable ? "healthy" : "degraded",
      service: {
        available: isAvailable,
        enabled: process.env.ENABLE_PEAK_METRICS === "true",
      },
      cache: {
        size: stats.size,
        hitRate: stats.hitRate,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("API Error - GET /health:", error);
    res.status(500).json({
      status: "error",
      error: {
        code: "HEALTH_CHECK_FAILED",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;
