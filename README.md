## Getting Started
1. create .env file with these keys:
 - CONNECTION_STRING //connection string
 - NEXT_PUBLIC_API_ADDRESS //address of api. for local use this: http://localhost:3000/api/
 - PINECONE_API_KEY
 - PINECONE_HOST_URL
 - OPENAI_API_KEY 
2. Apply Schema Changes to Database: yarn prisma push
3. yarn install & yarn dev

## Run Test
```bash
# unit tests
$ yarn test

# e2e test
$ yarn cypress:open
```
## Stories
```bash
$ yarn storybook
```

## Project OverView
This project is a sample application built with Next.js 14.2.9. It demonstrates how to display a list of products in multiple languages. which product's description and rate are indexed to find by chatbots

## Front-end
- TanStack Query(React Query) for state management and caching.
- Cypress and jest for testing
- i18n for internationalization and translations.
- Metadata for SEO and page information.
- Progressive Web App (PWA) capabilities.

## Backend
- Nextjs Route Handler as api
- OpenAI for embeding and pinecone for saving as vector
- Prisma as ORM
- PostgreSql as Db

## Video
[Watch the video](https://www.linkedin.com/posts/samankefayatpour_ecommerce-ai-chatbot-activity-7262047243799592960-G15o?utm_source=share&utm_medium=member_desktop)
