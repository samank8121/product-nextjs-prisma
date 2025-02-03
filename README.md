## Project OverView
This project is a multilingual sample application built with Next.js 14. It demonstrates how to display a list of products. It also includes login and signup functionality with JWT authentication. The application provides product details and a cart for adding products. Additionally, it features chatbots that answer user queries about products using LangChain, OpenAI, and Pinecone.

## Demo of Project
[Watch the video](https://www.linkedin.com/posts/samankefayatpour_ecommerce-ai-chatbot-activity-7262047243799592960-G15o?utm_source=share&utm_medium=member_desktop)

## Front-end
- TanStack Query(React Query) for state management and caching.
- Cypress and jest for testing
- i18n for internationalization and translations.
- Metadata for SEO and page information.
- Progressive Web App (PWA) capabilities.

## Backend
- Nextjs Route Handler as api
- LangChain, OpenAI and pinecone
- Prisma as ORM
- PostgreSql as Db

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
