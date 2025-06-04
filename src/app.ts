import { ServerApp } from "./presentation/server";

(async () => {
  main();
})();

function main(): void {
  ServerApp.start();
}
