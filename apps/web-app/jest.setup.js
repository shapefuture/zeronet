// Fail tests on console.error, log all console output for debugging
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    process.stderr.write("[console.error] " + args.join(" ") + "\n");
    throw new Error("Console error: " + args.join(" "));
  });
  jest.spyOn(console, "log").mockImplementation((...args) => {
    process.stdout.write("[console.log] " + args.join(" ") + "\n");
  });
  jest.spyOn(console, "debug").mockImplementation((...args) => {
    process.stdout.write("[console.debug] " + args.join(" ") + "\n");
  });
  jest.spyOn(console, "trace").mockImplementation((...args) => {
    process.stdout.write("[console.trace] " + args.join(" ") + "\n");
  });
});
