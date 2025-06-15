import { ServerApp } from "./presentation/server";

(async (): Promise<void> => {
  main();
})();

function main(): void {
  ServerApp.start();
}
