import type { StructuredResume } from "../types/resume";

const SECTION_ALIASES: Record<string, string[]> = {
  experience: [
    "experience", "work experience", "employment", "work history",
    "professional experience", "relevant experience", "professional background",
    "work background", "career history", "career summary", "employment history",
    "internship", "internships", "professional history",
  ],
  education: [
    "education", "academic background", "education & certifications",
    "education and certifications", "academic history", "educational background",
    "qualifications", "academic qualifications", "certifications / education",
  ],
  skills: [
    "skills", "technical skills", "core competencies", "competencies",
    "technical expertise", "areas of expertise", "key skills",
    "skills & expertise", "skills and expertise", "expertise",
    "technical proficiencies", "proficiencies", "technologies",
    "technical stack", "tech stack", "tools & technologies",
    "tools and technologies", "relevant skills",
  ],
  summary: [
    "summary", "professional summary", "profile", "about me",
    "about / summary", "about",
    "career objective", "objective", "professional profile",
    "executive summary", "qualifications summary", "highlights",
    "summary of qualifications",
  ],
  certifications: [
    "certifications", "certification", "certificates", "licenses",
    "licenses & certifications", "licenses and certifications",
    "professional certifications", "accreditations",
  ],
  projects: [
    "projects", "project experience", "project", "notable projects",
    "key projects", "personal projects", "open source",
    "side projects", "technical projects",
  ],
  publications: [
    "publications", "papers", "research", "research experience",
    "published works", "white papers",
  ],
  languages: [
    "languages", "language proficiency", "foreign languages",
  ],
  awards: [
    "awards", "honors", "honors & awards", "honors and awards",
    "achievements", "recognition",
  ],
};

const ALL_SECTION_NAMES = Object.values(SECTION_ALIASES).flat();

const DEGREE_KEYWORDS = [
  "bachelor", "bachelor's", "bachelors", "b.s.", "bs", "b.a.", "ba",
  "master", "master's", "masters", "m.s.", "ms", "m.a.", "ma", "mba",
  "phd", "ph.d.", "doctorate", "doctoral",
  "associate", "associate's", "associates", "a.a.", "a.s.",
  "b.tech", "b.e.", "m.tech", "m.e.",
  "bsc", "msc", "b.com", "m.com", "b.b.a.", "bba",
  "bachelor of science", "bachelor of arts", "bachelor of engineering",
  "bachelor of technology", "bachelor of business administration",
  "bachelor of commerce", "bachelor of laws",
  "master of science", "master of arts", "master of engineering",
  "master of technology", "master of business administration",
  "master of laws", "doctor of philosophy", "doctor of",
  "high school diploma", "ged", "diploma", "certificate",
  "b.eng", "m.eng", "ll.b", "j.d.", "md",
];

const INSTITUTION_KEYWORDS = [
  "university", "college", "institute", "institut", "school", "academy",
  "polytechnic", "conservatory", "faculty", "school of",
  "universitat", "université", "universität", "università",
  "community college", "technical college",
];

const MONTH_NAMES = "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?";

const DATE_RANGE_RE = new RegExp(
  `(?:${MONTH_NAMES})\\s*\\d{4}\\s*(?:-|–|to|–|—|\\s)\\s*(?:(?:${MONTH_NAMES})\\s*)?\\d{4}|present|current|now`,
  "gi"
);

const SINGLE_DATE_RE = new RegExp(`\\b(?:${MONTH_NAMES})\\s*\\d{4}\\b`, "gi");
const YEAR_RE = /\b(?:19|20)\d{2}\b/gi;

const BULLET_PREFIX = /^[\s•●▪▸◦‣⁃⦿❖➢➤→·\-*]\s*/;

const CONTACT_PATTERNS = [
  /[\w.-]+@[\w.-]+\.\w+/g,
  /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi,
  /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/gi,
  /(?:https?:\/\/)?(?:www\.)?gitlab\.com\/[\w-]+/gi,
  /(?:https?:\/\/)?(?:[\w-]+\.)?(?:stackoverflow|medium|dev\.to|dribbble|behance)\.(?:com|io)\/[\w-]+/gi,
  /\b(?:[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*(?:[A-Z]{2})\s*\d{5}(?:-\d{4})?\b/g,
  /\b(?:[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*(?:[A-Z]{2})\b/g,
];

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  Languages: [
    "javascript", "typescript", "python", "java", "c++", "cpp", "cplusplus",
    "c#", "csharp", "ruby", "go", "golang", "rust", "swift", "kotlin",
    "scala", "php", "perl", "haskell", "lua", "dart", "elixir", "clojure",
    "groovy", "r", "rlang", "sql", "pl/sql", "tsql", "graphql", "bash",
    "shell", "zsh", "powershell", "solidity", "assembly", "fortran",
    "cobol", "pascal", "delphi", "f#", "fsharp", "erlang", "julia",
    "matlab", "labview", "vb.net", "visual basic", "vba", "html5",
    "html", "css3", "css", "sass", "scss", "less", "stylus", "wasm",
    "webassembly",
  ],
  "Frontend Frameworks": [
    "react", "react.js", "reactjs", "next.js", "nextjs", "angular",
    "angular.js", "angularjs", "vue", "vue.js", "vuejs", "nuxt", "nuxt.js",
    "svelte", "sveltekit", "solid.js", "solidjs", "qwik", "preact", "lit",
    "htmx", "alpine.js", "stimulus", "turbo", "hotwire", "gatsby",
    "gatsby.js", "ember", "ember.js", "backbone", "backbone.js",
    "jquery", "d3.js", "d3", "three.js", "threejs", "chart.js",
    "chartjs", "pwa", "micro frontend", "micro-frontend",
    "web components", "custom elements", "shadow dom", "redux",
    "redux toolkit", "mobx", "recoil", "zustand", "pinia", "vuex",
    "ngrx", "rxjs", "react query", "tanstack query", "apollo",
    "relay", "swr", "react hook form", "formik",
    "tailwind", "tailwindcss", "bootstrap", "material ui", "mui",
    "chakra ui", "ant design", "antd", "semantic ui", "shadcn",
    "radix ui", "headless ui", "primefaces", "primeng",
    "styled-components", "emotion", "css modules", "postcss",
    "webpack", "vite", "esbuild", "rollup", "parcel", "turbopack",
    "babel", "swc", "grunt", "gulp",
  ],
  "Backend Frameworks": [
    "node.js", "nodejs", "express", "express.js", "nestjs", "nextjs",
    "django", "flask", "fastapi", "spring boot", "springboot", "spring",
    "spring framework", "rails", "ruby on rails", "laravel", "php",
    "symfony", "codeigniter", "cakephp", "yii", "asp.net", "asp.net core",
    ".net", ".net core", "dotnet", "gin", "echo", "fiber", "chi",
    "koa", "koa.js", "hapi", "hapi.js", "falcon", "celery", "tornado",
    "asyncio", "starlette", "sanic", "aiohttp", "actix", "rocket",
    "axum", "tower", "poetry", "pip",
  ],
  Databases: [
    "postgresql", "postgres", "mysql", "mariadb", "mongodb", "mongo",
    "redis", "elasticsearch", "elastic", "cassandra", "scylla",
    "dynamodb", "dynamo db", "couchdb", "couchbase", "oracle",
    "oracle db", "sql server", "mssql", "sqlite", "firebase",
    "firestore", "supabase", "neo4j", "influxdb", "clickhouse",
    "timescaledb", "cockroachdb", "yugabyte", "memcached",
    "valkey", "keydb", "arangodb", "realm", "hbase", "bigtable",
    "spanner", "aurora", "rds", "redshift", "snowflake",
    "databricks", "trino", "presto", "druid", "pinot",
  ],
  "Cloud & DevOps": [
    "aws", "amazon web services", "azure", "microsoft azure",
    "gcp", "google cloud", "google cloud platform", "cloudflare",
    "docker", "kubernetes", "k8s", "openshift", "nomad",
    "terraform", "opentofu", "ansible", "pulumi", "chef", "puppet",
    "saltstack", "jenkins", "github actions", "gitlab ci",
    "gitlab-ci", "circleci", "travis ci", "travis-ci", "bitbucket pipelines",
    "argo", "argo cd", "argocd", "helm", "prometheus", "grafana",
    "datadog", "new relic", "sentry", "splunk", "elk stack", "elk",
    "elastic stack", "nginx", "apache", "haproxy", "traefik",
    "caddy", "istio", "envoy", "linkerd", "consul", "vault",
    "packer", "vagrant", "cloudformation", "cdk", "serverless",
    "lambda", "ecs", "eks", "aks", "gke", "fargate",
    "observability", "opentelemetry", "jaeger", "zipkin",
    "sysadmin", "sre", "devops", "platform engineering",
  ],
  Testing: [
    "jest", "vitest", "mocha", "chai", "sinon", "cypress",
    "playwright", "puppeteer", "selenium", "webdriver",
    "pytest", "unittest", "nose", "junit", "testng", "rspec",
    "capybara", "minitest", "karma", "jasmine", "mocha",
    "testing library", "react testing library", "enzyme",
    "storybook", "chromatic", "percy", "artillery",
    "k6", "locust", "jmeter", "gatling", "loadrunner",
    "tdd", "bdd", "cucumber", "gherkin",
  ],
  "Tools & Platforms": [
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "trello", "asana", "notion", "linear", "basecamp",
    "vscode", "visual studio code", "intellij", "webstorm",
    "pycharm", "goland", "phpstorm", "eclipse", "netbeans",
    "vim", "neovim", "emacs", "nano", "sublime text",
    "linux", "unix", "ubuntu", "debian", "centos", "red hat",
    "macos", "windows", "wsl", "bash", "zsh", "fish",
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "zeplin", "invision", "framer",
    "postman", "insomnia", "bruno", "swagger", "openapi",
    "kibana", "logstash", "filebeat", "metricbeat",
  ],
  Mobile: [
    "react native", "react-native", "flutter", "dart",
    "android", "android studio", "kotlin", "java android",
    "ios", "swiftui", "uikit", "objective-c", "swift",
    "xamarin", "cordova", "phonegap", "ionic", "capacitor",
    "native script", "nativescript", "expo", "xcode",
    "app store", "google play", "mobile development",
  ],
  "Data & ML": [
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
    "pandas", "numpy", "scipy", "matplotlib", "seaborn",
    "plotly", "jupyter", "jupyter notebook", "colab",
    "airflow", "spark", "apache spark", "pyspark", "hadoop",
    "kafka", "apache kafka", "rabbitmq", "pulsar", "nats",
    "tableau", "power bi", "looker", "metabase", "superset",
    "snowflake", "dbt", "bigquery", "data studio",
    "mlflow", "kubeflow", "wandb", "neptune",
    "huggingface", "transformers", "langchain", "llamaindex",
    "openai", "gpt", "llm", "rag", "vector database",
    "weaviate", "pinecone", "qdrant", "chroma", "milvus",
    "llama", "mistral", "gemma", "ollama",
    "nlp", "computer vision", "deep learning", "machine learning",
    "statistical analysis", "a/b testing", "experimentation",
    "etl", "data pipeline", "data engineering", "data science",
    "data analytics", "business intelligence",
  ],
  Concepts: [
    "agile", "scrum", "kanban", "lean", "xp", "extreme programming",
    "ci/cd", "continuous integration", "continuous delivery",
    "microservices", "micro-frontend", "micro frontend",
    "rest api", "restful", "soap", "grpc", "graphql",
    "oauth", "oauth2", "jwt", "saml", "openid", "ldap",
    "ssl/tls", "https", "mfa", "rbac", "abac",
    "tdd", "bdd", "ddd", "domain driven design",
    "event sourcing", "cqrs", "event driven architecture",
    "solid", "solid principles", "design patterns",
    "clean architecture", "clean code", "hexagonal architecture",
    "onion architecture", "layered architecture",
    "mvc", "mvvm", "mvp", "flux", "redux pattern",
    "monorepo", "polyrepo", "multirepo",
    "api gateway", "service mesh", "load balancing",
    "cd", "iac", "infrastructure as code",
    "gitops", "devsecops", "chaos engineering",
    "performance optimization", "scalability", "high availability",
    "disaster recovery", "backup", "monitoring", "alerting",
    "sre", "slo", "sli", "error budget",
    "waterfall", "project management", "product management",
  ],
  Certifications: [
    "aws certified", "aws certification", "aws certified solutions architect",
    "aws certified developer", "aws certified sysops",
    "azure certified", "azure certification",
    "gcp certified", "google cloud certified",
    "pmp", "project management professional",
    "scrum master", "csm", "psm", "safe",
    "cka", "ckad", "cks", "cks",
    "cissp", "cissp", "security+", "network+", "comptia",
    "ccna", "ccnp", "ccie", "cisco",
    "ceh", "certified ethical hacker", "oscp",
    "cfa", "cpa", "cma",
    "itil", "toGAF", "six sigma", "lean six sigma",
    "aws solutions architect", "aws developer associate",
    "google associate cloud engineer", "google professional data engineer",
    "azure administrator", "azure developer",
    "kubernetes administrator", "kubernetes application developer",
  ],
};

function findSection(text: string, sectionNames: string[]): string {
  const lines = text.split("\n");
  let inSection = false;
  const sectionLines: string[] = [];
  let headerIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (!inSection) {
      const match = sectionNames.some((name) => {
        const lower = line.toLowerCase().replace(/[^a-z0-9/ ]/g, "").trim();
        return lower === name || lower.startsWith(name) || lower.replace(/\s+/g, " ") === name;
      });
      if (match) {
        inSection = true;
        headerIndex = i;
        continue;
      }
    } else {
      const nextHeader = ALL_SECTION_NAMES.some((h) => {
        if (sectionNames.includes(h)) return false;
        const lower = lines[i].toLowerCase().replace(/[^a-z0-9/ ]/g, "").trim();
        return lower === h || lower.startsWith(h) || lower.replace(/\s+/g, " ") === h;
      });
      if (nextHeader && i > headerIndex + 1) break;
      if (line) sectionLines.push(line);
    }
  }

  return sectionLines.join("\n");
}

function hasDateLine(line: string): boolean {
  return DATE_RANGE_RE.test(line) || SINGLE_DATE_RE.test(line) || /\b(?:19|20)\d{2}\b/.test(line);
}

function stripPipeSuffix(line: string): string {
  return line.split("|")[0].trim();
}

function extractDates(line: string): { start: string; end: string } {
  const cleaned = stripPipeSuffix(line);
  const rangeMatch = cleaned.match(DATE_RANGE_RE);
  if (rangeMatch) {
    const parts = rangeMatch[0].split(/\s*(?:-|–|—|to)\s*/i).map((d) => d.trim());
    return {
      start: parts[0] || "",
      end: parts.length > 1 ? parts[1] : "",
    };
  }

  const singleDates = cleaned.match(SINGLE_DATE_RE);
  if (singleDates && singleDates.length >= 2) {
    return { start: singleDates[0], end: singleDates[1] };
  }

  const years = cleaned.match(YEAR_RE);
  if (years && years.length >= 2) {
    return { start: years[0], end: years[1] };
  }

  if (singleDates && singleDates.length === 1) {
    return { start: singleDates[0], end: "" };
  }

  if (years && years.length === 1) {
    return { start: years[0], end: "" };
  }

  return { start: "", end: "" };
}

function isLikelyDateLine(line: string): boolean {
  const cleaned = stripPipeSuffix(line);
  if (hasDateLine(cleaned) && cleaned.replace(/\s/g, "").length < 80) return true;
  const lower = cleaned.toLowerCase();
  if ((lower.includes("present") || lower.includes("current") || lower.includes("now")) && cleaned.length < 80) return true;
  return false;
}

function isContactLine(line: string): boolean {
  return CONTACT_PATTERNS.some((p) => p.test(line));
}

function extractName(lines: string[]): string {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (!line || isContactLine(line) || ALL_SECTION_NAMES.some((h) => line.toLowerCase().startsWith(h))) continue;
    if (line.length > 1 && line.length < 60 && !/\d/.test(line)) return line;
  }
  return lines[0] || "";
}

function extractLocation(text: string): string {
  const lines = text.split("\n").slice(0, 10).join("\n");
  const locPatterns = [
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})\s*\d{5}(?:-\d{4})?/g,
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/g,
    /\b(?:Remote|Hybrid|On-site|Onsite)\b/gi,
    /\b\d{5}(?:-\d{4})?\b/g,
  ];

  for (const pattern of locPatterns) {
    const match = lines.match(pattern);
    if (match) {
      const result = match[0];
      if (/\b(Script|Type|Script,ME|MEAN)\b/i.test(result)) continue;
      return result;
    }
  }
  return "";
}

function parseExperience(text: string): Array<{ company: string; title: string; start_date: string; end_date: string; description: string }> {
  const section = findSection(text, SECTION_ALIASES.experience);
  if (!section) return [];

  const rawLines = section.split("\n").map((l) => l.trim()).filter(Boolean);
  const entries: Array<{ company: string; title: string; start_date: string; end_date: string; description: string }> = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];

    if (!isLikelyDateLine(line)) {
      i++;
      continue;
    }

    const dates = extractDates(line);

    let companyLine = "";
    let titleLine = "";

    if (i > 0) {
      const prev = rawLines[i - 1];
      if (prev.length < 120 && !isContactLine(prev) && !ALL_SECTION_NAMES.some((h) => prev.toLowerCase().startsWith(h))) {
        const pipeIdx = prev.indexOf("|");
        if (pipeIdx > -1) {
          companyLine = prev.slice(0, pipeIdx).trim();
          titleLine = prev.slice(pipeIdx + 1).trim();
        } else {
          companyLine = prev;
        }
      }
    }

    let descLines: string[] = [];
    i++;

    while (i < rawLines.length) {
      const next = rawLines[i];
      if (isLikelyDateLine(next) && next !== line) {
        if (stripPipeSuffix(next).length < 100) break;
      }
      const cleaned = next.replace(BULLET_PREFIX, "");
      if (cleaned) descLines.push(cleaned);
      i++;
    }

    entries.push({
      company: companyLine,
      title: titleLine,
      start_date: dates.start,
      end_date: dates.end,
      description: descLines.join("\n"),
    });
  }

  return entries;
}

function parseEducation(text: string): Array<{ institution: string; degree: string; field: string; start_date: string; end_date: string }> {
  const section = findSection(text, SECTION_ALIASES.education);
  if (!section) return [];

  const lines = section.split("\n").map((l) => l.trim()).filter(Boolean);
  const entries: Array<{ institution: string; degree: string; field: string; start_date: string; end_date: string }> = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const lower = line.toLowerCase();

    const hasInstitution = INSTITUTION_KEYWORDS.some((inst) => lower.includes(inst));
    if (!hasInstitution) { i++; continue; }

    const entry: { institution: string; degree: string; field: string; start_date: string; end_date: string } =
      { institution: line, degree: "", field: "", start_date: "", end_date: "" };

    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      const nextLower = nextLine.toLowerCase();
      const hasDegreeInNext = DEGREE_KEYWORDS.some((d) => nextLower.includes(d));
      const nextDates = extractDates(nextLine);

      if (hasDegreeInNext || nextDates.start) {
        entry.degree = nextLine;
        if (nextDates.start) entry.start_date = nextDates.start;
        if (nextDates.end) entry.end_date = nextDates.end;
        i += 2;
      } else {
        entry.degree = nextLine;
        i += 2;
      }
    } else {
      i++;
    }

    entries.push(entry);
  }

  return entries;
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const skills of Object.values(SKILLS_BY_CATEGORY)) {
    for (const skill of skills) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(lower)) {
        found.add(skill);
      }
    }
  }

  return Array.from(found).sort();
}

function extractSummary(text: string, lines: string[]): string {
  const section = findSection(text, SECTION_ALIASES.summary);
  if (section) return section;

  const firstHeaderIdx = lines.findIndex((l) =>
    ALL_SECTION_NAMES.some((h) => l.toLowerCase().replace(/[^a-z0-9/ ]/g, "").trim() === h)
  );

  if (firstHeaderIdx > 1) {
    const summaryLines: string[] = [];
    for (const l of lines.slice(1, firstHeaderIdx)) {
      if (isContactLine(l)) continue;
      summaryLines.push(l);
    }
    if (summaryLines.length <= 4) return summaryLines.join(" ");
  }

  return "";
}

export function parseResumeText(text: string): StructuredResume {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi;
  const ghRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/gi;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const name = extractName(lines);
  const email = text.match(emailRegex)?.[0] || "";
  const phone = text.match(phoneRegex)?.[0] || "";
  const linkedin = text.match(urlRegex)?.[0] || "";
  const github = text.match(ghRegex)?.[0] || "";
  const location = extractLocation(text);
  const skills = extractSkills(text);
  const summary = extractSummary(text, lines);
  const experience = parseExperience(text);
  const education = parseEducation(text);

  return {
    contact: { name, email, phone, location, linkedin, github },
    summary,
    skills,
    experience,
    education,
  };
}
