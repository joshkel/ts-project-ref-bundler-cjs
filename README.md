# Referenced `nodenext` project resolves its imports in CJS mode

`lib` is an ESM package (`"type": "module"`) compiled with `module`/`moduleResolution: nodenext`.
`app` uses `moduleResolution: bundler` and has a project reference to `lib`.
`dual` is a dual-format package whose `import` and `require` conditions point to different
declaration files (`format: "esm"` vs. `format: "cjs"`).

```sh
npm install
npx tsc -b app
```

Expected: no errors. `lib` is ESM, so `lib`'s `import { makeBox } from 'dual'` should
resolve to `dual/index.d.ts`, the same file it loads at runtime:

```sh
node -e "import('./lib/dist/index.js').then(m => console.log(m.box))"   # { format: 'esm' }
```

Actual:

```
app/src/index.ts(5,14): error TS2322: Type '"cjs"' is not assignable to type '"esm"'.
```

Things that make the error go away:

- Removing `references` from `app/tsconfig.json`, so `app` compiles `lib/src` with its own options.
- Pointing `paths` at the prebuilt `lib/dist` without `references`. The same `lib/dist/index.d.ts`
  then resolves `dual` correctly.
- Switching `app` to `module`/`moduleResolution: nodenext`.
