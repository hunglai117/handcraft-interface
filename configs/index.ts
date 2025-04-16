import dev from './dev.json';
import prod from './prod.json';

export interface Config {
  baseApiUrl: string;
  appUrl: string;
}

export const envConfig = process.env.NEXT_PUBLIC_ENV || 'dev';

interface EnvConfig {
  prod: Config;
  dev: Config;
}

const configs: EnvConfig = { dev, prod } as EnvConfig;
const config: Config = configs[envConfig as keyof typeof configs];

export default config;
