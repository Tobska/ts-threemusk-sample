/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  cacheDirectory: "./.cache/jest",
  coverageReporters: ["html", "text-summary", "cobertura"],
};
