/**
 * Voice Command Processor for Generala Game
 * Handles interpretation of Spanish voice commands with improved error correction
 */

export type Category =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "escalera"
  | "full"
  | "poker"
  | "generala"
  | "dobleGenerala";

export interface VoiceCommandResult {
  category: Category | null;
  score: number | null;
  confidence: number; // 0-1 confidence score
  debugInfo: string;
}

// Map of Spanish number words to digits
const numberWords: Record<string, number> = {
  cero: 0,
  uno: 1,
  un: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
};

// Common mishearings and corrections
const mishearingCorrections: Record<string, string> = {
  servida: "servida",
  servido: "servido",
  vida: "servida", // Common mishearing
  vidas: "servida",
  general: "generala", // Common mishearing
  generales: "generala",
  escaleras: "escalera",
  fulls: "full",
  pokers: "poker",
};

/**
 * Normalize text for processing
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Extract number words from text in order of appearance
 */
function extractNumbersInOrder(
  text: string
): Array<{ word: string; value: number; index: number }> {
  const foundNumbers: Array<{ word: string; value: number; index: number }> =
    [];

  for (const [word, value] of Object.entries(numberWords)) {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      foundNumbers.push({ word, value, index: match.index });
    }
  }

  // Sort by order of appearance
  foundNumbers.sort((a, b) => a.index - b.index);

  // Remove duplicates (keep first occurrence of each position)
  const seen = new Set<number>();
  return foundNumbers.filter((item) => {
    if (seen.has(item.index)) return false;
    seen.add(item.index);
    return true;
  });
}

/**
 * Process voice command and extract category and score
 * Handles patterns like:
 * - "cuatro al seis" -> category: "6", score: 24 (4 dice × 6)
 * - "tres cincos" -> category: "5", score: 15 (3 × 5)
 * - "dos al cuatro" -> category: "4", score: 8 (2 × 4)
 * - "escalera servida" -> category: "escalera", score: 25
 * - "generala" -> category: "generala", score: 50
 */
export function processVoiceCommand(transcript: string): VoiceCommandResult {
  const text = normalizeText(transcript);
  let debugInfo = `Input: "${transcript}" -> Normalized: "${text}"`;

  // Check for special categories first
  if (
    text.includes("doble") &&
    (text.includes("generala") || text.includes("general"))
  ) {
    const score = text.includes("servida") ||
      text.includes("servido") ||
      text.includes("vida")
      ? 105
      : 100;
    return {
      category: "dobleGenerala",
      score,
      confidence: 0.95,
      debugInfo: `${debugInfo} -> Matched: Doble Generala (${score} pts)`,
    };
  }

  if (text.includes("escalera")) {
    const score = text.includes("servida") ||
      text.includes("servido") ||
      text.includes("vida")
      ? 25
      : 20;
    return {
      category: "escalera",
      score,
      confidence: 0.95,
      debugInfo: `${debugInfo} -> Matched: Escalera (${score} pts)`,
    };
  }

  if (text.includes("full")) {
    const score = text.includes("servida") ||
      text.includes("servido") ||
      text.includes("vida")
      ? 35
      : 30;
    return {
      category: "full",
      score,
      confidence: 0.95,
      debugInfo: `${debugInfo} -> Matched: Full (${score} pts)`,
    };
  }

  if (text.includes("poker")) {
    const score = text.includes("servida") ||
      text.includes("servido") ||
      text.includes("vida")
      ? 45
      : 40;
    return {
      category: "poker",
      score,
      confidence: 0.95,
      debugInfo: `${debugInfo} -> Matched: Poker (${score} pts)`,
    };
  }

  if (text.includes("generala") || text.includes("general")) {
    const score = text.includes("servida") ||
      text.includes("servido") ||
      text.includes("vida")
      ? 55
      : 50;
    return {
      category: "generala",
      score,
      confidence: 0.95,
      debugInfo: `${debugInfo} -> Matched: Generala (${score} pts)`,
    };
  }

  // Check for "tachar", "cero" or "raya" (cross out)
  if (text.includes("tachar") || text.includes("raya") || text.includes("cero")) {
    // Try to find which number category they're referring to
    const numbers = extractNumbersInOrder(text);
    if (numbers.length > 0) {
      const categoryNum = numbers[0].value;
      if (categoryNum >= 1 && categoryNum <= 6) {
        return {
          category: categoryNum.toString() as Category,
          score: 0,
          confidence: 0.9,
          debugInfo: `${debugInfo} -> Matched: Cross out ${categoryNum}`,
        };
      }
    }
    // If no number found, can't determine which category to cross out
    return {
      category: null,
      score: null,
      confidence: 0,
      debugInfo: `${debugInfo} -> Cross out command but no category found`,
    };
  }

  // Handle number categories (1-6)
  // Pattern: "[number] al [number]" or "[number] [number]s"
  // Examples: "tres al cinco", "dos al cuatro", "cuatro seises"

  let diceCount = 0;
  let categoryNumber = 0;

  // Try to match pattern like "tres al cinco" or "dos al seis"
  const alPattern = /(\w+)\s+al\s+(\w+)/;
  const alMatch = text.match(alPattern);

  if (alMatch) {
    const countWord = alMatch[1];
    const categoryWord = alMatch[2];
    diceCount = numberWords[countWord] || 0;
    categoryNumber = numberWords[categoryWord] || 0;

    debugInfo += ` -> Matched "al" pattern: ${countWord}(${diceCount}) al ${categoryWord}(${categoryNumber})`;

    // Validate the numbers
    if (diceCount > 0 && categoryNumber > 0 && categoryNumber <= 6) {
      const score = diceCount * categoryNumber;
      return {
        category: categoryNumber.toString() as Category,
        score,
        confidence: 0.98,
        debugInfo: `${debugInfo} -> Valid: ${diceCount} dice × ${categoryNumber} = ${score} pts`,
      };
    }
  }

  // Fallback: look for number words in order
  const numbers = extractNumbersInOrder(text);

  if (numbers.length >= 2) {
    // Use first number as dice count, second as category
    diceCount = numbers[0].value;
    categoryNumber = numbers[1].value;

    debugInfo += ` -> Found numbers in order: [${numbers
      .map((n) => `${n.word}(${n.value})`)
      .join(", ")}]`;

    if (diceCount > 0 && categoryNumber > 0 && categoryNumber <= 6) {
      const score = diceCount * categoryNumber;
      return {
        category: categoryNumber.toString() as Category,
        score,
        confidence: 0.85,
        debugInfo: `${debugInfo} -> Interpreted as: ${diceCount} dice × ${categoryNumber} = ${score} pts`,
      };
    }
  } else if (numbers.length === 1) {
    // If only one number found, assume it's the category
    categoryNumber = numbers[0].value;
    diceCount = 1; // Default to 1 die

    debugInfo += ` -> Single number found: ${numbers[0].word}(${categoryNumber})`;

    if (categoryNumber > 0 && categoryNumber <= 6) {
      const score = diceCount * categoryNumber;
      return {
        category: categoryNumber.toString() as Category,
        score,
        confidence: 0.7,
        debugInfo: `${debugInfo} -> Interpreted as: 1 die × ${categoryNumber} = ${score} pts`,
      };
    }
  }

  // No valid pattern found
  return {
    category: null,
    score: null,
    confidence: 0,
    debugInfo: `${debugInfo} -> No valid pattern matched`,
  };
}

/**
 * Test voice processing with multiple test cases
 */
export interface TestCase {
  input: string;
  expectedCategory: Category | null;
  expectedScore: number | null;
}

export const TEST_CASES: TestCase[] = [
  // "al" pattern tests
  { input: "cuatro al seis", expectedCategory: "6", expectedScore: 24 },
  { input: "tres al cinco", expectedCategory: "5", expectedScore: 15 },
  { input: "dos al cuatro", expectedCategory: "4", expectedScore: 8 },
  { input: "uno al tres", expectedCategory: "3", expectedScore: 3 },
  { input: "cinco al dos", expectedCategory: "2", expectedScore: 10 },

  // Plural forms
  { input: "cuatro seises", expectedCategory: "6", expectedScore: 24 },
  { input: "tres cincos", expectedCategory: "5", expectedScore: 15 },
  { input: "dos cuatros", expectedCategory: "4", expectedScore: 8 },

  // Special categories
  { input: "escalera", expectedCategory: "escalera", expectedScore: 20 },
  { input: "escalera servida", expectedCategory: "escalera", expectedScore: 25 },
  { input: "full", expectedCategory: "full", expectedScore: 30 },
  { input: "full servido", expectedCategory: "full", expectedScore: 35 },
  { input: "poker", expectedCategory: "poker", expectedScore: 40 },
  { input: "generala", expectedCategory: "generala", expectedScore: 50 },
  { input: "generala servida", expectedCategory: "generala", expectedScore: 55 },
  { input: "doble generala", expectedCategory: "dobleGenerala", expectedScore: 100 },

  // Cross out (tachar)
  { input: "tachar seis", expectedCategory: "6", expectedScore: 0 },
  { input: "raya tres", expectedCategory: "3", expectedScore: 0 },

  // Single numbers (ambiguous - should default to 1 die)
  { input: "seis", expectedCategory: "6", expectedScore: 6 },
  { input: "cinco", expectedCategory: "5", expectedScore: 5 },
];

/**
 * Run all test cases and return results
 */
export function runTests(): {
  passed: number;
  failed: number;
  results: Array<{
    input: string;
    expected: { category: Category | null; score: number | null };
    actual: { category: Category | null; score: number | null };
    passed: boolean;
  }>;
} {
  const results = [];
  let passed = 0;
  let failed = 0;

  for (const testCase of TEST_CASES) {
    const result = processVoiceCommand(testCase.input);
    const testPassed =
      result.category === testCase.expectedCategory &&
      result.score === testCase.expectedScore;

    if (testPassed) {
      passed++;
    } else {
      failed++;
    }

    results.push({
      input: testCase.input,
      expected: {
        category: testCase.expectedCategory,
        score: testCase.expectedScore,
      },
      actual: {
        category: result.category,
        score: result.score,
      },
      passed: testPassed,
    });
  }

  return { passed, failed, results };
}
