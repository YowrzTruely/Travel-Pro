# THE CODEX — PART 2
## Path 1: App Development
*44 Chapters · Blocks A–E*

> Complete Part 1 (all 19 chapters) before starting Path 1.

---

| Block | Chapters | Focus |
|---|---|---|
| A — Shared Foundation | A1–A4 | JS, TS, React, Tooling |
| B — Cross-Platform Web | B-Web1–3 | Web platform, Vite, TanStack Start |
| B — Cross-Platform Mobile | B-Mob1–4 | React Native, Expo, EAS, Notifications |
| B — Cross-Platform Desktop | B-Desktop1 | Electron |
| C — Native iOS/macOS | C-iOS1–4 | Swift, SwiftUI, iOS, macOS |
| C — Native Android | C-Android1–3 | Kotlin, Compose, Android |
| C — Native Windows | C-Win1 | C#, .NET, WinUI |
| D — Integrations | D1–D9 | Convex, Auth, Payments, Analytics, AI |
| E — Deployment | E1–E10 | Platforms, cloud, distribution |



---


---



# A1 — JavaScript

> 📦 **Block A — Shared Foundation**

*The language of the web — and everything built on top of it*

## Overview

JavaScript is the only language that runs natively in every web browser. It is also, via Node.js, a capable server-side language and the runtime for the build tools you will use daily. TypeScript — introduced next chapter — is JavaScript with a type system bolted on. React — introduced the chapter after — is a JavaScript library. Understanding JavaScript deeply is not optional for any web or mobile developer.

This chapter covers JavaScript the language, not the browser APIs or the DOM. Those are layered on top and covered in the web platform chapter.



## A1.1  What Makes JavaScript Unusual

JavaScript was created in 10 days by Brendan Eich at Netscape in 1995. Many of its stranger behaviours are the direct result of that speed. Yet it became the dominant language of the web — and the ecosystem has grown into one of the most active in the world.

- **Dynamically typed:** Variables have no declared type. The same variable can hold a number, then a string, then a function.

- **Single-threaded:** There is one call stack. Concurrency is achieved through the event loop, not threads.

- **Prototype-based OOP:** Objects inherit from other objects (via the prototype chain), not from classes. ES6 class syntax is syntactic sugar over this.

- **First-class functions:** Functions are values. They can be passed as arguments, returned, stored in variables.



## A1.2  Variables and Scope

### var, let, const

`var` is function-scoped and hoisted — it was the original declaration keyword and has surprising behaviour. `let` is block-scoped (limited to the `{}` it was declared in). `const` is block-scoped and cannot be reassigned (though object properties can still be mutated). Use `const` by default; use `let` when reassignment is needed; avoid `var`.

### Hoisting

`var` declarations are "hoisted" to the top of their function — the declaration is moved, but not the assignment. A `var` variable accessed before its assignment line returns `undefined` rather than throwing. `let` and `const` are in a "temporal dead zone" — accessing them before declaration throws a ReferenceError. This is the correct behaviour.

### Closures

A function retains a reference to the variables in its outer scope, even after that scope has finished executing. This is a closure. It is fundamental to callbacks, module patterns, and most of React's hook behaviour.



## A1.3  Types and Coercion

- **Primitives:** `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`

- **Objects:** Everything else — arrays, functions, dates, maps, sets, plain objects.

JavaScript performs implicit type coercion when types are mixed. `1 + "2"` produces `"12"` (number coerced to string). `1 - "2"` produces `-1` (string coerced to number). `==` performs coercion; `===` does not. Always use `===`.

`null` and `undefined` are distinct. `null` is an intentional absence of value. `undefined` is an uninitialised variable or missing object property. `typeof null` returns `"object"` — a historical bug that cannot be fixed without breaking the web.



## A1.4  Functions

### Function Declaration vs Expression

Function declarations are hoisted — the entire function is available throughout its scope before the declaration line. Function expressions (assigning a function to a variable) are not. Arrow functions (`=>`) are function expressions with lexical `this` binding.

### Arrow Functions

Arrow functions do not have their own `this`. They inherit `this` from the enclosing scope at the time of definition. This is the key behavioural difference from regular functions, not just syntactic shorthand.

### Default Parameters and Rest/Spread

`function greet(name = "World")` — default parameter if none is provided. `function sum(...nums)` — rest parameter collects all remaining arguments into an array. `Math.max(...[1, 2, 3])` — spread expands an array into individual arguments.



## A1.5  Objects and Arrays

### Object Literals

Objects are key-value stores. Keys are strings (or symbols). Values are any type. Shorthand property syntax: `{name, age}` instead of `{name: name, age: age}`. Computed property names: `{[variable]: value}`. Destructuring: `const {name, age} = person` extracts properties into variables.

### Arrays

Arrays are objects with numeric keys and a `length` property. Essential array methods: `map` (transform each element), `filter` (keep elements matching predicate), `reduce` (accumulate to single value), `find` (first matching element), `some`/`every` (test elements), `flat`/`flatMap` (flatten nested arrays). These are the functional core of data transformation in JS.

### Destructuring and Spread

`const [first, ...rest] = array` — array destructuring with rest. `const merged = {...obj1, ...obj2}` — object spread (shallow merge). These patterns appear constantly in React and modern JS code.



## A1.6  Modules

### ES Modules (ESM)

Modern JavaScript uses `import`/`export` syntax. Named exports: `export const fn = ...`. Default export: `export default class App`. Importing: `import { fn } from "./module"` or `import App from "./App"`. ES modules are static — imports are resolved at compile time, enabling tree-shaking.

### CommonJS

Node.js historically used `require()`/`module.exports`. Still common in Node tooling and older packages. ESM is now supported in Node.js via the `.mjs` extension or `"type": "module"` in `package.json`. In practice, build tools (Vite, webpack) handle the translation.



## A1.7  Asynchronous JavaScript

From Part 1 Ch11 applied to JS: the event loop, callbacks, promises, and async/await. This section reinforces those concepts in a JavaScript-specific context.

### Promises

`fetch("https://api.example.com/data")` returns a Promise. `.then(response => response.json()).then(data => ...)` chains handlers. `.catch(err => ...)` handles rejection. `Promise.all([p1, p2, p3])` waits for all. `Promise.race` resolves/rejects with the first settled promise.

### Async/Await

`async function getData()` marks a function as returning a promise. `await fetch(url)` pauses execution until the promise settles, then returns the resolved value. Use `try/catch` for error handling. Async/await is syntactic sugar over promises — understanding promises is still necessary.



## A1.8  The DOM (Awareness)

The DOM (Document Object Model) is a tree representation of an HTML page that JavaScript can read and modify. `document.querySelector("#id")` selects an element. `.addEventListener("click", handler)` attaches an event. `.textContent = "..."` modifies content.

In practice, React manages the DOM for you — you rarely manipulate it directly. But understanding that the DOM exists, what it is, and that React abstracts it is important for debugging and performance work.



## A1.9  JavaScript Quirks Worth Knowing

- **`NaN !== NaN`:** The only value not equal to itself. Use `Number.isNaN()`.

- **`0.1 + 0.2 !== 0.3`:** Floating-point precision. Use integer arithmetic for money.

- **`typeof null === "object"`:** Historical bug. Check for null explicitly.

- **Truthy/falsy:** `0`, `""`, `null`, `undefined`, `NaN`, and `false` are falsy. Everything else is truthy.

- **Optional chaining `?.`:** `user?.address?.city` returns undefined instead of throwing if any link is null/undefined.

- **Nullish coalescing `??`:** `value ?? "default"` — uses the right side only if left is `null` or `undefined` (unlike `||` which also triggers on `0` and `""`).




> **✅ EXIT CHECK**

- ✓ The difference between var, let, and const and why const is the default
- ✓ What a closure is and how it captures outer scope
- ✓ Why === is always used instead of ==
- ✓ How ES module import/export works
- ✓ The difference between a promise and async/await — and what async/await compiles to
- ✓ What map, filter, and reduce do
- ✓ What optional chaining and nullish coalescing do


---


---



# A2 — TypeScript

> 📦 **Block A — Shared Foundation**

*JavaScript with a safety net*

## Overview

TypeScript is a superset of JavaScript developed by Microsoft. Every valid JavaScript file is a valid TypeScript file. TypeScript adds a static type system that is checked at compile time and erased at runtime — the output is plain JavaScript. The type system catches entire categories of bugs before they can reach production and makes large codebases significantly easier to maintain.



## A2.1  Why TypeScript Exists

JavaScript's dynamic type system is a productivity asset when a codebase is small. As a project grows — more files, more developers, more time — the lack of types becomes a liability. "What does this function return?" requires reading the implementation. "What properties does this object have?" requires tracing the code. TypeScript makes these questions answerable at a glance.

TypeScript is now the industry standard for all new JavaScript projects above toy scale. All major frameworks (React, Next.js, TanStack, Expo) have first-class TypeScript support.



## A2.2  Basic Types

- **Primitives:** `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint` — same as JS but explicitly declared.

- **Arrays:** `string[]` or `Array<string>`

- **Tuples:** `[string, number]` — fixed-length array with specific types at each position.

- **`any`:** Opt out of type checking. Using `any` freely defeats the purpose of TypeScript. Treat it as a code smell.

- **`unknown`:** Like `any` but forces you to narrow the type before using it. The safe alternative.

- **`never`:** A value that can never occur. Used for exhaustive checks and unreachable code.

- **`void`:** A function that returns nothing. Distinct from returning `undefined`.



## A2.3  Interfaces and Type Aliases

### Interface

Defines the shape of an object. `interface User { id: number; name: string; email?: string }` — `?` makes a property optional. Interfaces can be extended: `interface Admin extends User { role: string }`. Interfaces are open — they can be declared multiple times and TypeScript merges the declarations.

### Type Alias

`type Point = { x: number; y: number }`. Type aliases can represent any type, not just objects — unions, intersections, primitives, tuples. `type ID = string | number` — a union type. Type aliases are closed — you cannot reopen and extend them.

### Interface vs Type

For objects, prefer `interface` — it is more extensible and has better error messages. Use `type` for unions, intersections, and non-object types. In practice, the distinction rarely matters for day-to-day work.



## A2.4  Generics

### What Generics Are

Generics allow writing code that works with any type, while still being type-safe. Without generics, a function that returns the first element of an array would need to accept `any[]` and return `any`. With generics: `function first<T>(arr: T[]): T` — the function is typed over T, which is inferred from the argument.

### Generic Constraints

`function getLength<T extends { length: number }>(item: T): number` — T can be any type that has a `length` property. This is a generic constraint. It prevents calling `getLength(42)` (number has no `length`) while allowing `getLength("hello")` and `getLength([1,2,3])`.

### Generics in React

React hooks are generic: `useState<User | null>(null)` tells TypeScript the state holds a `User` or `null`. `useRef<HTMLInputElement>(null)` types the ref. Understanding generics is essential for working fluently with typed React components.



## A2.5  Enums

Enums define a set of named constants. `enum Direction { Up, Down, Left, Right }` — values default to 0, 1, 2, 3. String enums: `enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }` — more readable in logs and APIs. Const enums are erased entirely at compile time for zero runtime overhead.

Enums have some footguns in TypeScript. A common pattern in modern TS is to use `as const` objects instead: `const Status = { Active: "ACTIVE", Inactive: "INACTIVE" } as const` — same result, no separate enum runtime object.



## A2.6  Utility Types

TypeScript ships with built-in utility types for common type transformations:

- **`Partial<T>`:** Makes all properties of T optional. Useful for update functions.

- **`Required<T>`:** Makes all properties required.

- **`Readonly<T>`:** Makes all properties read-only.

- **`Pick<T, K>`:** `Pick<User, "id" | "name">` — creates a type with only the listed keys.

- **`Omit<T, K>`:** Creates a type with the listed keys removed.

- **`Record<K, V>`:** `Record<string, number>` — an object with string keys and number values.

- **`ReturnType<T>`:** Extracts the return type of a function type.

- **`Parameters<T>`:** Extracts the parameter types of a function as a tuple.



## A2.7  tsconfig.json

The TypeScript compiler is configured via `tsconfig.json` in the project root. Key options:

- **`strict: true`:** Enables all strict type-checking options. Always enable this. It catches the most bugs.

- **`target`:** The JavaScript version to compile to (e.g. `"ES2020"`).

- **`moduleResolution`:** How imports are resolved. `"bundler"` is correct for Vite/Expo projects.

- **`paths`:** Module path aliases — `"@/*": ["./src/*"]` lets you write `import { X } from "@/components/X"` instead of relative paths.

- **`noEmit: true`:** Only type-check, do not produce output files. Used when a bundler (Vite) handles the build.



## A2.8  Type Narrowing

TypeScript tracks what type a value must be based on control flow. After `if (typeof value === "string")`, TypeScript knows `value` is a `string` inside that block. After `if (user === null) return`, TypeScript knows `user` is not null below the check.

Narrowing patterns: `typeof` checks, `instanceof` checks, truthiness checks, `in` operator checks (does object have property?), and discriminated unions (a union where each member has a common literal property that distinguishes them — TypeScript narrows based on which literal value it is).




> **✅ EXIT CHECK**

- ✓ Why TypeScript exists and what it adds over plain JavaScript
- ✓ The difference between interface and type alias — when to use each
- ✓ What a generic function is and how T is inferred
- ✓ What strict mode enables and why it should always be on
- ✓ How type narrowing works — what TypeScript knows after an if-check
- ✓ At least four utility types and what they produce
- ✓ What tsconfig.json controls and what the key options mean


---


---



# A3 — React Core

> 📦 **Block A — Shared Foundation**

*The component model — platform agnostic*

## Overview

React is a library for building user interfaces from components. It runs in browsers, in React Native mobile apps, and in server environments. This chapter covers the mental model and API that is identical across all platforms. Platform-specific rendering (the DOM for web, native views for mobile) is covered in the platform chapters.



## A3.1  The Component Model

### What a Component Is

A component is a function that takes props as input and returns a description of what to render. That description is JSX — a syntax extension that looks like HTML but is JavaScript. Components are the fundamental unit of UI in React.

`function Button({ label, onClick }) { return <button onClick={onClick}>{label}</button> }` — a complete React component. It is a function. It takes an object of props. It returns JSX.

### JSX

JSX is syntactic sugar. `<Button label="Click me" />` compiles to `React.createElement(Button, { label: "Click me" })`. Babel or the TypeScript compiler handles this transformation. JSX is not HTML — it is JavaScript that looks like HTML. Key differences: `className` not `class`, `htmlFor` not `for`, camelCase event handlers (`onClick` not `onclick`), expressions in `{}` not `{{}}`.

### Component Composition

Components compose: a component's JSX can include other components. A `Page` component renders a `Header`, a `Main`, and a `Footer`. Each of those renders their own children. This tree of components is the component tree. React renders the entire tree and produces the output.



## A3.2  Props

Props (properties) are how data flows from parent to child. A parent passes props; a child receives them as its first argument. Props are read-only — a component must not mutate its own props. Data flows one direction: down the component tree.

The `children` prop is special — it holds whatever JSX was placed between the opening and closing tags of the component. `<Card><p>Content</p></Card>` — inside Card, `props.children` is `<p>Content</p>`.



## A3.3  State — useState

`const [count, setCount] = useState(0)` — declares a state variable. `count` is the current value. `setCount` is the function to update it. Calling `setCount(newValue)` triggers a re-render — React calls the component function again with the new state value.

State is local to a component instance. Two instances of the same component have independent state. State must not be mutated directly — always use the setter function. For objects and arrays, create a new value rather than mutating the existing one: `setItems([...items, newItem])` not `items.push(newItem); setItems(items)`.



## A3.4  The Render Cycle

When state changes, React re-renders the component and its children. Re-rendering means calling the component function again — not destroying and recreating the DOM. React compares the new output to the previous output (a process called reconciliation) and applies only the minimum necessary changes.

Understanding that renders are frequent and cheap is fundamental. Components should be pure functions of their state and props — same input, same output, no side effects during render.



## A3.5  useEffect

`useEffect(() => { /* side effect */ }, [dependencies])` — runs after render when any dependency changes. Side effects (fetching data, setting up subscriptions, imperatively modifying the DOM) do not belong in the render function — they belong in useEffect.

### The Dependency Array

- **`[]` (empty):** Runs once after the first render. Used for setup that happens once.

- **`[value]`:** Runs after the first render and whenever `value` changes.

- **No array:** Runs after every render. Rarely what you want.

### Cleanup

Return a function from useEffect to clean up: `return () => subscription.unsubscribe()`. The cleanup runs before the next effect and when the component unmounts. Missing cleanup causes memory leaks and stale-closure bugs.



## A3.6  useContext

Context provides a way to pass data through the component tree without passing props at every level. Create a context: `const ThemeContext = createContext("light")`. Provide it: `<ThemeContext.Provider value="dark"><App /></ThemeContext.Provider>`. Consume it: `const theme = useContext(ThemeContext)`.

Context is not a state manager — it is a way to avoid prop drilling. When the context value changes, every component consuming it re-renders. For global app state, libraries like Zustand or React Query are more appropriate.



## A3.7  useRef

`const ref = useRef(initialValue)` — returns an object `{ current: value }`. Updating `ref.current` does not trigger a re-render. Two uses: persisting a mutable value across renders without triggering re-renders; holding a reference to a DOM element or native view.

`<input ref={inputRef} />` — after render, `inputRef.current` points to the actual DOM input element. This is how you imperatively focus an input, measure its size, or animate it.



## A3.8  useMemo and useCallback

`useMemo(() => expensiveCalculation(a, b), [a, b])` — caches the computed value and only recomputes when dependencies change. `useCallback(fn, [deps])` — caches the function itself. Both exist to prevent unnecessary re-renders of child components that use referential equality checks (`React.memo`).

Do not reach for these hooks preemptively. Premature optimisation is a real problem in React codebases full of unnecessary useMemo/useCallback calls. Profile first. Memoize second.



## A3.9  Custom Hooks

Any function that calls other hooks and has a name starting with `use` is a custom hook. Custom hooks are the mechanism for extracting and reusing stateful logic. `useWindowSize()`, `useDebounce(value, delay)`, `useLocalStorage(key, initialValue)` — encapsulate a concern, return what the component needs.



## A3.10  Error Boundaries

JavaScript errors during render crash the component tree. Error boundaries are class components (not hooks — this is one area where class components remain necessary) that catch errors in their children and display a fallback UI. Wrap sections of your app in error boundaries to prevent a single component crash from destroying the entire page.




> **✅ EXIT CHECK**

- ✓ What a React component is — a function that returns JSX
- ✓ How props flow — one direction, read-only
- ✓ What useState does and why direct mutation is wrong
- ✓ What useEffect is for and how the dependency array controls when it runs
- ✓ What useContext solves and what it does not replace
- ✓ What useRef is for and when to use it over useState
- ✓ When useMemo/useCallback are appropriate and when they are unnecessary
- ✓ What a custom hook is and why custom hooks exist


---


---



# A4 — Tooling

> 📦 **Block A — Shared Foundation**

*Node.js, npm, and the developer environment*

## Overview

Before writing a single React component, a developer needs a working local environment. This chapter covers the tooling layer: Node.js as a runtime, npm for managing packages, the package.json manifest, and the conventions around environment configuration that every project uses.

Git and Docker are covered in Part 1 Ch18 and Ch19. This chapter covers what is specific to the JavaScript ecosystem.



## A4.1  Node.js

Node.js is the V8 JavaScript engine (from Chrome) extracted from the browser and wrapped with APIs for file system access, networking, process management, and more. It is not a framework — it is a runtime. Running `node script.js` executes the script. Running `node` alone opens a REPL.

Node.js is used two ways in app development: as the runtime for build tools (Vite, webpack, the TypeScript compiler all run in Node.js), and as a server-side JavaScript runtime. Even if your application is a pure client-side app, you will use Node.js every day — every build tool, every package manager, every code generator runs in it.

### NVM — Managing Node Versions

Different projects require different Node versions. NVM (Node Version Manager) allows installing and switching between versions: `nvm install 20` installs Node 20, `nvm use 20` switches to it. The `.nvmrc` file in a project root specifies the required Node version — `nvm use` without arguments reads it.



## A4.2  npm — The Package Manager

npm ships with Node.js. It manages third-party packages — finding, downloading, versioning, and updating them.

- **`npm install`:** Reads `package.json` and installs all listed dependencies into `node_modules`.

- **`npm install [package]`:** Installs a package and adds it to `dependencies`.

- **`npm install -D [package]`:** Installs as a dev dependency (only needed during development/build, not at runtime).

- **`npm run [script]`:** Runs a script defined in the `scripts` section of `package.json`.

- **`npm uninstall [package]`:** Removes a package.

- **`npx [command]`:** Runs a package without installing it globally — useful for one-off code generators.

### Alternatives: pnpm and yarn

`pnpm` uses a shared content-addressable store — packages are stored once on disk and hard-linked into projects, saving disk space and speeding up installs. `yarn` (v1 and v4/Berry) offer workspace features and alternative resolution strategies. `pnpm` is increasingly preferred for monorepos. All three use `package.json` and are interchangeable for basic use.



## A4.3  package.json

`package.json` is the project manifest. Every npm project has one. Key fields:

- **`name`, `version`:** Project identifier and semver version.

- **`scripts`:** Named shell commands. `"dev": "vite"` means `npm run dev` runs the Vite dev server.

- **`dependencies`:** Packages required at runtime.

- **`devDependencies`:** Packages required only during development and build.

- **`type: "module"`:** Enables ES module syntax in `.js` files.

- **`engines`:** Specifies required Node.js/npm versions.



## A4.4  node_modules

`npm install` downloads packages into `node_modules/` in the project root. This directory is large (often hundreds of MB) and entirely reproducible from `package.json` + `package-lock.json`. It must always be in `.gitignore`. Never commit `node_modules`.

`node_modules` has a nested structure: a package's own dependencies live inside it. Modern npm uses a flat structure where possible to avoid duplication. The `package-lock.json` records the exact resolved version tree so that `npm install` on any machine produces an identical `node_modules`.



## A4.5  Environment Variables and .env

Environment-specific configuration — API keys, database URLs, feature flags — lives in environment variables, not in code. A `.env` file in the project root holds them locally:

`VITE_API_URL=https://api.example.com` — in Vite, variables prefixed with `VITE_` are exposed to the client bundle. Variables without the prefix are server-only. Expo uses `EXPO_PUBLIC_` as the client prefix.

`.env` must be in `.gitignore`. Create `.env.example` (no real secrets) as a template for new developers. Never commit real secrets to version control.

- **`.env`:** Local values, gitignored.

- **`.env.local`:** Local overrides (takes precedence).

- **`.env.production`:** Production values — some teams commit this if it contains only non-secret config.



## A4.6  The Development Environment

### What a Dev Server Does

Running `npm run dev` starts a local development server. It: serves the application at `http://localhost:3000` (or similar), watches for file changes and rebuilds, and hot-reloads the browser (HMR — Hot Module Replacement) so changes appear instantly without a full page refresh.

### VS Code Setup for JS/TS

Essential extensions: ESLint (linting), Prettier (formatting), TypeScript and JavaScript Language Features (built-in), GitLens (git blame inline). Configure format-on-save in settings. Use the workspace `.vscode/settings.json` to share team configuration.

### Linting and Formatting

ESLint statically analyses code for bugs and style issues. Prettier formats code automatically. They serve different purposes — ESLint catches real bugs and anti-patterns; Prettier enforces consistent whitespace and style. Configure them together: Prettier handles all formatting, ESLint handles everything else. The `eslint-config-prettier` package disables ESLint rules that conflict with Prettier.




> **✅ EXIT CHECK**

- ✓ What Node.js is and why it is used even for purely client-side apps
- ✓ The difference between dependencies and devDependencies
- ✓ What package-lock.json is for and why it should be committed
- ✓ Why node_modules must always be in .gitignore
- ✓ What .env files are for and the security rule around them
- ✓ What a dev server does — HMR and watching
- ✓ The difference between ESLint and Prettier and why both are needed


---


---



# B-Web1 — The Web Platform

> 📦 **Block B — Cross-Platform · Web Track**

*Browser, DOM, and the request lifecycle*

## Overview

React abstracts away the browser. But understanding what is underneath — how browsers request and render pages, what the DOM actually is, and the difference between rendering strategies — is essential for debugging, performance optimisation, and making architectural decisions.



## B-W1.1  How a Browser Renders a Page

When a browser navigates to a URL: DNS resolution maps the hostname to an IP. A TCP connection is established. A TLS handshake occurs (for HTTPS). The browser sends an HTTP GET request. The server responds with HTML. The browser parses the HTML, builds the DOM tree, requests referenced CSS and JavaScript, parses CSS into the CSSOM, combines DOM + CSSOM into the render tree, calculates layout (position and size of every element), and paints pixels to screen.

JavaScript blocks parsing — when the parser encounters a `<script>` tag, it stops, downloads, and executes the script before continuing. This is why `<script>` tags traditionally go at the bottom of `<body>`, and why the `defer` and `async` attributes exist.



## B-W1.2  CSR vs SSR vs SSG vs ISR

- **CSR (Client-Side Rendering):** The server sends a minimal HTML shell. The browser downloads JavaScript, executes it, and React builds the page in the browser. Initial load is slow (blank page until JS runs). Subsequent navigation is fast (React handles it without a server round-trip). Traditional Create React App approach.

- **SSR (Server-Side Rendering):** The server runs React, produces full HTML, and sends it to the browser. The browser displays content immediately. JavaScript then "hydrates" — attaches event handlers to the server-rendered HTML. First paint is fast. Requires a server.

- **SSG (Static Site Generation):** Pages are pre-rendered to HTML at build time. No server needed — serve from a CDN. Fastest possible TTFB. Content is static until the next build.

- **ISR (Incremental Static Regeneration):** SSG but individual pages can be revalidated and regenerated after deployment without a full rebuild.



## B-W1.3  The URL and Routing

A URL has structure: `scheme://host:port/path?query#fragment`. Routing in a web app maps URL paths to components. Two modes: hash routing (`#/about` — the fragment, never sent to the server) and history routing (`/about` — uses the browser's History API, requires server configuration to handle directly-accessed routes). Modern apps use history routing.



## B-W1.4  Local Storage, Session Storage, Cookies

- **`localStorage`:** Persists across sessions. Same origin only. Max ~5MB. Synchronous API — blocks the main thread for large reads/writes. Suitable for user preferences. Not suitable for sensitive data (accessible by any JS on the page).

- **`sessionStorage`:** Cleared when the tab closes. Otherwise same as localStorage.

- **Cookies:** Sent with every HTTP request to the server. Can be `HttpOnly` (not accessible by JS — prevents XSS theft), `Secure` (HTTPS only), `SameSite` (CSRF protection). The correct storage for auth tokens — an HttpOnly cookie containing a session token is more secure than localStorage.



## B-W1.5  Web Performance Basics

- **Core Web Vitals:** Google's performance metrics: LCP (Largest Contentful Paint — time until main content loads), CLS (Cumulative Layout Shift — visual stability), INP (Interaction to Next Paint — responsiveness).

- **Lazy loading:** Loading resources only when needed. `React.lazy(() => import("./HeavyComponent"))` splits the component into a separate chunk loaded on demand.

- **Code splitting:** The bundler produces multiple JS files (chunks). The main bundle is kept small; less-used features are loaded on demand.

- **Caching:** Browsers cache static assets. Content-addressed filenames (including a hash of the content) enable long cache times — if the content changes, the filename changes.




> **✅ EXIT CHECK**

- ✓ The steps a browser takes from URL entry to pixels on screen
- ✓ The difference between CSR, SSR, and SSG — when each is appropriate
- ✓ Why HttpOnly cookies are more secure than localStorage for auth tokens
- ✓ What code splitting is and how React.lazy enables it
- ✓ What the three Core Web Vitals measure


---


---



# B-Web2 — Vite + React + TypeScript

> 📦 **Block B — Cross-Platform · Web Track**

*The modern web application stack*

## Overview

Vite is the build tool. React is the UI library. TypeScript is the type system. Together they form the standard stack for modern web application development. This chapter covers the project structure, the build pipeline, routing, styling, and deployment.



## B-W2.1  Vite

Vite (French for "fast") was created by Evan You (Vue's creator) to address the slow startup times of webpack-based tooling. In development, Vite serves files using native ES module imports — no bundling step. The browser requests each file as needed; Vite transforms only what is requested. Result: near-instant dev server startup regardless of project size.

For production builds, Vite uses Rollup under the hood — a highly optimised bundler. The development and production pipelines use different strategies, but both produce correct output.

### Creating a Project

`npm create vite@latest my-app -- --template react-ts` scaffolds a React + TypeScript project. The resulting structure: `src/` for source files, `public/` for static assets, `index.html` (the entry point), `vite.config.ts` (Vite configuration), `tsconfig.json`.



## B-W2.2  Project Structure

A typical Vite + React + TypeScript project:

- `src/components/` — reusable UI components

- `src/pages/` or `src/routes/` — page-level components

- `src/hooks/` — custom hooks

- `src/lib/` or `src/utils/` — utility functions

- `src/types/` — shared TypeScript types

- `src/api/` or `src/services/` — API call functions

Structure is not enforced by the tools — these are conventions. The key principle: group by feature or layer, keep related code together, avoid deep nesting.



## B-W2.3  Client-Side Routing with React Router

React Router is the standard routing library for React web apps. `BrowserRouter` wraps the app and provides routing context. `Routes` contains route definitions. `Route path="/about" element={<About />}` maps a path to a component. `Link to="/about"` creates a navigation link without a page reload. `useNavigate()` provides programmatic navigation. `useParams()` reads URL parameters.



## B-W2.4  Styling

- **Tailwind CSS:** A utility-first CSS framework. Instead of writing CSS files, you compose utility classes directly in JSX: `className="flex items-center gap-4 p-6 bg-white rounded-lg shadow"`. Tailwind generates only the CSS classes that are used. Best choice for most new projects.

- **CSS Modules:** `.module.css` files with locally-scoped class names. `import styles from "./Button.module.css"` then `className={styles.button}`. Avoids class name collisions. Good when component-scoped styles are preferred.

- **Styled Components / Emotion:** CSS-in-JS libraries. Styles are written in tagged template literals co-located with the component. Powerful but adds runtime overhead.



## B-W2.5  Data Fetching

Direct use of `useEffect` + `fetch` for data fetching is an anti-pattern in large apps — it requires manual loading/error state management, has no caching, and doesn't handle race conditions. TanStack Query (formerly React Query) is the standard solution.

`useQuery({ queryKey: ["users"], queryFn: fetchUsers })` — fetches data, caches the result, handles loading and error states, re-fetches when data becomes stale, and deduplicates concurrent requests for the same data. `useMutation` handles writes and optimistic updates.



## B-W2.6  Forms

Forms in React involve controlled inputs (`value` bound to state), validation, and submission. `react-hook-form` is the standard library: minimal re-renders (uses uncontrolled inputs internally), schema validation via `zod` integration, simple API. `zod` defines a schema that validates data structure and types — the same schema can validate both the form and the API response.



## B-W2.7  Vite Config

`vite.config.ts` configures Vite. Key options:

- **`plugins`:** Extend Vite. `@vitejs/plugin-react` enables React, JSX transform, and Fast Refresh.

- **`resolve.alias`:** Path aliases — `"@": path.resolve(__dirname, "./src")` enables `import X from "@/components/X"`.

- **`server.proxy`:** Proxy API requests during development to avoid CORS issues.

- **`build.outDir`:** Where the production build is written (default: `dist/`).



## B-W2.8  Deployment

A Vite build produces a `dist/` directory containing `index.html` and static assets. This directory can be served by any static file server, CDN, or hosting platform.

Vercel: `vercel` CLI or GitHub integration, zero configuration for Vite projects. Netlify: same. Cloudflare Pages: same with a global edge CDN. All three auto-detect Vite and configure the build command and output directory.



## B-W2.9  When Vite vs TanStack Start

Vite + React is a client-side rendering (CSR) stack. It is appropriate when: SEO is not a concern (authenticated dashboards, internal tools), the data is user-specific (no shared cache), or you want maximum deployment simplicity (static files only).

TanStack Start adds server-side rendering, file-based routing, and server functions. Use it when: SEO matters, initial page load speed is critical, or you need a full-stack solution with server functions co-located with routes.




> **✅ EXIT CHECK**

- ✓ What Vite does differently in dev vs production
- ✓ The difference between CSR (Vite default) and SSR (TanStack Start)
- ✓ What Tailwind's utility-first approach means in practice
- ✓ Why useEffect + fetch is an anti-pattern and what TanStack Query solves
- ✓ What zod does and how it integrates with react-hook-form
- ✓ When to choose Vite alone vs TanStack Start


---


---



# B-Web3 — TanStack Start

> 📦 **Block B — Cross-Platform · Web Track**

*Full-stack React with file-based routing*

## Overview

TanStack Start is a full-stack React framework built by Tanner Linsley and the TanStack team. It combines file-based routing, server-side rendering, and server functions with TanStack Query's powerful data management. It is the modern alternative to Next.js for developers who want a React-first, TypeScript-first, and vendor-neutral full-stack solution.



## B-W3.1  File-Based Routing

In TanStack Start, the file system is the router. Files in `src/routes/` define routes. `index.tsx` → `/`. `about.tsx` → `/about`. `posts/$id.tsx` → `/posts/:id` (dynamic segment). `_layout.tsx` → a layout component wrapping child routes. Route groups `(groupName)/` organise files without affecting the URL.

Each route file exports a `Route` created with `createFileRoute`. The route can define loaders (server-side data fetching), actions (mutations), and the component to render.



## B-W3.2  Loaders

Loaders run on the server before the page renders. They fetch data and return it to the component. The component receives the data already resolved — no loading state needed on initial render.

`export const Route = createFileRoute("/posts/$id")({ loader: async ({ params }) => { return fetchPost(params.id) }, component: PostPage })` — the loader fetches the post, PostPage receives it via `Route.useLoaderData()`.



## B-W3.3  Server Functions

Server functions allow writing server-side logic co-located with the client code. A function marked with `createServerFn` runs on the server when called, even though it is invoked from the client. It can access databases, call private APIs, and read server-side environment variables.

This replaces the need for a separate API layer for many use cases. The function call looks like a regular async function call; the framework handles the HTTP round-trip transparently.



## B-W3.4  TanStack Query Integration

TanStack Start is built to work with TanStack Query. Loaders can pre-populate the query cache. Client-side navigation re-uses cached data. Mutations invalidate the relevant queries. The result: fast initial loads (SSR from loaders) plus snappy client-side navigation (client-side query cache).



## B-W3.5  Streaming and Suspense

TanStack Start supports React's Suspense and streaming. Parts of the page can be deferred — the server sends the page shell immediately and streams in the deferred parts as they resolve. This improves perceived performance: the user sees content instantly rather than waiting for the slowest data.



## B-W3.6  TanStack Start vs Next.js

Next.js is the dominant React full-stack framework and is heavily used in the industry. TanStack Start is newer and takes a different approach.

- **Routing:** Both use file-based routing. Next.js uses the App Router (server components by default). TanStack Start uses client components by default with opt-in server execution via server functions.

- **Mental model:** Next.js blends client and server components in the same tree (RSC). TanStack Start has a clearer server/client boundary.

- **Vendor lock-in:** Next.js is developed by Vercel and is tightly integrated with Vercel's platform. TanStack Start is framework-agnostic.

- **When to choose Next.js:** When joining an existing team using it, or when React Server Components are a requirement.

- **When to choose TanStack Start:** New projects where you want full control, type-safe routing, and framework-agnostic deployment.




> **✅ EXIT CHECK**

- ✓ How file-based routing works — file names to URL paths
- ✓ What a loader does and when it runs
- ✓ What a server function is and what it replaces
- ✓ How TanStack Query integrates with SSR loaders
- ✓ The key difference between TanStack Start and Next.js in mental model


---


---



# B-Mob1 — React Native Core

> 📦 **Block B — Cross-Platform · Mobile Track**

*Building mobile UIs with React*

## Overview

React Native allows building native mobile apps using React and JavaScript. It is not a webview wrapper — it renders to real native views on iOS and Android. The programming model is React: components, props, state, hooks. The rendering target is different: instead of a browser DOM, React Native talks to a native thread that renders platform-native UI components.



## B-M1.1  How React Native Works

React Native has three threads: the JS thread (where your code runs), the native/UI thread (where the platform renders views), and the shadow thread (calculates layout using Yoga — a cross-platform flexbox implementation). The JS thread and native thread communicate via a bridge — or, in the new architecture, via JSI (JavaScript Interface), which is a direct C++ binding that removes the asynchronous bridge overhead.

When you write `<View>`, React Native maps it to `UIView` on iOS and `android.view.View` on Android. When you write `<Text>`, it maps to `UILabel`/`UITextView` and `TextView`. The JavaScript is the same; the rendered output is platform-native.



## B-M1.2  Core Components

React Native has no `div`, `p`, `h1`, or other HTML elements. The core primitives:

- **`View`:** The fundamental layout container. Maps to UIView / android.view.View. Used for any structural/layout purpose.

- **`Text`:** All text must be inside a Text component. Supports styling, nesting, and press events.

- **`Image`:** Renders images. Takes a `source` prop: `{ uri: "https://..." }` for remote, `require("./image.png")` for local.

- **`ScrollView`:** A scrollable container. Renders all children immediately — not virtualised. Suitable for small, bounded content.

- **`FlatList`:** A virtualised list — renders only the items currently visible. Mandatory for any list that could be long. Accepts `data` and `renderItem` props.

- **`TextInput`:** The mobile equivalent of `<input>`. Has `value`, `onChangeText`, `onSubmitEditing`, `keyboardType`, and many other props.

- **`Pressable`:** A flexible touch handler. Replaces the older `TouchableOpacity` / `TouchableHighlight`. Supports press, long press, and provides a pressed state for styling feedback.



## B-M1.3  Styling in React Native

React Native uses `StyleSheet.create({})` to define styles as JavaScript objects. Properties are camelCase equivalents of CSS: `backgroundColor`, `marginTop`, `fontSize`. Not all CSS properties exist. No cascading — styles must be applied to each element explicitly.

Flexbox is the only layout model. It works nearly identically to CSS flexbox, with one important default difference: `flexDirection` defaults to `"column"` in React Native (not `"row"` as in CSS). Everything in a React Native layout is a flex container.



## B-M1.4  Navigation

React Navigation is the standard navigation library. It provides stack navigation (push/pop — like iOS navigation), tab navigation (bottom tabs), and drawer navigation. Navigation state is managed by the library.

Each screen is a React component registered with the navigator. `navigation.navigate("Profile", { userId: 42 })` navigates to a screen and passes params. `route.params.userId` reads them.



## B-M1.5  Platform-Specific Code

`Platform.OS` returns `"ios"` or `"android"`. Use it for conditional logic: `Platform.OS === "ios" ? <IOSComponent /> : <AndroidComponent />`. For entire component variants, use platform-specific file extensions: `Button.ios.tsx` and `Button.android.tsx` — React Native automatically imports the correct one.

`Platform.select({ ios: iosValue, android: androidValue, default: defaultValue })` is the clean API for platform-conditional values in StyleSheets and props.



## B-M1.6  Gestures and Animations

`react-native-gesture-handler` provides high-performance gesture recognition that runs on the native thread (not the JS thread). `react-native-reanimated` provides animations that also run on the native/UI thread — smooth 60fps animations even when the JS thread is busy. Both libraries are standard requirements in Expo projects and are included in Expo's default template.




> **✅ EXIT CHECK**

- ✓ How React Native renders — three threads and what each does
- ✓ The core primitive components and what each maps to natively
- ✓ Why FlatList is required for long lists instead of mapping inside ScrollView
- ✓ How styling differs from CSS — no cascade, flexColumn default
- ✓ How to write platform-specific code using Platform.OS and file extensions


---


---



# B-Mob2 — Expo + Expo Router

> 📦 **Block B — Cross-Platform · Mobile Track**

*The managed React Native workflow*

## Overview

Expo is a platform built on top of React Native that handles the native build infrastructure, provides a large SDK of pre-built native modules, and offers a managed workflow that removes most of the need to write native iOS/Android code. Expo Router adds file-based routing — the same mental model as TanStack Start, applied to mobile.



## B-M2.1  Expo SDK

The Expo SDK is a collection of React Native modules maintained by the Expo team. It covers the most common native needs: camera, location, notifications, filesystem, calendar, contacts, sensors, secure storage, image picker, audio/video, and many more. Using Expo SDK modules means: no manual native module linking, consistent API across iOS and Android, reliable updates.

### Bare vs Managed Workflow

The managed workflow: Expo manages the native layer entirely. No Xcode project or Android Studio project in the repository. Expo builds the native app for you. Limitations: can only use modules in the Expo SDK or those that support Expo.

The bare workflow: a standard React Native project with an `ios/` and `android/` directory checked into the repo. Full access to native code. Can use any native module. Most new projects start managed and switch to bare only if a native module outside the SDK is required.

Config plugins (introduced in Expo SDK 41) allow most native customisations to be applied to the managed workflow without ejecting — bridging the gap significantly.



## B-M2.2  Expo Router

Expo Router brings file-based routing to React Native. Files in `app/` define routes. `app/index.tsx` → the root screen. `app/profile/[id].tsx` → `/profile/:id`. `app/(tabs)/` → a tab navigator. `app/_layout.tsx` → a layout wrapping the route group.

Expo Router is built on React Navigation under the hood. It handles deep linking automatically — every route is automatically a deep link. It supports web (the same file structure works for a web build via `expo export --platform web`).



## B-M2.3  Expo Go vs Dev Builds

Expo Go is a pre-built app on the App Store and Play Store. During development, you scan a QR code and your app loads inside Expo Go. It is the fastest way to start but has a limitation: Expo Go contains a fixed set of native modules. If your app needs a module not in Expo Go (e.g. Stripe, RevenueCat, custom native modules), you need a dev build.

A development build is a custom version of Expo Go that includes your app's specific native dependencies. Created via EAS Build (`eas build --profile development`). Installed on device like a beta app. After that, the workflow is the same as Expo Go — scan, load, iterate — but with your full dependency set.



## B-M2.4  app.json / app.config.js

`app.json` is the Expo configuration manifest. Key fields: `name` and `slug` (project identifier), `version` and `buildNumber`/`versionCode`, `icon` and `splash` (app icon and launch screen), `ios.bundleIdentifier` (e.g. `com.company.appname`), `android.package`, `plugins` (config plugins for native configuration), `extra` (values accessible via `Constants.expoConfig.extra`).

`app.config.js` allows dynamic configuration — using environment variables, computing values, or switching config based on environment. Preferred over static `app.json` for anything beyond trivial projects.




> **✅ EXIT CHECK**

- ✓ What the Expo SDK provides and why it simplifies React Native development
- ✓ The difference between managed and bare workflow — when to switch
- ✓ How Expo Router file structure maps to navigation structure
- ✓ Why Expo Go has limitations and what a dev build solves
- ✓ What app.json controls and the key fields every project needs


---


---



# B-Mob3 — EAS + Distribution

> 📦 **Block B — Cross-Platform · Mobile Track**

*Building, signing, and shipping to the stores*

## Overview

Writing the app is one step. Getting it onto users' devices requires building native binaries, signing them with certificates, and navigating the App Store and Play Store submission processes. EAS (Expo Application Services) automates most of this. This chapter covers the full lifecycle from local development to store release.



## B-M3.1  Code Signing

### iOS

Apple requires all iOS apps — including development builds on physical devices — to be signed with a cryptographic certificate issued by Apple. Signing involves: a Distribution Certificate (proves the build came from you), a Provisioning Profile (links the certificate to specific App IDs and devices), and an App ID (the bundle identifier, e.g. `com.company.appname`).

EAS handles signing automatically: `eas credentials` manages your certificates and profiles. On the first build, EAS can create them for you. For manual control, you can supply your own via `credentials.json`.

### Android

Android apps are signed with a keystore — a file containing a private key. The same keystore must sign every update. Losing the keystore means you cannot update your app — you would have to publish as a new app. Store the keystore securely and back it up. EAS can manage the keystore for you (recommended for simplicity) or you can supply your own.

Google Play App Signing: Google can manage the final signing key (different from the upload key). This protects you from keystore loss — even if you lose your upload key, Google holds the signing key and can provide a new upload key.



## B-M3.2  EAS Build

`eas build --platform ios --profile production` submits a cloud build. EAS runs the build on Expo's infrastructure — no Xcode or Android Studio required locally. The build runs on a Mac (for iOS) or Linux (for Android) in the cloud.

Build profiles in `eas.json`: `development` (debug build, dev client, internal distribution), `preview` (release build, internal distribution, no store submission), `production` (release build, for store submission).

- **`--platform ios`:** Builds an `.ipa` file.

- **`--platform android`:** Builds an `.apk` (for direct install) or `.aab` (Android App Bundle, for Play Store).

- **`--platform all`:** Builds both simultaneously.



## B-M3.3  Internal Distribution

Before submitting to the stores, distribute to testers. iOS: TestFlight (Apple's official beta platform — up to 10,000 testers, requires App Store Connect setup). Android: Internal App Sharing or the Play Console internal track.

EAS: `eas build --profile preview` creates a build for internal distribution. `eas submit` submits to TestFlight or Play Store automatically.



## B-M3.4  Store Submission

iOS App Store: Requires an Apple Developer Program account ($99/year). App Store Connect setup (app record, app info, screenshots, description, privacy policy, review notes). `eas submit --platform ios` handles the binary upload. Apple review takes 24–48 hours on average (can be faster or much longer).

Google Play Store: Requires a Google Play Developer account ($25 one-time). Google Play Console setup. `eas submit --platform android` handles the upload. Google review is typically faster than Apple.



## B-M3.5  OTA Updates (Over-the-Air)

Native builds are slow — resubmitting to the stores for every change takes hours to days. OTA updates allow pushing JavaScript changes directly to users without a new store build. `eas update --branch production --message "Fix login bug"` pushes a new bundle. Users get the update next time they open the app.

Limitation: OTA updates can only change JavaScript and assets. Any change that requires new native code (adding a new SDK module, updating native dependencies) requires a new native build and store submission.




> **✅ EXIT CHECK**

- ✓ What code signing is and why Apple and Google require it
- ✓ The three standard EAS build profiles and what each produces
- ✓ The difference between TestFlight and the public App Store
- ✓ What OTA updates can and cannot change
- ✓ Why Google Play App Signing protects against keystore loss


---


---



# B-Mob4 — Push Notifications

> 📦 **Block B — Cross-Platform · Mobile Track**

*Reaching users when the app is closed*

## Overview

Push notifications are one of mobile's most powerful engagement tools — and one of its most abused. This chapter covers the technical infrastructure: how notifications flow from your server to a device, how to request permission, and how to handle notification interactions.



## B-M4.1  The Infrastructure

A push notification originates from your server. It travels through a platform-specific intermediary (APNs for iOS — Apple Push Notification service; FCM for Android — Firebase Cloud Messaging) to the device. Your server cannot deliver notifications directly to a device — it must go through Apple or Google's infrastructure.

The flow: 1) App requests notification permission from the user. 2) If granted, the OS generates a push token — a unique identifier for this app on this device. 3) Your app sends this token to your backend. 4) Your backend stores the token. 5) When a notification should be sent, your backend sends a request to APNs/FCM with the token and message payload. 6) APNs/FCM delivers to the device.



## B-M4.2  Expo Notifications

`expo-notifications` wraps APNs and FCM behind a single API. It also provides Expo Push Service — a proxy that translates Expo push tokens into APNs/FCM calls, so you don't need to manage APNs certificates or FCM credentials on your server directly.

`Notifications.requestPermissionsAsync()` — prompts the user for permission. Returns whether permission was granted. On iOS, this dialog appears only once — if the user denies, they must manually re-enable in Settings. Design this moment carefully.

`Notifications.getExpoPushTokenAsync()` — returns the Expo push token. Send this to your backend to store against the user.



## B-M4.3  Handling Notifications

- **Foreground:** `Notifications.addNotificationReceivedListener` — fired when a notification arrives while the app is open. By default, notifications do not display a banner when the app is foreground; you must handle and display them yourself.

- **Background/quit:** The OS displays the notification. When the user taps it, the app opens. `Notifications.addNotificationResponseReceivedListener` fires with the notification data — use this to navigate to the relevant content.

### Notification Channels (Android)

Android 8+ requires notifications to be assigned to a channel (a category with configurable importance level, sound, and vibration). Create channels before sending: `Notifications.setNotificationChannelAsync("messages", { name: "Messages", importance: Notifications.AndroidImportance.MAX })`.



## B-M4.4  Permission UX

The timing and framing of the permission request determines whether users grant it. Best practices: ask in context (after a user action that makes the value clear, not on first launch), explain the value before the system prompt appears ("We'll notify you when someone messages you"), and have a fallback for denied permission (a settings link).

On iOS, the permission prompt is a native system dialog that you cannot customise. On Android 13+, a runtime permission is also required. The user's answer is permanent — a denied permission requires a settings change.




> **✅ EXIT CHECK**

- ✓ The full path of a push notification from your server to the device
- ✓ What APNs and FCM are and why your server cannot bypass them
- ✓ What an Expo push token is and where it needs to be stored
- ✓ The difference between foreground and background notification handling
- ✓ What notification channels are and why Android requires them
- ✓ Why the timing of the permission request is critical on iOS


---


---



# B-Desktop1 — Electron + React

> 📦 **Block B — Cross-Platform · Desktop Track**

*Cross-platform desktop apps with web technology*

## Overview

Electron allows building desktop apps for Windows, macOS, and Linux using web technologies. It embeds a Chromium browser and a Node.js runtime. Your React app runs as a web page inside Chromium. Node.js gives it access to the operating system — files, processes, native dialogs, tray icons.



## B-D1.1  The Architecture

Electron has two processes:

- **Main process:** Node.js. Manages the application lifecycle, creates browser windows, accesses OS APIs (filesystem, notifications, menus, tray). One main process per application.

- **Renderer process:** A Chromium browser window. Runs your React app. Sandboxed — limited OS access by default for security. One renderer per window.

IPC (Inter-Process Communication) connects them. The renderer sends messages to the main process to request OS operations. `ipcRenderer.invoke("read-file", path)` → main process handles it and returns the result. This architecture enforces a security boundary: the renderer cannot directly access the filesystem; it must ask the main process.



## B-D1.2  Creating an Electron + React Project

`electron-vite` is the recommended scaffolding tool. It configures Vite for both the main process and renderer, with separate entry points and configs. The project structure: `src/main/` (main process code), `src/preload/` (preload scripts — a bridge between renderer and main), `src/renderer/` (React app).



## B-D1.3  Preload Scripts and Context Bridge

The preload script runs in the renderer's context but has access to Node.js APIs. It is the safe bridge. `contextBridge.exposeInMainWorld("electronAPI", { readFile: (path) => ipcRenderer.invoke("read-file", path) })` — exposes specific, controlled functions to the renderer. The renderer calls `window.electronAPI.readFile(path)`. This avoids exposing the full Node.js API to the renderer.



## B-D1.4  Packaging and Distribution

`electron-builder` packages the app for distribution. It produces: a `.dmg` for macOS, an `.exe` installer for Windows, a `.AppImage`/`.deb` for Linux. Code signing is required for macOS (Apple Gatekeeper will block unsigned apps) and strongly recommended for Windows.

### Auto-Updates

`electron-updater` (part of electron-builder) provides auto-update functionality. The app checks a server for updates on startup. If a newer version is available, it downloads and installs it. For a free update server, GitHub Releases works out of the box.



## B-D1.5  When Electron vs Tauri

Tauri is an alternative desktop framework using the OS's native webview (WebKit on macOS, WebView2 on Windows) instead of embedding Chromium, and Rust for the backend instead of Node.js. This produces much smaller binaries (~10MB vs ~150MB for a minimal Electron app) and lower memory usage.

Choose Electron when: you need consistent rendering across all platforms (Chromium guarantees this), your team is JavaScript-only (no Rust), or you need specific Electron ecosystem features. Choose Tauri when: binary size matters, Rust expertise is available, or memory usage is a constraint.




> **✅ EXIT CHECK**

- ✓ The difference between the main process and renderer process
- ✓ What IPC is and why it is necessary
- ✓ What a preload script does and why the context bridge exists
- ✓ What electron-builder produces for each platform
- ✓ The key tradeoffs between Electron and Tauri


---


---



# C-iOS1 — Swift Foundations

> 📦 **Block C — Native · iOS/macOS Track**

*The language of Apple platforms*

## Overview

Swift was introduced by Apple in 2014 to replace Objective-C. It is statically typed, compiled to native code, and designed for safety. It is the primary language for iOS, macOS, watchOS, and tvOS development.



## C-i1.1  Value vs Reference Types

Swift's type system has a fundamental distinction. Structs and enums are value types — assigned by copy. When you assign a struct to a variable or pass it to a function, a new independent copy is made. Classes are reference types — assigned by reference. Multiple variables can point to the same instance.

Swift strongly prefers value types. Most types in the Swift standard library are structs (including Array, Dictionary, String). Value types are thread-safe by default — each thread works with its own copy. SwiftUI uses value types (structs) for views, which is central to its performance model.



## C-i1.2  Optionals

A key Swift safety feature: a variable cannot be `nil` unless explicitly declared optional. `var name: String` — cannot be nil. `var name: String?` — can be nil. This forces the programmer to handle the nil case explicitly, eliminating null pointer crashes at compile time.

- **Optional binding:** `if let name = optionalName { ... }` — safely unwraps if not nil.

- **Guard let:** `guard let name = optionalName else { return }` — unwraps or exits early. Preferred pattern for precondition checks.

- **Optional chaining:** `user?.address?.street` — returns nil if any link is nil.

- **Nil coalescing:** `name ?? "Anonymous"` — provides a default if nil.

- **Force unwrap:** `name!` — crashes if nil. Avoid except when nil is truly impossible and you want to catch programming errors.



## C-i1.3  Closures

Closures in Swift are self-contained blocks of code that can capture and store references to variables from their surrounding context. Syntax: `{ (parameter: Type) -> ReturnType in ... }`. Trailing closure syntax: when the last argument is a closure, it can be written outside the parentheses. Swift also infers types and allows shorthand argument names `$0`, `$1`.

Closures are used heavily for completion handlers, sorting, map/filter/reduce, and SwiftUI's view builder DSL.



## C-i1.4  Protocols

A protocol defines a blueprint of methods, properties, and requirements. A type "adopts" a protocol and must implement its requirements. Protocols are how Swift achieves polymorphism without inheritance. Protocol-oriented programming is idiomatic Swift — prefer protocols over class inheritance.

`Codable` (= `Encodable & Decodable`) is a protocol for JSON serialisation. Conforming a struct to `Codable` gives it automatic JSON encode/decode ability. This is how Swift apps talk to REST APIs.



## C-i1.5  Error Handling

Swift uses typed errors. `enum NetworkError: Error { case notFound, unauthorized }`. Functions that can throw are marked `throws`. Calling them requires `try`. Errors are caught with `do { try ... } catch { }`. Unlike exceptions in many languages, Swift errors are checked — you must handle them.



## C-i1.6  Concurrency — async/await

Swift 5.5 introduced structured concurrency. `async` marks a function that can suspend. `await` suspends execution until the async function returns. `Task { }` creates a concurrent task. `async let` allows concurrent execution of multiple async operations with `await` to collect results. `@MainActor` ensures code runs on the main thread — required for UI updates.




> **✅ EXIT CHECK**

- ✓ The difference between value types and reference types in Swift
- ✓ What an optional is and four ways to unwrap one safely
- ✓ What a protocol is and why Swift prefers protocols over inheritance
- ✓ What Codable provides and how it enables JSON serialisation
- ✓ How Swift's error handling differs from exceptions in other languages
- ✓ How async/await works in Swift and what @MainActor is for


---


---



# C-iOS2 — SwiftUI

> 📦 **Block C — Native · iOS/macOS Track**

*Declarative UI for Apple platforms*

## Overview

SwiftUI is Apple's declarative UI framework, introduced in 2019. Views are described as a function of state — when state changes, SwiftUI re-renders the affected parts of the UI. The mental model is similar to React: data flows down, events flow up.



## C-i2.1  Views and Modifiers

Every UI element in SwiftUI is a `View`. Views are structs with a `body` property returning another view. `Text("Hello")`, `Image("logo")`, `Button("Tap me") { }` are all views. Modifiers transform views: `.font(.headline)`, `.padding()`, `.foregroundColor(.blue)`, `.frame(width: 100)`. Modifiers return new views — they do not mutate.

Views compose: `VStack { Text("Title"); Text("Subtitle") }` stacks two text views vertically. `HStack` is horizontal. `ZStack` is layered. `List`, `ScrollView`, `LazyVGrid` are container views for more complex layouts.



## C-i2.2  State and Binding

- **`@State`:** A source of truth local to the view. `@State private var count = 0`. Changing it triggers a re-render. Must be private — not passed in from outside.

- **`@Binding`:** A two-way reference to state owned by a parent. The child can read and write the value. The parent declares `@State`; the child accepts `@Binding`.

- **`@StateObject`:** A reference type (class conforming to `ObservableObject`) owned by the view. The view creates and owns it.

- **`@ObservedObject`:** A reference to an `ObservableObject` owned and passed in from outside. The view observes changes.

- **`@EnvironmentObject`:** An observable object injected into the environment — accessible by any descendant view without explicit prop passing. SwiftUI's equivalent of React Context.

### Observation framework (Swift 5.9+)

`@Observable` macro (iOS 17+) replaces `ObservableObject`/`@Published` with a simpler model. Views automatically track which properties they access and re-render only when those change.



## C-i2.3  Navigation

- **`NavigationStack`:** A stack-based navigator. Push views with `NavigationLink`. `navigationDestination` maps values to destination views. Deep-link support via `.navigationPath`.

- **`TabView`:** A bottom tab bar. Each tab is a view with a `.tabItem` modifier.

- **`.sheet()` and `.fullScreenCover()`:** Present modal views.



## C-i2.4  Previews

`#Preview { MyView() }` — Xcode renders a live preview of the view in the canvas without running the app. Preview providers support multiple variants: different device sizes, dark/light mode, accessibility text sizes. Previews dramatically speed up UI iteration.



## C-i2.5  UIKit Interoperability

SwiftUI cannot do everything — some UIKit components have no SwiftUI equivalent yet. `UIViewRepresentable` wraps a UIKit view for use in SwiftUI. `UIViewControllerRepresentable` wraps a view controller. This is how you use `WKWebView`, `MKMapView`, `UIImagePickerController`, and other UIKit components from SwiftUI.




> **✅ EXIT CHECK**

- ✓ How SwiftUI's declarative model works — views as a function of state
- ✓ The difference between @State, @Binding, @StateObject, and @ObservedObject
- ✓ How NavigationStack works and how to push/pop views
- ✓ What UIViewRepresentable is for and when it is needed
- ✓ How Previews work and why they speed up development


---


---



# C-iOS3 — iOS App Specifics

> 📦 **Block C — Native · iOS/macOS Track**

*App lifecycle, frameworks, and the App Store*

## Overview

SwiftUI abstracts much of the iOS platform. But understanding the underlying lifecycle, frameworks, and distribution requirements is essential for anything beyond basic apps.



## C-i3.1  UIKit Context

UIKit is the original iOS UI framework (2007). SwiftUI is built on top of it. An iOS app still has a `UIApplication`, `UIWindowScene`, `UIViewController` hierarchy underneath every SwiftUI view. Understanding this helps when debugging crashes, working with legacy code, using UIKit-only APIs, and understanding how the app lifecycle hooks into the OS.



## C-i3.2  App Lifecycle

SwiftUI apps use `@main struct MyApp: App`. The app's `WindowGroup { ContentView() }` defines the primary window. Scene phases: `active` (app in foreground), `inactive` (transitioning), `background` (not visible). `@Environment(\.scenePhase)` reads the current phase. Use it to pause timers, save state, or defer work.



## C-i3.3  Apple Frameworks

- **SwiftData (iOS 17+):** Apple's modern persistence framework. Replaces Core Data. `@Model` macro marks a class as a persistent model. `@Query` property wrapper fetches data in views.

- **MapKit:** Maps integration. `Map(position: $position) { Marker("Location", coordinate: coord) }` in SwiftUI.

- **AVFoundation:** Audio and video playback, recording.

- **HealthKit:** Access health and fitness data (requires user permission).

- **StoreKit 2:** In-app purchases and subscriptions directly via Apple APIs (compare to RevenueCat in Block D).

- **CloudKit:** Sync data across user's devices via iCloud.



## C-i3.4  App Store Submission

Xcode → Product → Archive produces an `.xcarchive`. Upload to App Store Connect via Xcode Organiser. App Store Connect: configure app metadata (description, screenshots for every required device size, keywords, category, age rating, privacy labels). Submit for review. Review is typically 24–48 hours.

Privacy labels are a significant Apple requirement: you must declare every type of data your app collects, why it is collected, and whether it is linked to the user.




> **✅ EXIT CHECK**

- ✓ What UIKit is and its relationship to SwiftUI
- ✓ The three scene phase states and when each is used
- ✓ What SwiftData provides compared to raw SQLite
- ✓ What privacy labels are and why Apple requires them
- ✓ The process from Xcode Archive to published on the App Store


---


---



# C-iOS4 — macOS App Specifics

> 📦 **Block C — Native · iOS/macOS Track**

*Targeting the desktop from the Apple platform*

## Overview

SwiftUI is cross-platform within the Apple ecosystem — a significant amount of SwiftUI code runs on both iOS and macOS. This chapter covers what changes for the desktop: window management, menu bars, AppKit interoperability, and the Mac App Store.



## C-i4.1  SwiftUI on macOS

SwiftUI on macOS has all the same building blocks as iOS with platform-specific additions. `NavigationSplitView` — a sidebar + detail layout native to macOS and iPadOS. `.commands` modifier — adds items to the menu bar. `Settings { }` — the app's Preferences window. `MenuBarExtra` — a menu bar icon with a popover (for utility apps that live in the menu bar).



## C-i4.2  AppKit

AppKit is to macOS what UIKit is to iOS — the original framework. For anything SwiftUI cannot do, `NSViewRepresentable` wraps AppKit views. AppKit provides access to features like `NSPasteboard` (clipboard), `NSOpenPanel`/`NSSavePanel` (file dialogs), and `NSWindow` for fine-grained window control.



## C-i4.3  Mac App Store vs Direct Distribution

The Mac App Store requires sandboxing — the app can only access files, network resources, and system features explicitly declared in its entitlements. This limits access to some APIs.

Direct distribution (distributing a signed `.dmg` or `.pkg` outside the App Store) removes the sandbox restriction but requires Developer ID signing and is subject to Gatekeeper notarisation — Apple scans the binary for malware before allowing it to run.

For consumer apps: Mac App Store (discoverability, automatic updates). For professional/developer tools that need broad system access: direct distribution.




> **✅ EXIT CHECK**

- ✓ What NavigationSplitView provides on macOS
- ✓ How AppKit interops with SwiftUI via NSViewRepresentable
- ✓ The difference between Mac App Store sandboxing and direct distribution
- ✓ What Gatekeeper notarisation is required for


---


---



# C-Android1 — Kotlin Foundations

> 📦 **Block C — Native · Android Track**

*The language of modern Android*

## Overview

Kotlin was created by JetBrains and became Google's preferred language for Android development in 2017. It is statically typed, interoperable with Java, and adds null safety, extension functions, coroutines, and concise syntax. Kotlin also compiles to JavaScript and native binaries (Kotlin Multiplatform), though this chapter focuses on its use for Android.



## C-a1.1  Null Safety

Kotlin's type system distinguishes nullable and non-nullable types. `String` cannot be null. `String?` can be null. Accessing a nullable without a null check is a compile error. This eliminates NullPointerExceptions — the most common runtime error in Java Android apps.

Null-safe operators: `?.` (safe call — returns null if receiver is null), `?:` (Elvis operator — provides a default if null), `!!` (not-null assertion — throws NPE if null, use sparingly).



## C-a1.2  Data Classes

`data class User(val id: Int, val name: String)` — a class with auto-generated `equals()`, `hashCode()`, `toString()`, `copy()`, and destructuring. Data classes replace Java POJOs entirely. `copy(name = "Bob")` creates a new instance with only the specified fields changed — essential for immutable state patterns.



## C-a1.3  Extension Functions

Extension functions add methods to existing classes without subclassing. `fun String.isPalindrome(): Boolean { return this == this.reversed() }`. Now any String has `.isPalindrome()`. This is how Kotlin's standard library extends Java types, and how you can extend Android framework classes without inheritance.



## C-a1.4  Coroutines

Kotlin coroutines are the standard for asynchronous Android development. `suspend fun fetchUser(): User` — marks a function as suspendable. `viewModelScope.launch { val user = fetchUser() }` — launches a coroutine in the ViewModel's lifecycle scope (cancelled when the ViewModel is cleared). `withContext(Dispatchers.IO) { }` switches to a background thread.

`Flow` is Kotlin's reactive stream — a cold, suspendable sequence of values. `StateFlow` is a hot flow that always holds the latest value — the standard for UI state in Android ViewModels.



## C-a1.5  Scope Functions

`let`, `run`, `with`, `apply`, `also` — functions that execute a block on an object with a specific receiver pattern. `apply` returns the receiver and uses `this` — ideal for object configuration: `View(context).apply { text = "Hello"; textSize = 16f }`. `let` uses `it` and is ideal for null-safe chains. These appear constantly in idiomatic Kotlin code.




> **✅ EXIT CHECK**

- ✓ How Kotlin null safety works and how it differs from Java
- ✓ What a data class provides automatically
- ✓ What extension functions are and how they add methods to existing classes
- ✓ What a coroutine is and how viewModelScope.launch manages its lifecycle
- ✓ What StateFlow is and why it is used for UI state


---


---



# C-Android2 — Jetpack Compose

> 📦 **Block C — Native · Android Track**

*Declarative Android UI*

## Overview

Jetpack Compose is Android's modern declarative UI toolkit, stable since 2021. Like SwiftUI and React, composables are functions that describe what the UI should look like based on state. When state changes, Compose recomposes the affected parts of the UI.



## C-a2.1  Composable Functions

A composable is a function annotated with `@Composable`. It can call other composables. It should be side-effect free during composition. `@Composable fun Greeting(name: String) { Text(text = "Hello, $name!") }`.

Composables cannot be called from regular functions — only from other composables or from the composition entry point. The `setContent { }` block in an Activity is the root of the composition.



## C-a2.2  State in Compose

- **`remember { mutableStateOf(value) }`:** Creates state that survives recomposition. The composable re-renders when the state changes.

- **`rememberSaveable`:** Like `remember` but also survives configuration changes (screen rotation) by saving to a Bundle.

- **`viewModel()`:** Provides a ViewModel — the recommended location for UI state and business logic, surviving configuration changes.

State hoisting — lifting state up to the lowest common ancestor that needs it — is the idiomatic Compose pattern, identical to React's lifting state up.



## C-a2.3  Layout and Theming

`Column`, `Row`, `Box` are the basic layout composables (equivalents of VStack, HStack, ZStack). `LazyColumn` / `LazyRow` are virtualised lists. `Scaffold` provides the standard Material layout structure (top app bar, bottom bar, FAB, content area).

Material 3 is the design system. `MaterialTheme` provides colors, typography, and shapes. `Modifier` chains apply styling and behavior: `Modifier.padding(16.dp).fillMaxWidth().clickable { }`.



## C-a2.4  Navigation in Compose

`NavHost` defines the navigation graph. Each destination has a route string. `NavController` manages the back stack. `navController.navigate("profile/$userId")` navigates programmatically. Type-safe navigation (using Kotlin objects as routes rather than strings) is the modern approach available with Navigation 2.8+.




> **✅ EXIT CHECK**

- ✓ What a @Composable function is and what the annotation means
- ✓ The difference between remember and rememberSaveable
- ✓ What state hoisting means in Compose and why it matches React's pattern
- ✓ What Modifier is and how it chains
- ✓ How LazyColumn differs from Column


---


---



# C-Android3 — Android App Specifics

> 📦 **Block C — Native · Android Track**

*Lifecycle, architecture, and the Play Store*

## Overview

Android's architecture has deep roots — the Activity/Fragment model, the Gradle build system, and the Play Store submission process all require specific knowledge.



## C-a3.1  Activity Lifecycle

An Activity is a single screen in an Android app. Its lifecycle: `onCreate` → `onStart` → `onResume` (visible and interactive) → `onPause` (partially obscured) → `onStop` (not visible) → `onDestroy`. Configuration changes (rotation) destroy and recreate the Activity — a ViewModel survives this; local Activity state does not without `rememberSaveable` or `onSaveInstanceState`.

In Compose apps, you typically have a single Activity. The composition manages the screen rather than multiple Activities.



## C-a3.2  ViewModel and Architecture

The recommended architecture (by Google's "Now in Android" guidelines): UI layer (Composables) observes state from ViewModels. ViewModels hold `StateFlow` of UI state and call use cases / repositories. Repositories abstract data sources (network, database). This is a clean architecture variant appropriate for most Android apps.

Hilt (built on Dagger) is the standard dependency injection framework for Android. `@HiltAndroidApp`, `@AndroidEntryPoint`, `@HiltViewModel`, `@Inject` — these annotations configure dependency injection. DI makes ViewModels and repositories independently testable.



## C-a3.3  Gradle

Gradle is Android's build system. `build.gradle.kts` (Kotlin DSL, now standard) configures compilation, dependencies, signing, and build variants. Key concepts: application ID (the package name, permanent), version code (integer, must increment with each store release), version name (human-readable), build types (debug/release), flavors (product variants).

Gradle is the most common source of Android project setup pain. The Kotlin DSL has improved discoverability; the version catalog (`libs.versions.toml`) centralises dependency version management.



## C-a3.4  Google Play Submission

Android App Bundle (`.aab`) is the submission format — Play generates optimised APKs for each device configuration from it. `./gradlew bundleRelease` builds the release bundle. Sign with the upload keystore. Upload to Play Console.

Play Console tracks: internal testing → closed testing → open testing → production. Each track can be used for staged rollouts. Release notes, screenshots, content rating, and privacy policy are required. Google review is typically faster than Apple.




> **✅ EXIT CHECK**

- ✓ The Activity lifecycle states and what triggers each transition
- ✓ Why configuration changes destroy/recreate an Activity and how ViewModel survives
- ✓ What the ViewModel → Repository → Data Source architecture achieves
- ✓ What an AAB is and why it is preferred over APK for store submission
- ✓ The four Play Console testing tracks and their purpose


---


---



# C-Win1 — Windows Native — C# + .NET + WinUI

> 📦 **Block C — Native · Windows Track**

*Building for the Windows desktop*

## Overview

Windows-native development uses C#, the .NET runtime, and WinUI 3 for the UI layer. C# is a mature, expressive language; .NET is a comprehensive cross-platform runtime; WinUI 3 is Microsoft's modern Windows UI framework. Alternatively, .NET MAUI targets Windows, macOS, iOS, and Android from a single codebase.



## C-W1.1  C# Foundations

C# is a strongly typed, object-oriented language designed by Anders Hejlsberg at Microsoft. Key features distinct from Java: properties (getters/setters as first-class syntax), LINQ (Language-Integrated Query — SQL-like operations on any enumerable), async/await (pioneered by C# before other languages adopted it), nullable reference types, pattern matching, records (immutable data classes), and extension methods.



## C-W1.2  The .NET Runtime

The CLR (Common Language Runtime) is the .NET virtual machine. It JIT-compiles CIL (Common Intermediate Language) bytecode to native code. The CLR provides garbage collection, exception handling, type safety, and security boundaries. .NET 8 is the current LTS version. .NET Framework (Windows-only, legacy) is distinct from modern cross-platform .NET.

NuGet is .NET's package manager. `dotnet add package [Name]` installs. `.csproj` files define project structure and dependencies — the equivalent of `package.json`.



## C-W1.3  WinUI 3

WinUI 3 is Microsoft's modern Windows UI framework decoupled from the OS. XAML (Extensible Application Markup Language) defines layouts declaratively: `<Button Content="Click me" Click="OnClick"/>`. Code-behind files (C#) handle logic. WinUI 3 apps run on Windows 10 (build 1809+) and Windows 11.



## C-W1.4  .NET MAUI

.NET MAUI (Multi-platform App UI) is Microsoft's answer to React Native and Flutter — a single C# codebase targeting iOS, Android, macOS, and Windows. The UI is defined in XAML or C# and rendered to native controls on each platform. MAUI is appropriate when a team already has .NET expertise and wants to target all four platforms.




> **✅ EXIT CHECK**

- ✓ What differentiates C# from Java — LINQ, records, async/await origins
- ✓ What the CLR is and how it relates to the .NET runtime
- ✓ What XAML is and how it relates to the code-behind
- ✓ When to choose WinUI 3 vs .NET MAUI


---


---



# D1 — Backend + Convex

> 📦 **Block D — Shared Integrations**

*Reactive backend for modern apps*

## Overview

Most apps need a backend: a place to store data, run server-side logic, and coordinate between clients. Convex is a reactive backend platform — a database, server functions, file storage, and real-time sync in one service. This chapter covers the Convex model and how it compares to alternatives.



## D1.1  The Convex Model

Convex stores data in a document database (similar to Firestore or MongoDB, but with a relational query layer). The fundamental guarantee: every client always has the current state of any data they are subscribed to. When data changes, Convex pushes updates to all subscribed clients in real time, without polling.

### Queries

Convex queries are server-side functions that read from the database. They are automatically re-run when the data they read changes, and their results are pushed to subscribed clients. `useQuery(api.users.list)` in a React component subscribes — whenever the user list changes, the component re-renders with new data. Zero manual invalidation.

### Mutations

Mutations are server-side functions that write to the database. They run in a transaction — all-or-nothing. `useMutation(api.users.create)` returns a function the client calls. Mutations can call queries to read data within the same transaction.

### Actions

Actions are server-side functions that can call external APIs, send emails, process images, or do anything that requires server-side execution without the transaction guarantees of mutations. Actions can call mutations.



## D1.2  Schema

Convex schemas are defined in TypeScript: `defineTable({ name: v.string(), email: v.string(), createdAt: v.number() })`. The schema is used to type queries and mutations automatically — the TypeScript types for your database are generated from the schema. `v.id("users")` is a typed reference to another table — Convex's equivalent of a foreign key.



## D1.3  Convex Auth

Convex Auth provides authentication with multiple strategies: password + email, OAuth (Google, Apple, GitHub), magic links, and anonymous. It is built specifically for Convex and integrates with the session model. User identity is available inside any Convex function as `ctx.auth.getUserIdentity()`.



## D1.4  File Storage

Convex stores files. `await ctx.storage.generateUploadUrl()` creates a short-lived upload URL. The client uploads directly. The server stores the file ID. `ctx.storage.getUrl(storageId)` returns a signed URL for access. Handles images, documents, any binary data.



## D1.5  Scheduled Functions

`ctx.scheduler.runAfter(delay, api.fn)` — schedules a function to run after a delay. `ctx.scheduler.runAt(timestamp, api.fn)` — at a specific time. Cron jobs via `cronJobs()` in `convex/crons.ts` — run functions on a schedule. Use cases: sending reminder emails, cleaning up expired data, periodic aggregations.



## D1.6  Convex vs Supabase vs Firebase

**Supabase** is PostgreSQL with an auto-generated REST/GraphQL API, auth, storage, and realtime via Postgres triggers. Strong choice when: you need complex relational queries, you want SQL control, or you are migrating from a Postgres-based architecture.

**Firebase** (Firestore) is Google's document database with real-time sync. Mature ecosystem, generous free tier. Weak TypeScript support. Vendor lock-in to Google. Limited query capabilities.

**Convex** wins when: TypeScript types generated from schema are important, the reactive model removes polling complexity, or you want mutations/queries as typed server functions with zero API layer boilerplate.




> **✅ EXIT CHECK**

- ✓ What makes Convex reactive — how data updates reach the client
- ✓ The difference between queries, mutations, and actions
- ✓ What Convex Auth provides and how auth is accessed in server functions
- ✓ How file storage works in Convex — the upload URL pattern
- ✓ When to choose Convex vs Supabase — the key decision factors


---


---



# D2 — Auth & Identity

> 📦 **Block D — Shared Integrations**

*Authentication and authorisation patterns*

## Overview

Authentication is the entry point to every app that has users. Getting it right matters for security, user experience, and compliance. This chapter covers the authentication patterns every developer encounters — from the protocols to the platform-specific requirements.



## D2.1  OAuth 2.0

OAuth 2.0 is the protocol behind "Sign in with Google / Apple / GitHub". The flow: 1) Your app redirects the user to the provider's auth page with a client_id and redirect_uri. 2) The user authenticates with the provider. 3) The provider redirects back to your app with a `code`. 4) Your server exchanges the code for an access token and user info. 5) Your app creates or retrieves a user account and creates a session.

Your app never sees the user's password at the provider. You receive a verified identity. The user does not have to create another password.



## D2.2  Apple Sign-In

Apple Sign-In is mandatory for any iOS/macOS app that offers third-party social login. App Store Review Guideline 4.8: if your app offers sign-in with any third party (Google, Facebook), it must also offer Apple Sign-In. Non-compliance is grounds for rejection.

Apple Sign-In offers users the ability to hide their real email — Apple creates a relay email address. Your app receives the relay address. Emails sent to it are forwarded to the user's real address. Handle this: do not display the email as the user's name.



## D2.3  Sessions vs JWTs

Covered in Part 1 Ch13. Applied context: for mobile apps, JWTs stored securely (in the keychain on iOS, encrypted storage on Android) are the standard. For web apps, HttpOnly cookies containing session tokens are more secure than localStorage JWTs. Convex Auth and most auth libraries handle the implementation — understanding the model matters for debugging and security decisions.



## D2.4  Magic Links and Passkeys

Magic links: email a one-time link. Click it to authenticate. No password required. Lower friction for users. Requires email access to sign in (a security property, not just a convenience).

Passkeys are the emerging standard. A passkey is a cryptographic key pair where the private key stays on the device, protected by biometric authentication (Face ID, Touch ID, Windows Hello). No password, no phishing risk, no credential stuffing. Supported in iOS 16+, Android 9+, Windows 11. The web and native platform implementations use the FIDO2/WebAuthn standard.



## D2.5  Mobile Auth Differences

Web auth uses browser cookies and redirect flows. Mobile apps cannot use browser cookies in the same way. Native OAuth uses ASWebAuthenticationSession (iOS) or Custom Tabs (Android) — these open an in-app browser for the OAuth flow, return a code via a URL scheme, and exchange the code for tokens natively. The tokens are stored in secure system storage (Keychain on iOS). Expo Auth Session handles this for React Native apps.




> **✅ EXIT CHECK**

- ✓ The OAuth 2.0 flow — the steps from redirect to access token
- ✓ Why Apple Sign-In is mandatory for iOS apps with social login
- ✓ What happens when a user hides their email via Apple Sign-In
- ✓ What passkeys are and how they differ from passwords
- ✓ How mobile OAuth differs from web OAuth


---


---



# D3 — Payment Concepts

> 📦 **Block D — Shared Integrations**

*How payments work before you touch the code*

## Overview

Payments are high-stakes. Money is moving. The cost of bugs is not a bad user experience — it is financial loss, chargebacks, or fraud. Understanding the ecosystem before writing payment code prevents costly mistakes.



## D3.1  The Payments Ecosystem

A payment flow involves: the customer (cardholder), the merchant (your app), a payment processor (Stripe, Adyen — handles the transaction), an acquiring bank (your business's bank), an issuing bank (the customer's bank), and the card network (Visa, Mastercard, Amex — the rails).

A payment processor abstracts the card network and acquiring bank relationship. You integrate with Stripe; Stripe handles everything else. The processor charges a percentage (typically 2.9% + $0.30 per transaction in the US).



## D3.2  PCI DSS Compliance

PCI DSS (Payment Card Industry Data Security Standard) is the security standard for any entity that handles cardholder data. Rule 1 of payment integration: never handle raw card numbers yourself. Use a processor's hosted fields (Stripe Elements, Stripe Checkout) or SDK. Card data goes directly to Stripe's servers. Your server never sees it. You are then "out of scope" for the strictest PCI requirements.



## D3.3  Webhooks

Payment events happen asynchronously. A subscription renewal is charged by Stripe — not triggered by your server. A payment may be disputed three months after the original charge. Your server must receive these events via webhooks: Stripe (or Paddle/RevenueCat) sends an HTTP POST to your endpoint when an event occurs (payment succeeded, subscription cancelled, refund issued).

Webhook security: verify the webhook signature — Stripe includes a signature header that you validate with your webhook secret. Reject any webhook without a valid signature. Make webhook handlers idempotent — the same webhook may be delivered more than once.



## D3.4  Payment Models

- **One-time payment:** Customer pays once, receives a product/service. PaymentIntent is the Stripe object.

- **Subscription:** Customer pays on a recurring schedule. Stripe Subscription, RevenueCat Entitlement.

- **Usage-based billing:** Charge based on consumption (API calls, seats, storage). Stripe Meters.

- **Marketplace / Platform:** Your app connects buyers and sellers. You collect payment and pay out to sellers. Stripe Connect.




> **✅ EXIT CHECK**

- ✓ The entities in a payment flow and what each does
- ✓ What PCI DSS is and how using hosted payment fields keeps you out of scope
- ✓ What a webhook is and why payment events require them
- ✓ Why webhook handlers must be idempotent
- ✓ The four payment models and which Stripe product each maps to


---


---



# D4 — Stripe

> 📦 **Block D — Shared Integrations**

*The web and server payment stack*

## Overview

Stripe is the dominant payment processor for web and server-side applications. It has a comprehensive API, excellent documentation, and handles the complexity of international payments, fraud detection, and compliance.



## D4.1  Core Stripe Objects

- **Customer:** Represents a paying customer in Stripe. Store the Stripe Customer ID against your user in your database. Allows attaching payment methods, viewing payment history, and creating subscriptions.

- **Product:** What you are selling — a SaaS plan, a one-time item. Products hold metadata.

- **Price:** The cost and billing interval of a Product. A Product can have multiple Prices (monthly vs annual, different currencies). Prices are immutable — create a new one rather than updating.

- **PaymentIntent:** Represents a single payment attempt. Tracks the state through confirmation (succeeded, requires_action, etc.).

- **Subscription:** A recurring billing relationship. References a Customer and a Price. Renews automatically. Stripe sends webhook events at each renewal and on state changes.

- **Invoice:** Generated for each subscription period. An invoice finalises and is paid automatically via the attached payment method.



## D4.2  Stripe Checkout vs Elements

Stripe Checkout: redirect the user to a Stripe-hosted payment page. Zero frontend payment code. Handles card entry, Apple Pay, Google Pay, 3D Secure, coupon codes. The simplest integration — suitable for most use cases.

Stripe Elements: embed Stripe's UI components directly into your app. Fully customisable. Requires more frontend work. Use when you need deep UI control or want to keep users on your domain throughout checkout.



## D4.3  Subscription Lifecycle

`subscription.created` → `invoice.payment_succeeded` (first payment) → recurring `invoice.payment_succeeded` events at each renewal → `customer.subscription.updated` (plan change) → `customer.subscription.deleted` (cancelled at period end) or `invoice.payment_failed` + dunning → eventual cancellation.

Your backend must handle each of these webhooks to maintain accurate subscription state in your database. Relying on polling or client-reported state for subscription status is a security vulnerability — a user could claim to be subscribed without paying.



## D4.4  Test Mode

Stripe has a complete test mode. Test API keys (`sk_test_...`) and test card numbers (`4242 4242 4242 4242`) allow testing the full payment flow without real money moving. Stripe's dashboard shows test data separately from live. Use test mode for all development and staging. The webhook tester in the Stripe dashboard replays events to your local endpoint.




> **✅ EXIT CHECK**

- ✓ The six core Stripe objects and what each represents
- ✓ When to use Checkout vs Elements
- ✓ The full subscription lifecycle — the webhook events in sequence
- ✓ Why subscription status must come from webhook-maintained backend state
- ✓ How test mode works and the test card number


---


---



# D5 — Polar

> 📦 **Block D — Shared Integrations**

*SaaS and creator payments*

## Overview

Polar is a developer-focused platform for SaaS subscriptions and creator monetisation. It handles the billing, tax, and benefit delivery infrastructure so you can focus on building.



## D5.1  The Polar Model

Polar works differently from Stripe. With Stripe, you handle the full billing stack — create customers, products, subscriptions, and webhooks. With Polar, you define Products (with prices and benefits), and Polar handles the customer acquisition flow, billing, tax collection, and benefit delivery.

Benefits are first-class in Polar: a subscription benefit can be "access to the Pro tier" or "download this file" or "access to this private GitHub repository". Polar delivers the benefit automatically when a subscription is active and revokes it when cancelled.



## D5.2  Key Concepts

- **Organization:** Your Polar account. Analogous to a Stripe account.

- **Product:** What you sell. Has a name, description, and one or more prices.

- **Benefit:** What the customer gets. Polar has built-in benefit types: custom (you define), file download, GitHub repo access, Discord server access.

- **Subscription:** A customer's active access to a product and its benefits.

- **Checkout:** Polar-hosted checkout page. Share the URL; Polar handles everything.



## D5.3  Integration Pattern

Polar provides a JavaScript SDK. `polar.checkouts.create({ productPriceId, customerEmail })` creates a checkout session. Webhooks notify your server of subscription events. `polar.subscriptions.list({ organizationId })` queries subscription state.

For benefit delivery beyond Polar's built-ins, handle the `subscription.active` webhook and provision access in your backend. Handle `subscription.revoked` to remove access.



## D5.4  Polar vs Stripe

Polar abstracts billing complexity. You do not manage Customers, Invoices, or PaymentIntents — Polar does. Polar handles tax (VAT, GST) automatically. Polar is faster to integrate for straightforward SaaS.

Choose Stripe when: you need complex custom billing logic, marketplace payments, granular control over the payment flow, or your business requires a feature Polar does not offer. Choose Polar when: you want the fastest path to working SaaS billing with automatic tax and benefit delivery.




> **✅ EXIT CHECK**

- ✓ What a Benefit is in Polar and what built-in benefit types exist
- ✓ The Polar integration pattern — checkout URL, webhooks, SDK
- ✓ What Polar handles automatically that you would manage manually in Stripe
- ✓ When to choose Polar over Stripe


---


---



# D6 — RevenueCat

> 📦 **Block D — Shared Integrations**

*Mobile in-app purchases and subscriptions*

## Overview

Mobile apps that offer paid features must use in-app purchases (IAP) — Apple and Google mandate it for content and features sold within iOS and Android apps. RevenueCat is the standard SDK for managing IAP across both platforms.



## D6.1  Why Mobile IAP Is Different

Apple App Store and Google Play are payment intermediaries. A customer buys your subscription through Apple or Google, not directly from you. Apple takes 30% (15% for subscriptions after year 1 and for small businesses). Google takes 30% (15% for subscriptions). The stores handle payment processing, subscription renewal, and user billing. You handle feature access based on subscription status.

You cannot use Stripe for in-app purchases of digital content on iOS or Android — App Store policy forbids it. Physical goods (an e-commerce app) and certain services (Uber, Airbnb) are exempt.



## D6.2  Core RevenueCat Concepts

- **Entitlement:** A feature or level of access (e.g. "pro", "premium"). An entitlement is active or inactive. Your app shows/hides features based on entitlement status — not based on which product was purchased. This decouples features from products.

- **Offering:** A set of products shown to the user at a given moment. You configure Offerings in the RevenueCat dashboard. Changing which products are offered does not require an app update.

- **Package:** A product within an Offering (monthly, annual, lifetime).

- **Product:** An App Store / Play Store product (the thing with a price that Apple/Google sells).



## D6.3  The Integration

`Purchases.configure({ apiKey })` initialises the SDK. `Purchases.shared.getCustomerInfo()` returns current entitlement state — the source of truth for what the user can access. `Purchases.shared.getOfferings()` returns available products to display. `Purchases.shared.purchase(package)` initiates purchase. Handles StoreKit (iOS) and Google Play Billing (Android) internally.

`Purchases.logIn(userId)` — crucial for linking purchases to your own user accounts. Call this when the user logs in and on every app open if the user is authenticated. Without this, purchases are tied to the device, not the user.



## D6.4  Receipt Validation and Webhooks

RevenueCat validates purchase receipts with Apple and Google automatically. When a renewal occurs, a trial converts, or a subscription is cancelled, RevenueCat sends a webhook to your server. Handle these to maintain subscription state in your database — do not rely solely on client-side `getCustomerInfo()` for security-critical access control.

### Sandbox Testing

Apple Sandbox and Google Play Test accounts allow testing IAP without real charges. Subscriptions renew on an accelerated schedule (1 month → 5 minutes in sandbox). Test the full lifecycle: purchase, renewal, cancellation, expiry, and restoration.




> **✅ EXIT CHECK**

- ✓ Why Stripe cannot be used for in-app digital purchases on iOS/Android
- ✓ What an Entitlement is and why it decouples features from products
- ✓ What logIn() does and why it must be called when a user authenticates
- ✓ Why receipt validation must happen on your backend
- ✓ What sandbox testing accelerated renewal means for testing


---


---



# D7 — Analytics

> 📦 **Block D — Shared Integrations**

*Measuring what matters in your app*

## Overview

You cannot improve what you do not measure. Analytics tells you whether features are being used, where users drop off, which acquisition channels work, and whether a release introduced a regression. This chapter covers the key concepts and the primary tools.



## D7.1  Core Concepts

- **Event:** A timestamped action taken by a user. `button_clicked`, `purchase_completed`, `onboarding_step_1_viewed`. Events are the atomic unit of analytics.

- **Property / Attribute:** Metadata attached to an event or user. `{ planType: "pro", platform: "ios", appVersion: "2.4.1" }`.

- **Funnel:** A sequence of events representing a conversion path. "Viewed onboarding step 1 → completed step 1 → completed step 2 → account created". Funnel analysis shows where users drop off.

- **Retention:** How many users return after their first session. Day 1, Day 7, Day 30 retention are standard metrics. High retention indicates product-market fit.

- **Attribution:** Which marketing channel caused a user to install the app. "This user clicked a Facebook ad, installed, and converted to paid." Requires a mobile measurement partner (MMP) like AppsFlyer.



## D7.2  AppsFlyer

AppsFlyer is a Mobile Measurement Partner (MMP) — the source of truth for mobile attribution. It integrates with ad networks (Meta, Google, TikTok, etc.) to track which campaign each install came from. The integration: install the AppsFlyer SDK, configure the App ID, set up one-link deep links.

### SKAdNetwork and SKAN 4

iOS 14.5 introduced ATT (App Tracking Transparency) — apps must ask permission before tracking users across apps and websites. Most users deny. Apple's privacy-preserving attribution framework is SKAdNetwork (SKAN). SKAN 4 (iOS 16.1+) provides improved privacy-preserving conversion value reporting. AppsFlyer translates SKAN data into actionable attribution.

### Deep Linking

A deep link opens a specific screen in your app from an external URL. `myapp://profile/42` opens the profile screen. OneLink (AppsFlyer) handles deferred deep linking — if the app is not installed, the link takes the user to the App Store/Play Store; after install, the app opens to the intended screen.



## D7.3  PostHog

PostHog is an open-source product analytics platform. It handles event tracking, funnels, retention analysis, session recording, feature flags, and A/B testing in one platform. Self-hostable (GDPR-friendly) or hosted. Strong TypeScript SDK. The recommended analytics layer for most new products.

`posthog.capture("button_clicked", { buttonName: "upgrade" })` — tracks an event. `posthog.identify(userId, { plan: "pro" })` — identifies the user. Feature flags: `posthog.isFeatureEnabled("new-checkout")` — controls rollouts and experiments.



## D7.4  Mixpanel

Mixpanel is an event-based product analytics tool focused on user behaviour analysis. Strong cohort analysis and JQL (Mixpanel's query language) for power users. Larger feature set than PostHog for pure analytics. Higher cost. Appropriate for teams with dedicated analysts or when Mixpanel's specific analytical features are needed.



## D7.5  The Analytics Stack

A typical mobile app analytics stack: **AppsFlyer** for attribution (which ads work), **PostHog** for product analytics (what users do), **Sentry** for errors (what breaks). These three tools together cover the full picture — acquisition, behaviour, and stability.




> **✅ EXIT CHECK**

- ✓ The difference between an event and a property
- ✓ What funnel analysis reveals and what retention measures
- ✓ What an MMP is and why AppsFlyer is needed alongside PostHog
- ✓ What SKAdNetwork is and why it exists
- ✓ What deferred deep linking does
- ✓ The recommended three-tool analytics stack and what each covers


---


---



# D8 — Error Monitoring

> 📦 **Block D — Shared Integrations**

*Knowing when things break in production*

## Overview

Production errors happen. The question is whether you find out before or after your users do. Error monitoring captures unhandled exceptions, provides stack traces, and alerts you when new errors appear or when error rates spike.



## D8.1  Sentry

Sentry is the dominant error monitoring platform. It supports every major language and framework. Setup: `Sentry.init({ dsn: "...", environment: "production" })`. After this, every unhandled exception is automatically captured and reported.

### Key Features

- **Stack traces:** Sentry unminifies/unsymbolises stack traces using source maps (web) or dSYMs (iOS) to show the original source code line.

- **Breadcrumbs:** An audit trail of events leading up to an error — navigation events, network requests, console logs. Provides context for reproducing the issue.

- **User context:** `Sentry.setUser({ id: userId })` associates errors with users. You can see which specific users experienced an error.

- **Releases:** Tag errors with the app version. See which release introduced an error. Track error rate per release.

- **Alerts:** Configure alert rules — notify Slack when a new error occurs, or when error rate exceeds a threshold.



## D8.2  Source Maps

Production JavaScript is minified and bundled — the stack trace points to line 1 of a single file with unreadable variable names. Source maps are files mapping minified positions back to original source positions. Upload source maps to Sentry as part of the deployment process. Without them, production stack traces are useless.

### For React Native

React Native uses source maps for the JS bundle. iOS crash reports require dSYM files (debug symbol files produced by Xcode). `sentry-cli upload-dif` uploads them. EAS Build can be configured to upload symbols automatically.



## D8.3  Error Boundaries and Sentry

Sentry integrates with React error boundaries: `<Sentry.ErrorBoundary fallback={<ErrorPage />}>` catches React rendering errors and reports them with full context. Without this, rendering errors in production are silently swallowed or crash the app without a report.




> **✅ EXIT CHECK**

- ✓ What Sentry captures automatically after initialization
- ✓ What source maps are and why they must be uploaded to Sentry
- ✓ What breadcrumbs are in Sentry's context
- ✓ What a release tag enables in error monitoring
- ✓ What dSYM files are for and when they are needed


---


---



# D9 — AI Integration

> 📦 **Block D — Shared Integrations**

*Adding intelligence to the apps you build*

## Overview

LLMs (Large Language Models) are now callable APIs. Adding a chat interface, a text summariser, a classification system, or a coding assistant to an app is an API call. This chapter covers the practical integration of AI into applications — not training models (that is Path 3), but calling existing ones.



## D9.1  Core Concepts

- **Token:** The unit of text that LLMs process. Roughly 0.75 words per token. Both input (prompt) and output (completion) consume tokens. Pricing is per token.

- **Context window:** The maximum number of tokens a model can process in one call — input + output combined. GPT-4o has a 128k context window; Claude 3.5 Sonnet has 200k. The context window is your working memory — everything the model needs to know must fit in it.

- **System prompt:** Instructions given to the model before the conversation. Sets the model's role, constraints, and output format. Not shown to the user.

- **Temperature:** 0 = deterministic (same input, same output). 1 = more creative/varied. For tasks requiring factual accuracy, use low temperature. For creative tasks, higher.

- **Tool use (function calling):** The model can request the execution of a defined function. The application runs the function and returns the result. Enables agents that interact with external APIs.



## D9.2  The Anthropic API (Claude)

`POST https://api.anthropic.com/v1/messages` with `model`, `max_tokens`, and `messages` array. Each message has a `role` (`"user"` or `"assistant"`) and `content`. The response contains the assistant's message.

Streaming: set `stream: true` to receive the response as a stream of events. The UI can display tokens as they arrive — dramatically better UX for long responses.

### Tool Use

Define tools in the `tools` array: a name, description, and JSON schema for the input parameters. The model decides when to use a tool. If it does, the response contains a `tool_use` block instead of text. Your application runs the tool and sends the result back as a `tool_result` message. The model continues with the result.



## D9.3  AI in Products — Practical Patterns

- **Chat interface:** Maintain the conversation history array client-side. Send the full array on every turn. Stream the response.

- **RAG (Retrieval-Augmented Generation):** Embed documents as vectors. On a user query, retrieve the most semantically similar chunks. Include them in the system prompt as context. The model answers based on your documents, not just its training data.

- **Structured output:** Prompt the model to respond in JSON format. Use `tool_use` with a schema to guarantee structured output. Parse and use programmatically.

- **Classification:** Prompt the model to classify input into predefined categories. Useful for routing support tickets, tagging content, or moderating user input.



## D9.4  Cursor and AI-Assisted Development

Cursor is a code editor built on VS Code with AI deeply integrated. The AI has access to your codebase context. `Cmd+K` inline edits. `Cmd+L` chat with context. `Cmd+I` composer for multi-file changes. `.cursorrules` defines project-level instructions for the AI.

Effective Cursor use: provide context explicitly ("this function is called from X and receives Y"), be specific about what to change, review all AI output before accepting, and use the AI to explain code you do not understand as much as to write new code.




> **✅ EXIT CHECK**

- ✓ What a token is and why context window size matters
- ✓ The difference between temperature 0 and temperature 1
- ✓ What tool use (function calling) enables — what an agent can do
- ✓ How streaming improves UX for LLM responses
- ✓ What RAG is and what problem it solves


---


---



# E1 — Deployment Concepts

> 📦 **Block E — Deployment**

*The spectrum from managed to raw infrastructure*

## Overview

Deployment is getting code from a developer's machine to a running system accessible to users. The strategies range from "upload files to a server via FTP" to "a Kubernetes cluster orchestrating thousands of containers across three regions." This chapter maps the landscape before the specific platforms are covered.



## E1.1  The Deployment Spectrum

- **Managed (PaaS — Platform as a Service):** You provide code. The platform handles servers, networking, scaling, and operations. Vercel, Netlify, Railway, Render, Heroku. Highest productivity, least control.

- **IaaS (Infrastructure as a Service):** You provision virtual machines. You install the OS, runtime, and application. You manage security patches, scaling, and availability. AWS EC2, GCP Compute Engine, DigitalOcean Droplets. Maximum control, highest operational burden.

- **Containers with orchestration:** Docker containers on Kubernetes (EKS, GKE, AKS). Combines portability with scale. High complexity, high power.

For most products at early to medium scale, PaaS is the right choice. The productivity advantage far outweighs the loss of control. Migrate to more infrastructure control when you genuinely need it — not preemptively.



## E1.2  Environments

Development (local) → Staging (production-like, not user-facing) → Production (live). Each environment has its own database, API keys, and configuration. Changes flow through environments; they never skip staging. Preview deployments (a unique URL for every pull request) extend this model.



## E1.3  DNS and Domains

A domain (example.com) points to an IP address via DNS. The registrar (where you bought the domain) holds the authoritative nameserver configuration. The nameserver holds DNS records: A records (domain → IPv4), CNAME records (subdomain → another domain), TXT records (verification, email authentication), MX records (email routing).

DNS changes propagate with TTL delay — changes take up to the TTL value (often 1 hour) to reach all resolvers worldwide. Lower the TTL before a planned change; restore it afterward.



## E1.4  SSL/TLS Certificates

HTTPS requires a TLS certificate. Modern PaaS platforms provision certificates automatically via Let's Encrypt. On self-managed servers, `certbot` automates certificate issuance and renewal. Certificates expire every 90 days (Let's Encrypt) — automated renewal is mandatory.



## E1.5  Zero-Downtime Deployments

A naive deployment: stop the old server, deploy new code, start the new server. Users experience downtime. Strategies to avoid it: rolling deployments (bring up new instances before taking down old ones), blue/green deployments (maintain two identical environments, switch traffic atomically), and canary releases (route a small percentage of traffic to the new version first).



## E1.6  Rollbacks

Deployment platforms maintain a history of deployments. If a production deployment is broken, rolling back means switching traffic to the previous known-good version. This takes seconds on PaaS platforms. On self-managed infrastructure, automated rollback requires pre-built tooling.




> **✅ EXIT CHECK**

- ✓ The difference between PaaS and IaaS — what each manages for you
- ✓ What preview deployments are and why they extend the staging model
- ✓ The DNS record types and what each does
- ✓ What a zero-downtime deployment strategy achieves
- ✓ What a rollback is and how quickly it should be achievable


---


---



# E2 — Vercel

> 📦 **Block E — Deployment**

*The frontend cloud*

## Overview

Vercel is a deployment and hosting platform optimised for frontend frameworks. It pioneered the preview deployment model and is the natural deployment target for React, Next.js, and TanStack Start applications.



## E2.1  How Vercel Works

Connect a GitHub/GitLab/Bitbucket repository. Every push triggers a build. The build command runs (`npm run build`, `vite build`, etc.). The output directory is deployed to Vercel's edge network — a global CDN. The deployment gets a unique URL. Pushes to the main branch update the production deployment; all other branches get preview deployments.



## E2.2  Edge Network

Vercel's global edge network has nodes in 100+ cities. Static assets are served from the closest node to the user. Serverless functions can be deployed to specific regions or as edge functions — JavaScript running at the CDN node itself, with sub-millisecond cold starts and minimal latency.

### Edge Functions vs Serverless Functions

Edge functions run in a V8 isolate at the CDN node — globally distributed, fastest cold start, limited API (no Node.js built-ins, limited memory). Serverless functions run in a Node.js environment in specific regions — full Node.js API, longer cold start.



## E2.3  Deployment Configuration

`vercel.json` configures Vercel: rewrites (route `/api/*` to a serverless function), redirects, headers (security headers like `Content-Security-Policy`), and framework overrides. Most Vite and Next.js projects need no `vercel.json` — Vercel auto-detects the framework.



## E2.4  Environment Variables on Vercel

Set in the Vercel dashboard under Project Settings → Environment Variables. Can be scoped per environment (development/preview/production). Sensitive variables are encrypted. Available in serverless functions via `process.env`. For client-side code, variables must be prefixed appropriately (e.g. `VITE_` for Vite, `NEXT_PUBLIC_` for Next.js).



## E2.5  When Vercel Is the Wrong Choice

Vercel's pricing is per-seat (team members) and per-usage (bandwidth, function invocations). For high-traffic or high-bandwidth applications, costs can escalate. For long-running server processes, persistent WebSocket connections, or stateful backends, Vercel is not appropriate — it is a stateless deployment platform. In those cases, consider Railway, Render, or a cloud VM.




> **✅ EXIT CHECK**

- ✓ What happens when you push to the main branch vs a feature branch on Vercel
- ✓ The difference between edge functions and serverless functions
- ✓ What vercel.json controls
- ✓ How environment variables are scoped on Vercel
- ✓ When Vercel is the wrong choice


---


---



# E3 — Cloudflare

> 📦 **Block E — Deployment**

*DNS, CDN, and edge compute*

## Overview

Cloudflare started as a DDoS protection and CDN service. It has grown into a comprehensive edge computing platform with DNS, static hosting, serverless compute, object storage, and a global network that handles a significant fraction of internet traffic.



## E3.1  DNS Management

Cloudflare is the registrar and/or DNS provider for millions of domains. Moving a domain's DNS to Cloudflare (even while keeping hosting elsewhere) gives you: the fastest DNS resolution globally (Cloudflare's 1.1.1.1 resolvers), one-click SSL certificate provisioning, DDoS protection, and the Cloudflare proxy (the orange cloud — routing traffic through Cloudflare's network).

The proxy enables Cloudflare's features: WAF (Web Application Firewall), rate limiting, bot protection, caching rules, and page rules. DNS-only (grey cloud) bypasses these features but reveals the origin IP.



## E3.2  Cloudflare Pages

Cloudflare Pages is a static site hosting platform — a direct Vercel competitor. Same model: connect GitHub, build on push, deploy to the edge network. Cloudflare's edge network is comparable in global distribution. Pages supports server-side rendering via Pages Functions (Cloudflare Workers running at the edge).

Choosing between Vercel and Cloudflare Pages often comes down to ecosystem: Vercel is better integrated with Next.js and Vercel's own products; Cloudflare Pages is better if you are already using Cloudflare DNS and other CF products.



## E3.3  Cloudflare Workers

Workers are JavaScript/TypeScript functions running on Cloudflare's global edge network. They intercept HTTP requests, modify responses, call external APIs, and access Cloudflare's storage products. Cold start is essentially zero — Workers run in V8 isolates with no container spin-up time.

Workers are ideal for: API middleware, authentication at the edge, A/B testing, personalisation, rate limiting, and request/response transformation. They are not ideal for: long-running tasks, large memory requirements, or Node.js-specific APIs.



## E3.4  R2 Object Storage

R2 is Cloudflare's S3-compatible object storage. Key differentiator: no egress fees (AWS S3 charges per GB transferred out). For applications that serve many images or large files, R2's pricing is dramatically cheaper than S3 at scale. The API is compatible with S3 — SDKs written for S3 work with R2 by changing the endpoint.



## E3.5  Cloudflare vs Vercel

- **Choose Vercel:** Next.js or TanStack Start apps, team using Vercel-specific features, Node.js serverless functions, simpler deployment DX.

- **Choose Cloudflare Pages + Workers:** Global performance with CF DNS integration, R2 for file storage, Workers for edge logic, cost optimisation at high traffic, building with Cloudflare's ecosystem (D1, KV, Queues).




> **✅ EXIT CHECK**

- ✓ What the orange cloud proxy in Cloudflare DNS enables
- ✓ How Cloudflare Pages compares to Vercel
- ✓ What Workers are used for and what they cannot do
- ✓ Why R2 is cheaper than S3 for content-heavy applications


---


---



# E4 — Hostinger

> 📦 **Block E — Deployment**

*Shared hosting and VPS*

## Overview

Not every project needs a modern PaaS. For simple sites, WordPress, small PHP backends, and domain registration, traditional web hosting remains practical. Hostinger is one of the most cost-effective options.



## E4.1  Shared Hosting

Shared hosting places multiple sites on one physical server, sharing CPU and RAM. It is the cheapest form of hosting (often $2–5/month). Limitations: you share resources with other tenants, cannot install arbitrary software, are limited to supported languages (PHP, some Node.js), and have limited control over the server configuration.

Shared hosting is appropriate for: simple websites, small WordPress sites, landing pages, email hosting, and early-stage projects with minimal traffic.



## E4.2  VPS (Virtual Private Server)

A VPS gives you a dedicated virtual machine. You get root access — install any software, configure the OS, run any service. You are responsible for security updates, server configuration, and everything the PaaS would have managed for you.

Hostinger VPS is cost-effective: a 2-core, 8GB RAM VPS at a fraction of the cost of AWS EC2 equivalents. For running Node.js servers, databases, Docker containers, or anything requiring a persistent process, a VPS on Hostinger (or DigitalOcean, Hetzner, Linode) is often more economical than AWS at small to medium scale.



## E4.3  Hostinger as a Domain Registrar

Hostinger offers one of the lowest-cost domain registration services. Registering with Hostinger and pointing DNS to Vercel, Cloudflare, or any other host is common practice — buy the domain where it is cheapest, host where it is best.



## E4.4  cPanel

cPanel is the web-based control panel for shared hosting management — file manager, MySQL databases, email accounts, SSL installation, domain management. Hostinger uses hPanel (their own equivalent). Knowledge of cPanel is relevant when working with traditional hosting environments, client sites on shared hosting, and legacy infrastructure.




> **✅ EXIT CHECK**

- ✓ When shared hosting is appropriate vs when a VPS is needed
- ✓ What a VPS gives you that shared hosting does not
- ✓ Why buying a domain from a cheap registrar and hosting elsewhere is reasonable
- ✓ What cPanel/hPanel manages in a shared hosting context


---


---



# E5 — Mobile Distribution

> 📦 **Block E — Deployment**

*The full lifecycle: sign → build → test → ship*

## Overview

Mobile distribution is covered partially in Block B (EAS). This chapter provides the complete, consolidated reference for the full lifecycle — from first release to ongoing updates — across both platforms.



## E5.1  The Lifecycle Map

**Phase 1 — Setup (once):** Create App Store Connect record (iOS) and Play Console app (Android). Configure bundle ID / package name. Set up code signing certificates and keystores. Configure EAS.

**Phase 2 — Build:** `eas build --platform all --profile production`. EAS runs on cloud infrastructure. Produces `.ipa` (iOS) and `.aab` (Android).

**Phase 3 — Internal Testing:** `eas submit --platform ios` submits to TestFlight. Add internal testers. `eas submit --platform android` submits to Play Console internal track. Test on real devices.

**Phase 4 — Store Review:** Submit for App Store review (TestFlight external group requires review). Android review is faster. Respond to reviewer notes if rejected.

**Phase 5 — Production Release:** Promote TestFlight build to App Store. Promote Play Console build to production. Set rollout percentage (10% → 50% → 100% for safe releases).

**Phase 6 — Updates:** OTA updates for JS changes (`eas update`). New native build + resubmission for native dependency changes. Increment build number for every store submission.



## E5.2  Version Strategy

- **Semantic version (user-facing):** `1.2.3` — Major.Minor.Patch. Increment meaningfully.

- **Build number / version code:** An integer that must be strictly increasing with every submission. 1 → 2 → 3. You can never reuse or decrease this number.

- **OTA update channel:** RevenueCat, EAS Update, and other services use channels (e.g. "production", "staging") to target updates at specific app versions.



## E5.3  Staged Rollouts

Both Apple and Google support staged rollouts — releasing to a percentage of users first. Start at 10–20%. Monitor crash rates and user reviews. Expand to 50%, then 100%. If a critical bug is found, halt the rollout and push a fix. Apple pauses require manual intervention; Google pauses can be automated.




> **✅ EXIT CHECK**

- ✓ The six phases of the mobile distribution lifecycle
- ✓ The difference between an OTA update and a store submission
- ✓ What a build number is and why it can never decrease
- ✓ How staged rollouts work and why they are important
- ✓ What EAS submit does and how it differs from EAS build


---


---



# E6 — Cloud Infrastructure Concepts

> 📦 **Block E — Deployment**

*IaaS, managed services, and regions*

## Overview

Vercel, Cloudflare, and Hostinger handle many infrastructure concerns. AWS, GCP, and Azure expose the infrastructure directly. This chapter provides the conceptual foundation for cloud infrastructure before the specific platforms.



## E6.1  IaaS vs PaaS vs SaaS

**IaaS:** Rent virtual hardware. You manage OS, runtime, app. Examples: EC2, GCP Compute Engine, Azure VMs.

**PaaS:** Rent a managed platform. You provide code. Examples: Heroku, App Engine, Elastic Beanstalk.

**SaaS:** Rent software. You are a user. Examples: Salesforce, Stripe, Convex.

Most applications use a mix: IaaS for compute (EC2 instances), PaaS for databases (RDS), and SaaS for third-party services (Stripe, Twilio).



## E6.2  Regions and Availability Zones

Cloud providers divide their infrastructure into regions (geographic areas — e.g. `us-east-1`, `eu-west-1`) and availability zones (isolated data centres within a region). Deploying across multiple AZs makes an application resilient to a single data centre failure. Deploying across multiple regions reduces latency for globally distributed users.

Data residency: some regulations (GDPR, HIPAA) require data to remain in specific geographic regions. Region selection is not just a performance decision.



## E6.3  IAM — Identity and Access Management

IAM controls who can do what in a cloud account. Users, roles, and policies. A role is a set of permissions that can be assumed by a service or user. The principle of least privilege applies: an EC2 instance running your app should have a role with only the permissions it needs — read from S3, write to CloudWatch Logs — nothing more.

IAM mistakes are the most common cause of cloud security breaches. Never hardcode AWS credentials in code. Use IAM roles for anything running on AWS infrastructure.



## E6.4  Managed Services

Cloud providers offer managed versions of common infrastructure: managed databases (RDS — no server management, automated backups, multi-AZ replication), managed caches (ElastiCache), managed queues (SQS), managed email (SES). Using managed services trades cost for operational simplicity.



## E6.5  Cost Models

Cloud pricing is consumption-based — pay for what you use. Key dimensions: compute (per vCPU-hour), storage (per GB-month), data transfer (per GB out — egress fees are a major cost driver), requests (per million API calls). Unexpected bills from forgotten resources or traffic spikes are a real risk. Set up billing alerts.




> **✅ EXIT CHECK**

- ✓ The difference between IaaS, PaaS, and SaaS with an example of each
- ✓ What a region and availability zone are and why multi-AZ matters
- ✓ What IAM is and why hardcoded credentials are a security risk
- ✓ What managed database services provide over self-managing a database on EC2
- ✓ Why egress fees are a significant cost consideration


---


---



# E7 — AWS

> 📦 **Block E — Deployment**

*Amazon Web Services — the dominant cloud*

## Overview

AWS holds approximately 33% of the global cloud market. Many companies run entirely on AWS. Understanding the core services is broadly applicable across the industry.



## E7.1  Core Services

- **EC2 (Elastic Compute Cloud):** Virtual machines. The fundamental compute unit. Choose instance type (CPU, RAM), OS, and region. Pay by the second. Auto Scaling Groups automatically adjust the number of instances based on demand.

- **S3 (Simple Storage Service):** Object storage. Store files (images, videos, backups, static websites) at effectively unlimited scale. Buckets contain objects (files). Bucket policies control access.

- **RDS (Relational Database Service):** Managed SQL databases: PostgreSQL, MySQL, MariaDB, SQL Server, Oracle. Automated backups, Multi-AZ failover, read replicas. Significantly simpler to operate than self-managing a database on EC2.

- **Lambda:** Serverless compute. Upload a function; AWS runs it on demand. No servers to manage. Pay per invocation and duration. Ideal for event-driven processing, API endpoints with variable load, and scheduled tasks.

- **CloudFront:** AWS's CDN. Distribute static assets and API responses globally. Integrates with S3 and EC2/Lambda origins.

- **Route 53:** AWS's DNS service. Domain registration, DNS management, health checks, and traffic routing policies.

- **SES (Simple Email Service):** Transactional email at scale. Send password resets, notifications, and marketing email. Requires domain verification and compliance with anti-spam policies.

- **Amplify:** AWS's developer-facing PaaS. Git-connected deployments for web and mobile apps. Easier on-ramp than configuring EC2/S3/CloudFront manually.



## E7.2  The AWS Console vs CLI vs IaC

The AWS Console is the web dashboard — good for exploration and one-off tasks. The AWS CLI (`aws`) allows scripting infrastructure operations from the terminal. IaC (Infrastructure as Code) tools — Terraform, CDK, CloudFormation — define infrastructure in code. IaC enables version-controlled, reproducible infrastructure. It is the professional standard for anything beyond a single server.




> **✅ EXIT CHECK**

- ✓ What EC2, S3, RDS, Lambda, and CloudFront each do
- ✓ When Lambda is more appropriate than EC2
- ✓ Why RDS is preferred over running your own database on EC2
- ✓ What IaC is and why it is preferable to the console for production infrastructure


---


---



# E8 — GCP

> 📦 **Block E — Deployment**

*Google Cloud Platform*

## Overview

GCP is Google's cloud. It is the second most common cloud in pure infrastructure market share, but Firebase's massive adoption in mobile development makes GCP infrastructure relevant to many developers.



## E8.1  Core Services

- **Cloud Run:** Deploy containerised applications as serverless services. Provide a Docker image; GCP runs it. Automatically scales to zero when idle (saving cost) and scales up under load. The simplest path from a Docker container to production on GCP.

- **Cloud Storage:** GCP's equivalent of S3. Object storage at scale.

- **Cloud SQL:** Managed PostgreSQL and MySQL. GCP's RDS equivalent.

- **Vertex AI:** GCP's ML platform. Managed model training, fine-tuning, and serving. Gemini API access. For integrating Google's AI capabilities.

- **BigQuery:** Serverless data warehouse. Analyses petabytes of data using SQL. Pay per query. The standard for large-scale analytics.



## E8.2  Firebase

Firebase is a set of application development services hosted on GCP infrastructure. Key services:

- **Firestore:** Document database with real-time sync. The mobile developer's most-used Firebase service. (Compare to Convex from Block D.)

- **Firebase Auth:** Authentication: email/password, Google, Apple, anonymous, phone. Simple to integrate. Integrates with Firestore security rules.

- **Firebase Hosting:** Static site hosting on Google's CDN.

- **FCM (Firebase Cloud Messaging):** Push notification delivery for Android (and web). The required intermediary for Android push notifications.

Firebase's weaknesses: limited query capabilities in Firestore, no SQL, vendor lock-in, TypeScript support requires extra configuration. For many mobile apps, it remains a reasonable choice; for applications requiring complex queries or strong typing, Convex or Supabase are often better.




> **✅ EXIT CHECK**

- ✓ What Cloud Run does and how it compares to EC2
- ✓ What BigQuery is used for
- ✓ The Firebase services and what each provides
- ✓ Why FCM is required for Android push notifications
- ✓ Firebase's limitations compared to Convex or Supabase


---


---



# E9 — Azure

> 📦 **Block E — Deployment**

*Microsoft's cloud platform*

## Overview

Azure is Microsoft's cloud platform and the dominant choice in enterprise environments, particularly those already invested in Microsoft technologies (.NET, Active Directory, Office 365). Understanding Azure is relevant for developers working in enterprise contexts or building on the .NET stack.



## E9.1  Core Services

- **App Service:** PaaS for web applications. Deploy Node.js, Python, .NET, Java, and other apps. Managed runtime, autoscaling, deployment slots for staged rollouts.

- **Azure Functions:** Serverless compute. Azure's Lambda equivalent. Strong .NET integration.

- **Blob Storage:** Object storage. Azure's S3 equivalent.

- **Azure SQL:** Managed SQL Server. Strong integration with .NET applications.

- **Entra ID (formerly Azure Active Directory):** Identity and access management. The enterprise standard for user authentication and single sign-on (SSO). If you are building B2B software for enterprises, integration with Entra ID is often a customer requirement.

- **Azure DevOps:** CI/CD pipelines, git repositories, work item tracking. Full-stack development tooling within the Microsoft ecosystem.

- **Static Web Apps:** Competitive with Vercel/Netlify. Integrated with GitHub Actions. Global CDN. Serverless API functions. The Azure choice for frontend deployments.



## E9.2  When Azure

Choose Azure when: the target organisation uses Microsoft identity (Entra ID/SSO), the application is .NET-based, the enterprise already has Azure credits or agreements, or Azure DevOps is the team's CI/CD platform. For greenfield projects without enterprise constraints, AWS or GCP often have better developer experience.




> **✅ EXIT CHECK**

- ✓ What App Service provides compared to Azure Functions
- ✓ What Entra ID is and when it becomes a client requirement
- ✓ What Azure Static Web Apps provides
- ✓ When Azure is the natural choice over AWS or GCP


---


---



# E10 — Deployment Decision Framework

> 📦 **Block E — Deployment**

*Choosing the right platform for the right project*

## Overview

Forty-four chapters of tools and concepts culminate here. This chapter maps project types to platforms, compares costs, and provides a decision framework for the most common deployment scenarios.



## E10.1  The Decision Tree

**Is it a static site (no server-side rendering, no dynamic data)?** → Vercel or Cloudflare Pages. Free tier is generous. Zero configuration.

**Is it a full-stack web app with a React frontend and server functions?** → Vercel (if using Next.js or TanStack Start), Cloudflare Pages + Workers (if edge performance is the priority), or Railway (if you want more control without IaaS complexity).

**Is it a Node.js backend/API server needing a persistent process?** → Railway, Render, Fly.io (all PaaS for containers), or a VPS (Hetzner, DigitalOcean, Hostinger) if cost is paramount.

**Is it a mobile app?** → EAS for builds, App Store / Play Store for distribution, your chosen backend stack for the API.

**Does it need to scale to millions of users?** → AWS, GCP, or Azure with a proper architecture. Hire a DevOps engineer.



## E10.2  Cost Comparison at Scale

| Monthly traffic | Static | Node.js API | Postgres DB |
|---|---|---|---|
| Hobby | Vercel free | Railway $5 | Supabase free |
| 100k users | Vercel Pro $20 | Railway ~$20 | Supabase $25 |
| 1M users | Cloudflare Pages free | Fly.io ~$100 | Managed Postgres ~$100 |
| 10M users | CloudFront ~$40 | EC2 Auto Scaling ~$500 | RDS Multi-AZ ~$500 |

*Estimates only — actual costs vary significantly by usage patterns.*



## E10.3  The Migration Problem

Starting on a PaaS and migrating later is normal and correct. The mistake is trying to build AWS-grade infrastructure for a product with 10 users. The counter-mistake is staying on a PaaS when costs exceed a self-managed VPS by 10x for the same workload. Migrate based on evidence — when the cost or capability limit of the current platform is actually reached.



## E10.4  The Recommended Starting Stack (2025)

- **Web app:** Vite + React + TypeScript → Vercel. Convex for backend. Cloudflare for DNS.

- **Mobile app:** Expo + React Native → EAS Build → App Store + Play Store. Convex for backend.

- **SaaS with billing:** Add Polar (simple) or Stripe (custom). Sentry for errors. PostHog for analytics. AppsFlyer if mobile.

- **When you need a real server:** Railway or Fly.io. Docker. PostgreSQL on Railway or Supabase.




> **✅ EXIT CHECK**

- ✓ The deployment choice for a static site vs a full-stack app vs a Node.js API
- ✓ When to use Railway vs Vercel vs EC2
- ✓ What the cost escalation pattern looks like from free tier to 1M users
- ✓ Why premature infrastructure complexity is an anti-pattern
- ✓ The recommended starting stack and what each part handles
