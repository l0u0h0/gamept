export const DBConfig = {
  name: 'PromptData',
  version: 1,
  objectStoresMeta: [
    {
      store: 'prompt',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: "content", keypath: "content", options: { unique: false } },
        { name: "choice", keypath: "choice", options: { unique: false } },
      ],
    },
  ],
};
