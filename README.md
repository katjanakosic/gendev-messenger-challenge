# check24-messenger-challenge

This repository includes the code for a messenger web application, created as part of the CHECK24 GenDev Scholarship coding challenge. The messenger is composed of two main components: the server and the client.

## Project Structure

This project structure focuses on the most important files in this project.

```
gendev-messenger-challenge
├── README.md
├── client
│   ├── node_modules           Installed node modules (do not touch)
│   └── src
│       ├── assets             Assets such as images & logos
│       ├── components         Individual components for main views
│       ├── context            Contexts for sharing global states
│       ├── types              DataTransferObjects (DTOs) for server communication
│       └── views              Main views: Hompage and Conversations
└── server
    ├── node_modules           Installed node modules (do not touch)
    └── src
        ├── config             Configuration files for database and authentication
        ├── controllers        Implementation of controllers for messages, users and conversations
        ├── middleware         Middleware handling errors, logging, and authentication
        ├── models             Data models & schemas
        ├── routes             Individual routes for messages, users and conversations
        └── server.ts          Contains Express.js app and sockets

```

## Live Demo

## Project description using MERN Stack

For building a comprehensive and user-friendly messenger application, this project utilizes a MERN (MongoDB, Express.js, React, Node.js) Stack. It provides a cohesive and efficient development experience, where MongoDB serves as the database, Express.js as the server framework, React as the client-side library, and Node.js as the runtime environment for the server-side execution. In addition to that the client utilizes ChakraUI, a popular open-source React component library that provides a set of accessible and customizable UI components for building React applications.

### Server

- Install NodeJS on your machine. It is recommended to use [NVM (hombrew)](https://medium.com/devops-techable/how-to-install-nvm-node-version-manager-on-macos-with-homebrew-1bc10626181).


### Environment variables

The `.env` file in the `server` component is used to store environment variables for the messenger application. All environment variables necessary for this project and its setup can be found there.

The following environment variables are necessary to run the application:

`server`

- `PORT`: port on which the server is running
- `MONGODB_URI`: connection string to the database
- `JWT_SECRET`: secret key for JWT token generation

## Get started

### Run application

1. Clone respository using `git clone https://github.com/katjanakosic/gendev-messenger-challenge.git`
2. Client:
   1. Navigate to the client folder using `cd client`
   2. Install the necessary dependencies using `npm install`
   3. Start the client using `npm run dev`
3. Server:
   1. Navigate to the server folder using `cd server`
   2. Install the necessary dependencies using `npm install`
   3. Start the server using `npm run start`

### Use messenger

**Create new user**

In order to experience and test specific features within the application that are only accessible after user creation, please create two users (customer and service provider):

- Signup & Login:
  Navigate to the signup page and provide the necessary information to create a customer account.
  Repeat the process to create a service provider account.
  Log in using the credentials you've just established.

**Create conversation**

- Search for Conversation Partner: 
Use the functionality that enables users to search for or connect with others. Select a user to initiate a conversation. Verify that the chosen conversation partner receives the request or message.

**Chat with user**
- Chat: After creating the conversation, proceed with message exchange between the customer and service provider. Keep in mind that in order to send files or pictres, the customer first needs to accept the service providers quote offer.

**Rating a user**
- Rate the service: The customer can complete the conversation and afterwards rate the service provider.

## Minimal Requirements
The following functionalities that were given by the challenge represent the minimal requirements the messenger needs to fulfill.

### Conversation View

- Conversations are viewable from both customer and service provider perspectives
- Separate routes ensure cross-device communication

### Conversations Overview

- Simple chat overviews for both customers and service providers
- Clickable chats for easy navigation

### Persistence

- Conversations are mutable and persisted in a database/store with a unique identifier

### Scrolling Pagination

- Users can scroll through conversation history with efficient pagination support

### Attachments (Images and PDFs)

- Customers and service providers can send messages with optional attachments

### Masking of Sensitive Information

- Contactable data (phone number, email, URL) is masked when the conversation status is "quoted"

### Show Sent Message Without Refreshing

- Messages appear in the chat in real-time without the need for page refreshing

### Hide Message Field in Rejected State

- If a conversation status is "rejected," the message input field disappears, and no further actions are possible

### Request Customer Reviews

- Service providers can request reviews from customers within the conversation

## Additional Functionality

While the project meets the minimum reequirements it also includes a few additional functionalities to make the messenger not just functional, but also user-friendly and feature-rich:

1. **Opening New Email and Browser Window:** Clicking on the chat partner's email icon opens a new email. Opening the service provider's URL in a new browser window is also supported.

2. **Real-Time Messages with Socket.io:** The messenger application leverages Socket.io to enable real-time communication between users. Socket.io ensures that messages appear in the chat in real-time, creating a dynamic and responsive communication environment.

3. **Notifications:** The user gets notified if a new message is received.

4. **User Search:** Customers can search for service providers, but not vice versa.

5. **Typing Indicator:** A typing indicator is displayed when a conversation partner is typing, providing a more interactive and responsive user experience.

6. **JWT Authentication:** The messenger uses JWT authentication to ensure secure and authorized access to the application.

7. **Extendable/Generic API Format:** The API format is extendable and generic, extending the required functionality and allowing for easy integration of additional types.
