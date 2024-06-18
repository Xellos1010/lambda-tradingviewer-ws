// test/generateJWT.test.ts
import { generateJWT } from "../src/coinbase/auth/generateJWT";
import * as jwt from "jsonwebtoken";

jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue(`-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIK4Idu8WaolEFYKnw6vVAglHLjvtxvgamWWacyLjOkECoAoGCCqGSM49\nAwEHoUQDQgAE7m176kyAePc4reS9sWg6EOxJ0FDIEOAKo2cQXeCUr5ktkCLmOEVv\nSZugbDJAiqfMgFQ0mzEo01L/uXMtIYAGmw==\n-----END EC PRIVATE KEY-----\n`),
}));

describe("generateJWT", () => {
  it("should generate a valid JWT", () => {
    const method = "GET";
    const path = "/api/v3/brokerage/accounts";
    const token = generateJWT(method, path);
 
    expect(token).toBeDefined();

    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty("iss", "cdp");
    expect(decoded).toHaveProperty(
      "sub",
      "organizations/{org_id}/apiKeys/{key_id}"
    );
    expect(decoded).toHaveProperty("uri", `${method} api.coinbase.com${path}`);
  });
});
