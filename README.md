# kgm-app

Frontend React + TypeScript + Vite.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Docker

Este proyecto se levanta junto con `kgm-api` usando el `docker-compose.yml` de ese repositorio:

```bash
cd ../kgm-api-spring
docker compose up -d --build
```

El frontend queda disponible en http://localhost:5173 con recarga en caliente.

La pantalla de Docentes usa `VITE_API_URL` y `VITE_ESCUELA_ID`. Al correr con Docker Compose, el ID se configura con `ESCUELA_ID` en el `.env` del repositorio `kgm-api`; para desarrollo local, copia `.env.example` como `.env` y ajusta los valores.
