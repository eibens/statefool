/** EXTERNALS **/

import { join } from "https://deno.land/std@0.152.0/path/mod.ts";

/** HELPERS **/

async function readDirNames(path: string) {
  const names: string[] = [];
  for await (const entry of Deno.readDir(path)) {
    if (!entry.isDirectory) continue;
    names.push(entry.name);
  }
  return names.sort((a, b) => a.localeCompare(b));
}

async function readFileNames(path: string) {
  const names: string[] = [];
  for await (const entry of Deno.readDir(path)) {
    if (entry.isDirectory) continue;
    if (entry.name === "mod.ts") continue;
    names.push(entry.name);
  }
  return names.sort((a, b) => a.localeCompare(b));
}

async function toText(iter: AsyncIterable<string>) {
  const lines: string[] = [];
  for await (const line of iter) {
    lines.push(line);
  }
  return lines.join("");
}

// GENERATORS

async function* genExportAllFromFiles(path: string) {
  for (const name of await readFileNames(path)) {
    yield `export * from "./${name}";\n`;
  }
}

async function* genExportAllAsNameFromFiles(path: string) {
  for (const name of await readFileNames(path)) {
    let trim = 0;
    if (name.endsWith(".ts")) trim = 3;
    if (name.endsWith(".tsx")) trim = 4;
    const trimmed = name.substring(0, name.length - trim);
    yield `export * as ${trimmed} from "./${name}";\n`;
  }
}

async function* genExportAllAsNameFromDirs(path: string, ext = "ts") {
  for (const name of await readDirNames(path)) {
    yield `export * as ${name} from "./${name}/mod.${ext}";\n`;
  }
}

async function* genExportDefaultAsNameFromDirs(path: string, ext = "ts") {
  for (const name of await readDirNames(path)) {
    yield `export { default as ${name} } from "./${name}/mod.${ext}";\n`;
  }
}

async function* genModule(path: string, options: GenModuleOptions) {
  const { source, tsx, exports } = options;

  const todo = () => {
    throw new Error(`Not implemented: export ${exports} from ${source}`);
  };

  const func = {
    "directory": {
      "default-as-name": genExportDefaultAsNameFromDirs,
      "all-as-name": genExportAllAsNameFromDirs,
      "all": todo,
    },
    "file": {
      "default-as-name": todo,
      "all-as-name": genExportAllAsNameFromFiles,
      "all": genExportAllFromFiles,
    },
  }[source][exports];

  yield `// Generated code. Do not edit.\n`;
  yield* func(path, tsx ? "tsx" : "ts");
}

/** MAIN **/

export type GenModuleOptions = {
  source: "directory" | "file";
  exports: "default-as-name" | "all-as-name" | "all";
  tsx?: boolean;
};

export type GenOptions = {
  modules: Record<string, GenModuleOptions>;
  onWriteFile?: (file: string, content: string) => void;
};

export async function gen(path: string, options: GenOptions) {
  const { modules, onWriteFile } = options;
  for await (const name of await readDirNames(path)) {
    if (!(name in modules)) continue;

    const dir = join(path, name);
    const file = join(dir, "mod.ts");
    const iter = genModule(dir, modules[name]);
    const content = await toText(iter);

    await Deno.writeTextFile(file, content);
    onWriteFile?.(file, content);
  }
}
