import { describe, it, expect, beforeEach } from "vitest";
import handler from "../orchestration-documentation";

const runHandler = async (query = {}) => {
  const req = { method: "GET", query };
  let statusCode = 200;
  const json = (data) => ({ statusCode, data });
  const res = {
    status(code) {
      statusCode = code;
      return { json };
    },
  };

  return handler(req, res);
};

describe("orchestration-documentation API", () => {
  it("returns 400 if id missing", async () => {
    const result = await runHandler();
    expect(result.statusCode).toBe(400);
  });

  it("returns 404 if file not found", async () => {
    const result = await runHandler({ id: "unknown" });
    expect(result.statusCode).toBe(404);
  });

  it("returns markdown when file exists", async () => {
    const result = await runHandler({ id: "HyattOrchestrator" });
    expect(result.statusCode).toBe(200);
    expect(result.data).toHaveProperty("markdown");
  });
});
