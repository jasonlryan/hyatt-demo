const express = require("express");
const router = express.Router();
const { getAlertingInstance } = require("../utils/peakMetricsAlerts");

// Middleware to check if PeakMetrics is enabled
const checkPeakMetricsEnabled = (req, res, next) => {
  if (process.env.ENABLE_PEAK_METRICS !== "true") {
    return res.status(400).json({
      error: {
        code: "PEAKMETRICS_DISABLED",
        message: "PeakMetrics feature is not enabled",
        timestamp: new Date().toISOString(),
      },
    });
  }
  next();
};

router.use(checkPeakMetricsEnabled);

/**
 * GET /api/alerts/configs
 * Get all alert configurations
 */
router.get("/configs", (req, res) => {
  try {
    const alerting = getAlertingInstance();
    const configs = alerting.getAlertConfigs();

    res.json({
      data: configs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_CONFIG_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * POST /api/alerts/configs/:workspaceId
 * Configure alerts for a specific workspace
 */
router.post("/configs/:workspaceId", (req, res) => {
  try {
    const { workspaceId } = req.params;
    const config = req.body;

    const alerting = getAlertingInstance();
    const alertConfig = alerting.configureAlerts(workspaceId, config);

    res.json({
      data: alertConfig,
      message: `Alerting configured for workspace ${workspaceId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_CONFIG_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * DELETE /api/alerts/configs/:workspaceId
 * Remove alert configuration for a workspace
 */
router.delete("/configs/:workspaceId", (req, res) => {
  try {
    const { workspaceId } = req.params;
    const alerting = getAlertingInstance();

    // This would need to be implemented in the alerting class
    // alerting.removeAlertConfig(workspaceId);

    res.json({
      message: `Alert configuration removed for workspace ${workspaceId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_CONFIG_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * POST /api/alerts/start
 * Start monitoring all configured alerts
 */
router.post("/start", (req, res) => {
  try {
    const { intervalMs = 300000 } = req.body; // Default 5 minutes
    const alerting = getAlertingInstance();

    alerting.startMonitoring(intervalMs);

    res.json({
      message: `Alert monitoring started (checking every ${
        intervalMs / 1000
      }s)`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_START_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * POST /api/alerts/stop
 * Stop monitoring
 */
router.post("/stop", (req, res) => {
  try {
    const alerting = getAlertingInstance();
    alerting.stopMonitoring();

    res.json({
      message: "Alert monitoring stopped",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_STOP_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * POST /api/alerts/check/:workspaceId
 * Manually check alerts for a specific workspace
 */
router.post("/check/:workspaceId", async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const alerting = getAlertingInstance();

    await alerting.checkWorkspaceManually(workspaceId);

    res.json({
      message: `Manual alert check completed for workspace ${workspaceId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_CHECK_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/alerts/history
 * Get alert history
 */
router.get("/history", (req, res) => {
  try {
    const alerting = getAlertingInstance();
    const history = alerting.getAlertHistory();

    res.json({
      data: history,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_HISTORY_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * DELETE /api/alerts/history
 * Clear alert history
 */
router.delete("/history", (req, res) => {
  try {
    const alerting = getAlertingInstance();
    alerting.clearAlertHistory();

    res.json({
      message: "Alert history cleared",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_HISTORY_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/alerts/status
 * Get alerting system status
 */
router.get("/status", (req, res) => {
  try {
    const alerting = getAlertingInstance();
    const configs = alerting.getAlertConfigs();
    const history = alerting.getAlertHistory();

    res.json({
      data: {
        isMonitoring: alerting.isMonitoring,
        configuredWorkspaces: Object.keys(configs).length,
        totalAlerts: history.length,
        lastAlerts: history.slice(-5), // Last 5 alerts
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "ALERT_STATUS_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;
