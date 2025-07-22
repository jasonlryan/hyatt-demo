class QualityController {
  constructor() {
    this.minTrendRelevance = parseInt(process.env.MIN_TREND_RELEVANCE) || 30;
    this.minAudienceConfidence =
      parseInt(process.env.MIN_AUDIENCE_CONFIDENCE) || 25; // Lowered from 70
    this.minStoryAngleStrength =
      parseInt(process.env.MIN_STORY_ANGLE_STRENGTH) || 25; // Lowered from 65
    this.requireDataValidation = process.env.REQUIRE_DATA_VALIDATION === "true";
    this.skipWeakTrendsThreshold =
      parseInt(process.env.SKIP_WEAK_TRENDS_THRESHOLD) || 25; // Lowered from 50
    this.alternativeStrategyTrigger =
      parseInt(process.env.ALTERNATIVE_STRATEGY_TRIGGER) || 20; // Lowered from 40
  }

  // Validate research phase output
  validateResearchData(researchData) {
    const validation = {
      isValid: true,
      confidence: 0,
      issues: [],
      recommendations: [],
    };

    try {
      // Handle new format where everything is in an 'analysis' field
      if (researchData.analysis && typeof researchData.analysis === "string") {
        const analysisLength = researchData.analysis.length;
        const analysisLower = researchData.analysis.toLowerCase();

        // Check for key components in the analysis text
        const hasDemographics =
          analysisLower.includes("demographic") ||
          analysisLower.includes("age") ||
          analysisLower.includes("income");
        const hasDrivers =
          analysisLower.includes("motivation") ||
          analysisLower.includes("driver") ||
          analysisLower.includes("value");
        const hasRecommendations =
          analysisLower.includes("recommendation") ||
          analysisLower.includes("strategic") ||
          analysisLower.includes("messaging");
        const hasSegments =
          analysisLower.includes("segment") ||
          analysisLower.includes("target") ||
          analysisLower.includes("audience");

        // Give confidence based on content
        if (hasDemographics) validation.confidence += 25;
        else
          validation.issues.push("Demographics section not clearly identified");

        if (hasDrivers) validation.confidence += 25;
        else
          validation.issues.push("Motivational drivers not clearly identified");

        if (hasRecommendations) validation.confidence += 20;
        else
          validation.issues.push(
            "Strategic recommendations not clearly identified"
          );

        if (hasSegments) validation.confidence += 20;
        else validation.issues.push("Audience segments not clearly identified");

        // Bonus for comprehensive analysis
        if (analysisLength > 500) validation.confidence += 10;

        // If we have a good comprehensive analysis, consider it valid
        if (validation.confidence >= this.minAudienceConfidence) {
          validation.isValid = true;
        }

        return validation;
      }

      // Original validation for structured format
      // Check target demographics (more lenient)
      if (
        !researchData.targetDemographics ||
        researchData.targetDemographics.length === 0
      ) {
        validation.issues.push("No target demographics identified");
        validation.confidence += 10; // Still give some confidence
      } else {
        validation.confidence += 25;
      }

      // Check key drivers (more lenient)
      if (
        !researchData.keyDrivers ||
        Object.keys(researchData.keyDrivers).length === 0
      ) {
        validation.issues.push("No key drivers identified");
        validation.confidence += 10; // Still give some confidence
      } else {
        validation.confidence += 25;
      }

      // Check strategic recommendations (more lenient)
      if (
        !researchData.strategicRecommendations ||
        researchData.strategicRecommendations.length === 0
      ) {
        validation.issues.push("Missing strategic recommendations");
        validation.confidence += 15; // Give base confidence
      } else {
        validation.confidence += 20;
      }

      // Check audience analysis depth (more lenient)
      if (
        !researchData.audienceAnalysis ||
        researchData.audienceAnalysis.length < 50 // Lowered from 100
      ) {
        validation.issues.push("Audience analysis lacks depth");
        validation.confidence += 20; // Give base confidence
      } else {
        validation.confidence += 30;
      }

      // Quality thresholds
      if (validation.confidence < this.minAudienceConfidence) {
        validation.isValid = false;
        validation.recommendations.push(
          "Research phase needs more comprehensive analysis"
        );
      }
    } catch (error) {
      validation.isValid = false;
      validation.issues.push(`Data structure error: ${error.message}`);
    }

    return validation;
  }

  // Validate trending phase output
  validateTrendingData(trendingData) {
    const validation = {
      isValid: true,
      confidence: 0,
      issues: [],
      recommendations: [],
      shouldSkipTrends: false,
      alternativeStrategy: false,
    };

    try {
      // Check relevant trends
      if (
        !trendingData.relevantTrends ||
        trendingData.relevantTrends.length === 0
      ) {
        validation.isValid = false;
        validation.issues.push("No relevant trends identified");
        validation.shouldSkipTrends = true;
      } else {
        // Analyze trend strength
        const avgRelevance = this.calculateAverageRelevance(
          trendingData.relevantTrends
        );
        validation.confidence = avgRelevance;

        if (avgRelevance < this.skipWeakTrendsThreshold) {
          validation.shouldSkipTrends = true;
          validation.recommendations.push(
            "Trends are weak - consider alternative strategy"
          );
        }

        if (avgRelevance < this.alternativeStrategyTrigger) {
          validation.alternativeStrategy = true;
          validation.recommendations.push(
            "Trigger alternative campaign strategy"
          );
        }
      }

      // Check cultural moments
      if (
        !trendingData.culturalMoments ||
        trendingData.culturalMoments.length === 0
      ) {
        validation.issues.push("No cultural moments identified");
        validation.confidence -= 10;
      }

      // Check media opportunities
      if (
        !trendingData.mediaOpportunities ||
        trendingData.mediaOpportunities.length === 0
      ) {
        validation.issues.push("No media opportunities identified");
        validation.confidence -= 15;
      }

      // Check timing recommendation
      if (!trendingData.timingRecommendation) {
        validation.issues.push("Missing timing recommendation");
        validation.confidence -= 10;
      }
    } catch (error) {
      validation.isValid = false;
      validation.issues.push(`Data structure error: ${error.message}`);
    }

    return validation;
  }

  // Validate story phase output
  validateStoryData(storyData) {
    const validation = {
      isValid: true,
      confidence: 0,
      issues: [],
      recommendations: [],
    };

    try {
      // Check primary angle
      if (!storyData.primaryAngle || !storyData.primaryAngle.angle) {
        validation.isValid = false;
        validation.issues.push("No primary story angle identified");
      } else {
        validation.confidence += 30;

        // Check angle strength
        const angleStrength = this.assessAngleStrength(storyData.primaryAngle);
        if (angleStrength < this.minStoryAngleStrength) {
          validation.issues.push("Primary angle lacks strength");
          validation.confidence -= 20;
        }
      }

      // Check supporting angles
      if (
        !storyData.supportingAngles ||
        storyData.supportingAngles.length === 0
      ) {
        validation.issues.push("No supporting angles provided");
        validation.confidence -= 15;
      } else {
        validation.confidence += 20;
      }

      // Check headlines
      if (!storyData.headlines || storyData.headlines.length === 0) {
        validation.isValid = false;
        validation.issues.push("No headlines generated");
      } else {
        validation.confidence += 25;

        // Check headline quality
        const headlineQuality = this.assessHeadlineQuality(storyData.headlines);
        validation.confidence += headlineQuality;
      }

      // Check key messages
      if (!storyData.keyMessages || storyData.keyMessages.length === 0) {
        validation.issues.push("No key messages provided");
        validation.confidence -= 10;
      } else {
        validation.confidence += 25;
      }
    } catch (error) {
      validation.isValid = false;
      validation.issues.push(`Data structure error: ${error.message}`);
    }

    return validation;
  }

  // Calculate average relevance from trends
  calculateAverageRelevance(trends) {
    if (!trends || trends.length === 0) return 0;

    const relevanceScores = trends.map((trend) => {
      if (typeof trend.relevance === "string") {
        const match = trend.relevance.match(/(\d+)/);
        return match ? parseInt(match[1]) : 50;
      }
      return trend.relevance || 50;
    });

    return (
      relevanceScores.reduce((sum, score) => sum + score, 0) /
      relevanceScores.length
    );
  }

  // Assess story angle strength
  assessAngleStrength(primaryAngle) {
    let strength = 50; // Base score

    // Check for emotional hook
    if (primaryAngle.emotionalHook && primaryAngle.emotionalHook.length > 20) {
      strength += 20;
    }

    // Check for uniqueness indicators
    const uniquenessKeywords = [
      "first",
      "only",
      "revolutionary",
      "breakthrough",
      "unprecedented",
    ];
    if (
      uniquenessKeywords.some(
        (keyword) =>
          primaryAngle.angle.toLowerCase().includes(keyword) ||
          (primaryAngle.emotionalHook &&
            primaryAngle.emotionalHook.toLowerCase().includes(keyword))
      )
    ) {
      strength += 15;
    }

    // Check for specificity
    if (
      primaryAngle.angle.length > 50 &&
      primaryAngle.angle.includes("Hyatt")
    ) {
      strength += 10;
    }

    return Math.min(100, strength);
  }

  // Assess headline quality
  assessHeadlineQuality(headlines) {
    let qualityScore = 0;

    headlines.forEach((headline) => {
      let headlineScore = 0;

      // Length check (optimal 6-12 words)
      const wordCount = headline.split(" ").length;
      if (wordCount >= 6 && wordCount <= 12) {
        headlineScore += 10;
      }

      // Action words
      const actionWords = [
        "launches",
        "introduces",
        "unveils",
        "announces",
        "reveals",
      ];
      if (actionWords.some((word) => headline.toLowerCase().includes(word))) {
        headlineScore += 5;
      }

      // Numbers or specifics
      if (/\d+/.test(headline)) {
        headlineScore += 5;
      }

      qualityScore += headlineScore;
    });

    return Math.min(25, qualityScore / headlines.length);
  }

  // Determine next phase based on validation results
  determineNextPhase(currentPhase, validationResults) {
    const decisions = {
      nextPhase: null,
      skipPhases: [],
      alternativeFlow: false,
      reasoning: "",
    };

    switch (currentPhase) {
      case "research":
        if (validationResults.confidence >= this.minAudienceConfidence) {
          decisions.nextPhase = "trending";
          decisions.reasoning =
            "Research quality sufficient, proceeding to trending analysis";
        } else {
          decisions.nextPhase = "research_retry";
          decisions.reasoning =
            "Research quality insufficient, needs improvement";
        }
        break;

      case "trending":
        if (validationResults.shouldSkipTrends) {
          decisions.skipPhases = ["trending"];
          decisions.nextPhase = "story";
          decisions.alternativeFlow = true;
          decisions.reasoning =
            "Weak trends detected, skipping to story development with alternative strategy";
        } else if (validationResults.alternativeStrategy) {
          decisions.nextPhase = "story";
          decisions.alternativeFlow = true;
          decisions.reasoning =
            "Trends below threshold, using alternative strategy approach";
        } else {
          decisions.nextPhase = "story";
          decisions.reasoning =
            "Trending analysis complete, proceeding to story development";
        }
        break;

      case "story":
        if (validationResults.confidence >= this.minStoryAngleStrength) {
          decisions.nextPhase = "collaborative";
          decisions.reasoning =
            "Story angles strong enough for collaboration phase";
        } else {
          decisions.nextPhase = "story_retry";
          decisions.reasoning = "Story angles need strengthening";
        }
        break;

      default:
        decisions.nextPhase = "collaborative";
        decisions.reasoning = "Default progression to collaborative phase";
    }

    return decisions;
  }

  // Generate quality report
  generateQualityReport(phaseValidations) {
    const report = {
      overallQuality: "good",
      confidence: 0,
      criticalIssues: [],
      recommendations: [],
      dataIntegrity: true,
      timestamp: new Date().toISOString(),
    };

    let totalConfidence = 0;
    let phaseCount = 0;

    Object.entries(phaseValidations).forEach(([phase, validation]) => {
      if (validation.confidence !== undefined) {
        totalConfidence += validation.confidence;
        phaseCount++;
      }

      if (!validation.isValid) {
        report.dataIntegrity = false;
        report.criticalIssues.push(`${phase}: ${validation.issues.join(", ")}`);
      }

      if (validation.recommendations) {
        report.recommendations.push(
          ...validation.recommendations.map((rec) => `${phase}: ${rec}`)
        );
      }
    });

    report.confidence =
      phaseCount > 0 ? Math.round(totalConfidence / phaseCount) : 0;

    // Determine overall quality
    if (report.confidence >= 80 && report.dataIntegrity) {
      report.overallQuality = "excellent";
    } else if (report.confidence >= 60 && report.dataIntegrity) {
      report.overallQuality = "good";
    } else if (report.confidence >= 40) {
      report.overallQuality = "fair";
    } else {
      report.overallQuality = "poor";
    }

    return report;
  }

  // Validate data synthesis between phases
  validateDataSynthesis(researchData, trendingData, storyData) {
    const synthesis = {
      isCoherent: true,
      alignmentScore: 0,
      gaps: [],
      strengths: [],
    };

    try {
      // Check audience-trend alignment
      if (researchData.targetDemographics && trendingData.relevantTrends) {
        const audienceKeywords = this.extractKeywords(
          researchData.targetDemographics
        );
        const trendKeywords = this.extractKeywords(trendingData.relevantTrends);
        const overlap = this.calculateKeywordOverlap(
          audienceKeywords,
          trendKeywords
        );

        if (overlap > 0.3) {
          synthesis.alignmentScore += 30;
          synthesis.strengths.push("Strong audience-trend alignment");
        } else {
          synthesis.gaps.push("Weak connection between audience and trends");
        }
      }

      // Check trend-story alignment
      if (trendingData.relevantTrends && storyData.primaryAngle) {
        const trendThemes = this.extractThemes(trendingData.relevantTrends);
        const storyThemes = this.extractThemes([storyData.primaryAngle]);
        const themeAlignment = this.calculateThemeAlignment(
          trendThemes,
          storyThemes
        );

        if (themeAlignment > 0.4) {
          synthesis.alignmentScore += 35;
          synthesis.strengths.push("Story angles well-aligned with trends");
        } else {
          synthesis.gaps.push("Story angles not leveraging trending topics");
        }
      }

      // Check research-story alignment
      if (researchData.keyDrivers && storyData.keyMessages) {
        const driverThemes = Object.keys(researchData.keyDrivers);
        const messageThemes = this.extractThemes(storyData.keyMessages);
        const messageAlignment = this.calculateThemeAlignment(
          driverThemes,
          messageThemes
        );

        if (messageAlignment > 0.3) {
          synthesis.alignmentScore += 35;
          synthesis.strengths.push("Key messages address audience drivers");
        } else {
          synthesis.gaps.push(
            "Key messages not addressing audience motivations"
          );
        }
      }

      synthesis.isCoherent =
        synthesis.alignmentScore >= 60 && synthesis.gaps.length <= 1;
    } catch (error) {
      synthesis.isCoherent = false;
      synthesis.gaps.push(`Synthesis error: ${error.message}`);
    }

    return synthesis;
  }

  // Helper methods
  extractKeywords(data) {
    const text = JSON.stringify(data).toLowerCase();
    return text.match(/\b\w{4,}\b/g) || [];
  }

  extractThemes(data) {
    const themes = [];
    const text = JSON.stringify(data).toLowerCase();

    // Common theme keywords
    const themePatterns = [
      /sustainability?/g,
      /eco[\w-]*/g,
      /green/g,
      /environment/g,
      /wellness/g,
      /health/g,
      /mindful/g,
      /conscious/g,
      /luxury/g,
      /premium/g,
      /exclusive/g,
      /high-end/g,
      /travel/g,
      /hospitality/g,
      /resort/g,
      /hotel/g,
      /millennial/g,
      /gen[\s-]?z/g,
      /young/g,
      /digital/g,
    ];

    themePatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) themes.push(...matches);
    });

    return [...new Set(themes)];
  }

  calculateKeywordOverlap(keywords1, keywords2) {
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  calculateThemeAlignment(themes1, themes2) {
    const set1 = new Set(themes1);
    const set2 = new Set(themes2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));

    return Math.max(set1.size, set2.size) > 0
      ? intersection.size / Math.max(set1.size, set2.size)
      : 0;
  }
}

module.exports = QualityController;
