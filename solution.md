## Micro-frontend architecture solution

This document proposes how to split this Angular app into a host shell and remotes using `@angular-architects/native-federation`, with clear shared dependency and versioning rules.

### 1. Important consideration (one of two approaches)

First, you will need to decide what the purpose is of the remotes. One of two paths exist:
  1. Approach 1: They can either be used as re-usabled micro-frontend components (as seen in the `mfe-host-shell` MFE demo). An example would be loading the 2 Catalog remotes/MFEs in the host shell, passing two different sets of product data. In this implementation, the host shell is responsible for more logic, controlling what data is passed to the remotes.
  2. Approach 2: Have the host shell provide the global layout, theming, authentications, etc. It then also controls the top-level Angular router and lazy-loads remote MFEs over HTTP at runtime, but the logic of the MFEs/remotes are all self-contained (feature UX and data fetching is delegated to remotes or shared libraries). 

#### 1.1. Approach 1 (as seen in demo)

##### 1.1.1. High-level split

- **Host shell (container app)**
  - Works as an orchestration layer that composes remote components onto one screen.
  - Owns interaction logic for demo controls (for example, selecting which product data to pass down).
  - Creates remote components dynamically and sets their inputs.

- **Remote app (`remote-app`)**
  - Exposes reusable standalone feature components, not route-level feature modules.
  - In this demo, the exposed entries are:
    - `./ProductDetailsComponent`
    - `./CatalogComponent`
  - Owns rendering and feature behavior inside each component once inputs are received.

- **Composition style used**
  - "Remote widget/component composition" rather than full remote route ownership.
  - Host can place multiple remote components together and feed each different data/state.

##### 1.1.2. Technical approach (Native Federation style)

The implementation uses `@angular-architects/native-federation` with explicit component exposures:

- **Remote configuration**
  - `federation.config.js` exposes standalone components directly from the shared feature paths.
  - Shared packages are configured with singleton + strict versioning.

- **Host loading**
  - Host calls `loadRemoteModule({ remoteName, exposedModule })` for each component it needs.
  - Host resolves the Angular component export from the loaded module.
  - Host creates the component through `ViewContainerRef.createComponent(...)` and passes contract inputs (status/data).

- **Contract focus**
  - Exposed module key, exported symbol, and input names are treated as integration contracts.
  - Example: for catalog, the host passes `pageStatus` and `products`; for product details, `productStatus` and `product`.

#### 1.2. Approach 2

##### 2.1.1. High-level split

- **Host shell (container app)**
  - Provides global layout (header, navigation, footer), theming, authentication integration, and cross-cutting concerns (logging, error boundary, feature flags).
  - Owns the top-level Angular router and lazy-loads remote MFEs over HTTP at runtime.
  - Contains only minimal business logic; delegates feature UX and data fetching to remotes or shared libraries.

- **Remote: Catalog MFE**  
  - Contains `CatalogPageComponent`, `ProductGrid`, `FiltersComponent`, `NoticeBox`, and product browsing flows.  
  - Exposes at least one routed entry point, e.g. `./CatalogModule` or a standalone route configuration, mapped by the host to `/catalog`.  
  - Depends on shared `ProductService` and shared domain models so that behavior is consistent across the ecosystem.

- **Remote: Admin MFE (optional)**  
  - Contains current and future admin-only pages (e.g. feature toggles, configuration, product management).  
  - Exposed under `/admin` and secured by the host via route guards / auth.

- **Future remotes**  
  - Additional features (e.g. reporting, analytics) can follow the same pattern: small, cohesive domains, independently deployable, mounted under distinct routes.

##### 2.1.2. Technical approach (Module Federation style)

Although Angular 21+ can be wired to different bundlers, a pragmatic approach is to use **Webpack Module Federation** (either directly or via Angular builder plugins) to compose the host and remotes:

- **Host shell**  
  - Configured as the **Module Federation host**.  
  - Declares remotes by name, each with its `remoteEntry.mjs` URL (per environment).  
  - Uses lazy routes that call a helper like `loadRemoteModule` to resolve remote Angular modules/standalone routes at runtime:
    - Example route in the host:  
      - `/catalog` → loads the remote `catalog` MFE entry.  
      - `/admin` → loads the remote `admin` MFE entry.

- **Remotes**  
  - Each remote is an Angular app with its own build and deployment pipeline, exposing one or more Angular entry points through Module Federation.  
  - Example exposed APIs:
    - `./CatalogRoutes` → exported `Route[]` for the catalog feature.  
    - `./AdminRoutes` → exported `Route[]` for admin pages.
  - The host imports these route arrays via `loadRemoteModule` and plugs them into its router configuration.

This keeps the host focused on shell concerns while letting each domain team own and deploy its remote independently.


### Shared dependencies & runtime singletons

Use singleton sharing for framework/runtime packages:

- `@angular/core`
- `@angular/common`
- `@angular/router`
- `@angular/forms`
- `rxjs`
- `tslib`

The current demo config uses:
- `shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })`

This is a strong baseline for avoiding duplicate Angular runtimes and DI fragmentation.

### Versioning strategy

To support independent deployment while avoiding dependency hell:

- **Semantic versioning for each MFE**  
  - Treat host and each remote as separate deployable artifacts with their own versions (`host@x.y.z`, `catalog@a.b.c`, `admin@d.e.f`).  
  - Use **SemVer** strictly:
    - `MAJOR`: breaking changes in public contracts (routes, shared APIs, or data contracts).  
    - `MINOR`: backwards-compatible feature additions.  
    - `PATCH`: bug fixes and internal changes.

- **Lockstep for critical shared dependencies**  
  - For Angular core and other DI-related packages, keep host and all remotes on the **same major (and usually the same minor) version**.  
  - Configure shared dependencies with strict or semi-strict ranges (e.g. `^21.2.0` everywhere) and enforce this via workspace tooling or CI checks.

- **Shared library versioning**  
  - If you extract shared libraries into their own packages:
    - Version them separately (also SemVer).  
    - Host and remotes depend on compatible ranges (e.g. `^1.3.0`).  
    - When you introduce a breaking change to a shared library, bump its major and upgrade host/remotes in a coordinated way.

- **Deployment strategy**  
  - Host shell:
    - Typically pinned to known-good remote versions in production (e.g. via manifest or environment configuration).  
    - Can be updated less frequently but must remain compatible with the set of remote versions it loads.
  - Remotes:
    - Can be deployed more frequently as long as they remain compatible with the host’s expectations (same shared dependency major versions, no breaking contract changes).

### Testing and safety nets

To keep the micro-frontend setup maintainable:

- **Unit tests inside each remote**  
  - Continue to use Angular’s test runner (`ng test`) per remote app to validate components and services.

- **Contract tests between host and remotes**  
  - Lightweight tests or smoke checks that load each remote’s exposed routes in isolation and verify that:
    - The remote starts correctly with the shared dependency versions used by the host.  
    - The exposed Angular routes/components can render with typical data.

- **End-to-end tests at the host level**  
  - Use Cypress (already present in the project) from the host shell to exercise cross-MFE flows and ensure that integration across remotes works end-to-end in realistic scenarios.

This combination of clear boundaries, shared libraries, consistent dependency versions, and layered testing gives you a micro-frontend architecture that is modular and independently deployable while remaining robust and maintainable.

