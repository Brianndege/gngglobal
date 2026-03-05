const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/tests/e2e/"],
  modulePathIgnorePatterns: ["<rootDir>/.netlify/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/server/auth.ts",
    "src/server/cms-utils.ts",
    "src/server/serializers.ts",
    "src/lib/adminAuth.ts",
    "src/lib/blog.ts",
    "src/lib/cms.ts",
    "src/app/api/admin/login/route.ts",
    "src/app/api/admin/media/route.ts",
    "src/app/api/admin/posts/actions/route.ts",
    "src/app/api/admin/posts/analytics/route.ts",
    "src/app/admin/login/page.tsx",
    "src/app/admin/posts/page.tsx",
  ],
  coverageThreshold: {
    "src/server/auth.ts": {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
    "src/app/api/admin/login/route.ts": {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
    "src/app/api/admin/posts/actions/route.ts": {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    "src/app/admin/posts/page.tsx": {
      statements: 70,
      branches: 45,
      functions: 45,
      lines: 70,
    },
    global: {
      statements: 80,
      branches: 65,
      functions: 70,
      lines: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
