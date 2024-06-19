// src/config/Config.ts
class Config {
    private static instances: Map<string, Config> = new Map();
    private keyName: string;
    private keySecret: string;
    private baseUrl: string;
  
    private constructor(keyName: string, keySecret: string, baseUrl: string) {
      this.keyName = keyName;
      this.keySecret = keySecret;
      this.baseUrl = baseUrl;
    }
  
    public static getInstance(keyName: string, keySecret: string, baseUrl: string): Config {
      const key = `${keyName}:${keySecret}:${baseUrl}`;
      if (!Config.instances.has(key)) {
        Config.instances.set(key, new Config(keyName, keySecret, baseUrl));
      }
      return Config.instances.get(key) as Config;
    }
  
    public getKeyName(): string {
      return this.keyName;
    }
  
    public getKeySecret(): string {
      return this.keySecret;
    }
  
    public getBaseUrl(): string {
      return this.baseUrl;
    }
  }
  
  export default Config;
  