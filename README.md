# mac398-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

## Docker Deployment

### Build Docker Image

```sh
docker build -t tom4dock/mac398fe:3.0 .
```

### Run Container

```sh
# Run in background
docker run -d -p 30003:80 tom4dock/mac398fe:3.0

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>
```

### Access Application

The application will be available at `http://localhost:30003` or your server's IP:30003.

**Note**: The Nginx configuration uses `try_files` to route all requests to `index.html`, enabling Vue Router to handle client-side routing. This means any non-existent routes will be served `index.html` and handled by Vue Router.

## GCP Cloud Run Deployment (CI/CD)

### Prerequisites

1. **GCP Project Setup**
   - Create a GCP project at [Google Cloud Console](https://console.cloud.google.com/)
   - Note your Project ID (you'll need it later)

2. **Enable Required APIs**
   ```sh
   gcloud services enable cloudrun.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

3. **Create Artifact Registry Repository**
   ```sh
   gcloud artifacts repositories create mac398-app \
     --repository-format=docker \
     --location=asia-east1 \
     --description="Docker repository for mac398-app"
   ```

4. **Create Service Account for GitHub Actions**
   ```sh
   # Create service account
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions deployer"

   # Grant permissions
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"

   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"

   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/artifactregistry.writer"

   # Generate JSON key
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@PROJECT_ID.iam.gserviceaccount.com
   ```

5. **Configure GitHub Secrets**

   Go to your GitHub repository → Settings → Secrets and variables → Actions

   Add the following secrets:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Complete content of the `key.json` file generated above

### Automatic Deployment

Once you've completed the prerequisites:

1. Push to `main` branch
2. GitHub Actions will automatically:
   - Run tests (CI)
   - Build Docker image
   - Push to Artifact Registry
   - Deploy to Cloud Run
   - Provide deployment URL

### View Deployment

After deployment completes:

```sh
# Get service URL
gcloud run services describe mac398-app --region=asia-east1 --format='value(status.url)'
```

Or check the GitHub Actions log for the deployment URL.

### Manual Deployment (Optional)

If you want to deploy manually:

```sh
# Build and push image
docker build -t asia-east1-docker.pkg.dev/PROJECT_ID/mac398-app/frontend:latest .
docker push asia-east1-docker.pkg.dev/PROJECT_ID/mac398-app/frontend:latest

# Deploy to Cloud Run
gcloud run deploy mac398-app \
  --image asia-east1-docker.pkg.dev/PROJECT_ID/mac398-app/frontend:latest \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 80
```

### Cost Information

- Cloud Run offers 2 million requests per month for free
- Charges only when your application is handling requests
- Automatically scales down to zero when not in use (zero cost during idle time)
