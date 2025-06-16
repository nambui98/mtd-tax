# monorepo

Made by [nambui98](https://github.com/nambui98)

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from '@workspace/ui/components/button';
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build
```

## Drizzle CLI Commands

Here are some useful Drizzle CLI commands for database management:

```bash
# Generate migrations
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (GUI for database management)
pnpm db:studio

# Check database schema
pnpm db:check
```

For more information about Drizzle CLI, visit the [official documentation](https://orm.drizzle.team/docs/overview).
