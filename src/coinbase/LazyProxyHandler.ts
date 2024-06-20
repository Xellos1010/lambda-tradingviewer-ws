// src/coinbase/LazyProxyHandler.ts
import Config from "./config/Config";

export class LazyProxyHandler {
  private target: any;
  private factory: () => any;
  private requiresAuth: boolean;
  private config: Config | undefined;

  constructor(factory: () => any, requiresAuth: boolean, config?: Config) {
    this.factory = factory;
    this.requiresAuth = requiresAuth;
    this.config = config;
  }

  get(_: any, propKey: string) {
    if (!this.target) {
      this.target = this.factory();
      this.target.config = this.config; // Set the config on the target
    }

    if (this.requiresAuth && !this.config) {
      throw new Error("Configuration is required for authenticated requests.");
    }

    const value = this.target[propKey];
    if (typeof value === 'function') {
      return value.bind(this.target);
    }

    return value;
  }
}
