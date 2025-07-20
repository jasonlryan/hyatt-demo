class StylingValidator {
  static validateGeneratedCode(code) {
    const issues = [];

    // Check for hardcoded Tailwind colors
    const hardcodedColors = code.match(
      /bg-(blue|green|gray|red|yellow|purple|pink|indigo|teal|orange|cyan|emerald|lime|amber|rose|violet|fuchsia|sky|slate|zinc|neutral|stone)-[0-9]+/g
    );
    if (hardcodedColors) {
      issues.push({
        type: "hardcoded_color",
        message: `Found hardcoded colors: ${hardcodedColors.join(", ")}`,
        severity: "error",
      });
    }

    // Check for hardcoded text colors
    const hardcodedTextColors = code.match(
      /text-(blue|green|gray|red|yellow|purple|pink|indigo|teal|orange|cyan|emerald|lime|amber|rose|violet|fuchsia|sky|slate|zinc|neutral|stone)-[0-9]+/g
    );
    if (hardcodedTextColors) {
      issues.push({
        type: "hardcoded_text_color",
        message: `Found hardcoded text colors: ${hardcodedTextColors.join(
          ", "
        )}`,
        severity: "error",
      });
    }

    // Check for design token usage
    const designTokens = code.match(
      /bg-primary|bg-secondary|bg-success|bg-error|text-text-primary|text-text-secondary|text-text-muted|border-border/g
    );
    if (!designTokens || designTokens.length < 3) {
      issues.push({
        type: "missing_design_tokens",
        message: "Generated code should use design tokens extensively",
        severity: "warning",
      });
    }

    return {
      isValid:
        issues.filter((issue) => issue.severity === "error").length === 0,
      issues,
    };
  }

  static suggestFixes(issues) {
    const fixes = [];

    issues.forEach((issue) => {
      if (issue.type === "hardcoded_color") {
        fixes.push({
          original: issue.message.match(/bg-[a-z]+-[0-9]+/g),
          suggestion:
            "Replace with appropriate design tokens (bg-primary, bg-secondary, bg-success, bg-error)",
        });
      }
      if (issue.type === "hardcoded_text_color") {
        fixes.push({
          original: issue.message.match(/text-[a-z]+-[0-9]+/g),
          suggestion:
            "Replace with appropriate design tokens (text-text-primary, text-text-secondary, text-text-muted, text-error)",
        });
      }
    });

    return fixes;
  }
}

module.exports = StylingValidator;
