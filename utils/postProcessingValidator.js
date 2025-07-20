class PostProcessingValidator {
  static async validateAndFixGeneratedCode(generatedCode, type) {
    const issues = [];
    let fixedCode = generatedCode;

    if (type === "page") {
      const templateValidation = this.validateTemplateIntegration(generatedCode);
      if (!templateValidation.isValid) {
        fixedCode = this.fixTemplateIntegration(fixedCode);
        issues.push(...templateValidation.issues);
      }
    }

    const importValidation = this.validateImports(generatedCode);
    if (!importValidation.isValid) {
      fixedCode = this.fixImports(fixedCode);
      issues.push(...importValidation.issues);
    }

    const tsValidation = this.validateTypeScriptInterfaces(generatedCode);
    if (!tsValidation.isValid) {
      fixedCode = this.fixTypeScriptInterfaces(fixedCode);
      issues.push(...tsValidation.issues);
    }

    const StylingValidator = require("./stylingValidator");
    const stylingValidation = StylingValidator.validateGeneratedCode(fixedCode);
    if (!stylingValidation.isValid) {
      fixedCode = this.fixStylingIssues(fixedCode);
      issues.push(...stylingValidation.issues);
    }

    return {
      isValid: issues.filter((issue) => issue.severity === "error").length === 0,
      issues,
      fixedCode,
      appliedFixes: issues.length,
    };
  }

  static validateTemplateIntegration(code) {
    const issues = [];
    if (code.includes("bg-secondary min-h-screen")) {
      issues.push({
        type: "template_conflict",
        message: "Generated code contains layout that conflicts with template",
        severity: "error",
      });
    }

    if (!code.includes("React.FC<{ campaign: Campaign | null }>")) {
      issues.push({
        type: "missing_interface",
        message: "Component missing proper template interface",
        severity: "error",
      });
    }
    return { isValid: issues.length === 0, issues };
  }

  static fixTemplateIntegration(code) {
    code = code.replace(/bg-secondary min-h-screen/g, "");
    code = code.replace(/max-w-7xl mx-auto px-4 py-8/g, "");
    if (!code.includes("React.FC<{ campaign: Campaign | null }>")) {
      code = code.replace(
        /const \w+: React\.FC =/g,
        "const $&: React.FC<{ campaign: Campaign | null }> = ({ campaign }) =>"
      );
    }
    return code;
  }

  static validateImports(code) {
    const issues = [];
    if (code.includes("Campaign") && !code.includes("import")) {
      issues.push({
        type: "missing_import",
        message: "Missing Campaign type import",
        severity: "error",
      });
    }
    return { isValid: issues.length === 0, issues };
  }

  static fixImports(code) {
    if (code.includes("Campaign") && !code.includes("import")) {
      const importStatement = "import { Campaign } from '../../types';";
      code = importStatement + "\n" + code;
    }
    return code;
  }

  static validateTypeScriptInterfaces(code) {
    const issues = [];
    if (!code.includes("React.FC") && !code.includes("interface")) {
      issues.push({
        type: "missing_typescript",
        message: "Component missing TypeScript interfaces",
        severity: "warning",
      });
    }
    return { isValid: issues.length === 0, issues };
  }

  static fixTypeScriptInterfaces(code) {
    if (!code.includes("React.FC") && !code.includes("interface")) {
      code = code.replace(/const (\w+) =/g, "const $1: React.FC =");
    }
    return code;
  }

  static fixStylingIssues(code) {
    const StylingValidator = require("./stylingValidator");
    const fixes = StylingValidator.suggestFixes(code);
    fixes.forEach((fix) => {
      if (fix.original) {
        fix.original.forEach((o) => {
          code = code.replace(new RegExp(o, "g"), fix.suggestion);
        });
      }
    });
    return code;
  }
}

module.exports = PostProcessingValidator;
