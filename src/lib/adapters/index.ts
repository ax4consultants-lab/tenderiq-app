import { MockAdapter } from "./mock";
import { RestAdapter } from "./rest";

export type Adapter = MockAdapter | RestAdapter;

export function createAdapter(useMock: boolean, apiBaseUrl?: string): Adapter {
  if (useMock) {
    return new MockAdapter();
  }
  if (!apiBaseUrl) {
    throw new Error("API base URL is required when not using mock adapter");
  }
  return new RestAdapter(apiBaseUrl);
}
