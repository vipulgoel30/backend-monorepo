// This jest.config.ts uses the ts-jest preset to define configuration
// jest uses ts-node (jest --> jest-cli --> jest-config --> ts-node (Dev dependency)) to get the configuration (ts-jest is not responsible for this)

import { createDefaultEsmPreset, type DefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

process.env.TS_NODE_PROJECT = "tsconfig.test.json";

const defaultEsmPresetConfig: DefaultEsmPreset = createDefaultEsmPreset({
  tsconfig: "tsconfig.test.json",
  diagnostics: {
    pretty: true,
  },
});

const jestConfig: JestConfigWithTsJest = {
  ...defaultEsmPresetConfig,
};

export default jestConfig;
