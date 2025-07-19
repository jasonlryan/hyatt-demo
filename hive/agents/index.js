// Consolidated Agents Module
// This module exports all agent classes from the consolidated structure

const PRManagerAgent = require("./classes/PRManagerAgent");
const ResearchAudienceAgent = require("./classes/ResearchAudienceAgent");
const TrendingNewsAgent = require("./classes/TrendingNewsAgent");
const StoryAnglesAgent = require("./classes/StoryAnglesAgent");
const StrategicInsightAgent = require("./classes/StrategicInsightAgent");

module.exports = {
  PRManagerAgent,
  ResearchAudienceAgent,
  TrendingNewsAgent,
  StoryAnglesAgent,
  StrategicInsightAgent,
};
