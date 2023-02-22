export default defineManualApi({
  events: {
    fileRemoved: {
      types: "`(file: VaFile) => void`",
    },
    fileAdded: {
      types: "`(files: VaFile[]) => void`",
    },
  },
  slots: {
    default: {},
  },
});
