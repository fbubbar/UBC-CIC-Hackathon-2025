
# UBC CIC Summer Generative AI Hackathon 2025


## Local Environment Setup

1. Install Node.js and pnpm

2. Install project dependencies: 

    ```sh
    pnpm install
    ```

3. Create an `.env.local` file with AWS credentials. See `.env.local.example` for a template.

4. Initialise Amplify dev resources:

    ```sh
    npx ampx sandbox
    ```

    Leave this terminal running to auto-update resources based on project changes.

5. Start the development server:

    ```sh
    pnpm dev
    ```
