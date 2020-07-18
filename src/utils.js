export function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== "undefined") {
      return args[i];
    }
  }
}
