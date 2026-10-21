// SkillBridge Matching Engine: transparent skill-overlap scoring.
export const SKILL_ALIASES = {
  SQL: ["sql", "mysql", "postgresql", "postgres"],
  Excel: ["excel", "microsoft excel", "spreadsheets"],
  Python: ["python"],
  "Power BI": ["power bi", "powerbi"],
  Tableau: ["tableau"],
  Statistics: ["statistics", "statistical analysis"],
  JavaScript: ["javascript", "ecmascript", "js"],
  React: ["react", "react.js", "reactjs"],
  HTML: ["html", "html5"],
  CSS: ["css", "css3"],
  Java: ["java"],
  "C++": ["c++", "cpp"],
  Git: ["git", "github", "version control"],
  MongoDB: ["mongodb", "mongo db"],
  "Node.js": ["node.js", "nodejs"],
  Communication: ["communication", "presentation skills"],
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWholeTerm(text, term) {
  const escaped = escapeRegExp(term);
  const expression = new RegExp(`(^|[^a-z0-9+#.])${escaped}(?=$|[^a-z0-9+#.])`, "i");
  return expression.test(text);
}

export function normalizeSkill(value) {
  const input = String(value ?? "").trim().toLowerCase();
  if (!input) return null;
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (canonical.toLowerCase() === input || aliases.some((alias) => alias.toLowerCase() === input)) {
      return canonical;
    }
  }
  return null;
}

export function extractSkills(resumeText = "") {
  const text = String(resumeText).toLowerCase();
  const found = [];
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if ([canonical, ...aliases].some((term) => hasWholeTerm(text, term))) found.push(canonical);
  }
  return found.sort((a, b) => a.localeCompare(b));
}

export function parseSkillList(input = "") {
  const values = Array.isArray(input) ? input : String(input).split(/[,;\\n]/);
  return [...new Set(values.map(normalizeSkill).filter(Boolean))];
}

export function calculateMatch(studentSkills = [], requiredSkills = []) {
  const student = new Set(parseSkillList(studentSkills));
  const required = [...new Set(parseSkillList(requiredSkills))];
  const matchedSkills = required.filter((skill) => student.has(skill));
  const missingSkills = required.filter((skill) => !student.has(skill));
  const score = required.length ? Math.round((matchedSkills.length / required.length) * 100) : 0;
  return {
    score, matchedSkills, missingSkills,
    totalRequired: required.length,
    totalMatched: matchedSkills.length,
    algorithmVersion: "skill-overlap-v1",
    scoreMeaning: "Percentage of listed required skills matched; not hiring probability.",
  };
}

export function analyzeCandidate({ resumeText = "", manualSkills = [] } = {}) {
  return {
    detectedSkills: [...new Set([...extractSkills(resumeText), ...parseSkillList(manualSkills)])],
  };
}
