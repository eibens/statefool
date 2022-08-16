import { gen } from "../gen.ts";

if (import.meta.main) {
  const [command] = Deno.args;

  if (command === "gen") {
    await gen("./examples/extensible", {
      onWriteFile: (file, content) => {
        console.log(`${file} (${content.length} bytes)`);
      },
      modules: {
        actors: {
          source: "directory",
          exports: "all-as-name",
        },
        components: {
          source: "file",
          exports: "all",
          tsx: true,
        },
        containers: {
          source: "directory",
          exports: "default-as-name",
        },
        stores: {
          source: "file",
          exports: "all-as-name",
        },
      },
    });
  }
}
