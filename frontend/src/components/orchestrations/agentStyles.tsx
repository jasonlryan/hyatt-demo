import React from "react";
import {
  Briefcase,
  Search,
  Newspaper,
  Pen,
  Lightbulb,
  Settings,
  User,
  MessageSquare,
} from "lucide-react";

export interface AgentStyle {
  icon: JSX.Element;
  accent: string;
}

export const agentStyles: Record<string, AgentStyle> = {
  "PR Manager": {
    icon: <Briefcase size={18} className="text-blue-500" />,
    accent: "border-l-blue-500",
  },
  "Research & Audience GPT": {
    icon: <Search size={18} className="text-green-500" />,
    accent: "border-l-green-500",
  },
  "Research & Audience": {
    icon: <Search size={18} className="text-green-500" />,
    accent: "border-l-green-500",
  },
  "Trending News GPT": {
    icon: <Newspaper size={18} className="text-orange-500" />,
    accent: "border-l-orange-500",
  },
  "Story Angles & Headlines GPT": {
    icon: <Pen size={18} className="text-purple-500" />,
    accent: "border-l-purple-500",
  },
  "Strategic Insight GPT": {
    icon: <Lightbulb size={18} className="text-yellow-500" />,
    accent: "border-l-yellow-500",
  },
  User: {
    icon: <User size={18} className="text-slate-500" />,
    accent: "border-l-slate-500",
  },
  System: {
    icon: <Settings size={18} className="text-slate-400" />,
    accent: "border-l-slate-400",
  },
  "Campaign Brief": {
    icon: <User size={18} className="text-slate-600" />,
    accent: "border-l-slate-600",
  },
};

export const getAgentStyle = (speaker: string): AgentStyle => {
  return (
    agentStyles[speaker] || {
      icon: <MessageSquare size={18} className="text-slate-400" />,
      accent: "border-l-slate-400",
    }
  );
};

// Helper function for smaller icons (used in SidePanel)
export const getAgentStyleSmall = (speaker: string): AgentStyle => {
  const baseStyle = agentStyles[speaker];
  if (!baseStyle) {
    return {
      icon: <MessageSquare size={16} className="text-slate-400" />,
      accent: "border-l-slate-400",
    };
  }

  // Clone the icon with smaller size
  const smallIcon = React.cloneElement(baseStyle.icon, { size: 16 });
  return {
    icon: smallIcon,
    accent: baseStyle.accent,
  };
};
