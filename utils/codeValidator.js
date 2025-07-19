export class CodeValidator {
  static validateStyling(code) {
    const hardcodedColorPatterns = [
      /bg-blue-\d+/g,
      /bg-green-\d+/g,
      /bg-gray-\d+/g,
      /text-blue-\d+/g,
      /text-green-\d+/g,
      /text-gray-\d+/g,
      /border-blue-\d+/g,
      /border-green-\d+/g,
      /border-gray-\d+/g,
    ];

    const violations = [];

    hardcodedColorPatterns.forEach((pattern) => {
      const matches = code.match(pattern);
      if (matches) {
        violations.push({
          pattern: pattern.source,
          matches: matches,
          message: `Hardcoded colors found: ${matches.join(", ")}`,
        });
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  static validateReactSyntax(code) {
    const requiredPatterns = [
      /import.*React.*from.*['\"]react['\"]/,
      /export.*default/,
      /function.*Component|const.*Component.*=/,
    ];

    const missingPatterns = [];

    requiredPatterns.forEach((pattern) => {
      if (!pattern.test(code)) {
        missingPatterns.push(pattern.source);
      }
    });

    return {
      isValid: missingPatterns.length === 0,
      missingPatterns,
    };
  }

  static validateTypeScript(code) {
    const hasInterface = /interface.*Props/.test(code);
    const hasTypeAnnotation = /:\s*React\.FC/.test(code);

    return {
      isValid: hasInterface && hasTypeAnnotation,
      missing: {
        interface: !hasInterface,
        typeAnnotation: !hasTypeAnnotation,
      },
    };
  }
}
