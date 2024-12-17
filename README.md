# ChatApp (WhatsApp Clone)

This project is a real-time chat application inspired by WhatsApp. It allows users to send instant messages, track online statuses, and offers other essential features.

**Start Date:** October 2023  
**End Date:** Still in Development

## Technologies Used

- **Frontend:**
  - Vue.js 3
  - Vuex (state management)
  - Vue Router (navigation)
  - SCSS (styling)
  - BEM methodology (CSS structuring)
  - Swiper (for slider effects)
  - axios (for API requests)
- **Backend:**
  - Node.js
  - Express.js
  - PostgreSQL (Database)
  - pg-promise (for database operations)
  - Socket.IO (real-time messaging)
  - JWT (for authentication)
  - bcrypt (for password encryption)

## Key Features

- **User Registration and Authentication:** Secure user registration and authentication using JWT and bcrypt.
- **Real-Time Messaging:** Instant messaging powered by Socket.IO.
- **Online Status Tracking:** Ability to monitor users' online/offline statuses.
- **Search Functionality:** Search for users and messages.
- **User Profile Management:** Manage user profiles with ease.
- **Responsive Design:** A responsive user interface for seamless use across different devices.

## Security Measures

- **CORS Policies:** CORS policies implemented for secure session management.
- **HTTP-only Cookies:** HTTP-only cookies used for session management, providing protection against XSS and CSRF attacks.

## Project Management

- **Trello:** Trello was used for effective project management and continuous development.

## Setup

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/mkathar/ChatApp.git
    ```

2.  **Navigate to the Project Directory:**

    ```bash
    cd ChatApp
    ```

3.  **Install Dependencies:**

    ```bash
    npm install
    ```

4.  **Configure the Database:**

    - Set up a PostgreSQL database and create a new database.
    - Define your database credentials in the `.env` file.
      - Example:
        - PORT=3000
        - DB_USER="username"
        - DB_PASSWORD="password"
        - DB_NAME="database_name"
        - DB_HOST=localhost
        - DB_PORT=5432

5.  **Start the Server:**

    ```bash
    npm start
    ```

6.  **Start the Frontend:**

    ```bash
    npm run dev
    ```

## Usage

1.  Open the application in your browser (the default port is usually 8080 or another available port).
2.  Log in with an existing user account (or register a new account).
3.  Start chatting!

## Project Structure

<pre>
ChatApp/
├── assets/
│   └── scss/
│       ├── base/
│       │   └── _reset.scss
│       ├── components/
│       │   ├── _chat-list.scss
│       │   ├── _contact.scss
│       │   ├── _hi.scss
│       │   ├── _index.scss
│       │   ├── _login.scss
│       │   ├── _newChatModal.scss
│       │   ├── _ourGallery.scss
│       │   ├── _ourWork.scss
│       │   ├── _sidebar-Message.scss
│       │   ├── _sidebar.scss
│       │   ├── _signIn.scss
│       │   ├── _text-FromMessage.scss
│       │   ├── _text-outgoingMessage.scss
│       │   ├── _textHeader.scss
│       │   └── _textNav.scss
│       └── pages/
│           ├── _textArea.scss
│           └── _welcome.scss
├── components/
│   ├── chatList.vue
│   ├── contact.vue
│   ├── conversationList.vue
│   ├── deleteChatModal.vue
│   ├── fromMessage.vue
│   ├── hi.vue
│   ├── login.vue
│   ├── message.vue
│   ├── messageList.vue
│   ├── newChatModal.vue
│   ├── ourGallery.vue
│   ├── ourWork.vue
│   ├── outgoingMessage.vue
│   ├── sidebar.vue
│   ├── sidebarMessage.vue
│   ├── signIn.vue
│   ├── text.vue
│   ├── textHeader.vue
│   ├── textNav.vue
│   └── textWrite.vue
├── pages/
│   ├── process.vue
│   ├── textArea.vue
│   └── welcome.vue
├── router/
│   └── index.js
├── services/
│   └── base/
│       └── baseURL.js
├── database/
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── queries/
│   │   ├── chatQueries.js
│   │   ├── messageQueries.js
│   │   └── userQueries.js
│   ├── config.js
│   ├── db.js
│   └── dbOperations.js
├── store/
│   └── modules/
│       ├── auth.js
│       ├── chats.js
│       ├── messages.js
│       └── ui.js
├── App.vue
├── main.js
└── package.json
</pre>

- `assets`: CSS (SCSS) files and images.
- `components`: Vue.js components.
- `pages`: Vue.js pages.
- `router`: Vue Router configurations.
- `services`: API services.
- `database`: Database-related files.
- `store`: Vuex state management files.

## Contributing

If you want to contribute to this project, follow these steps:

1.  **Fork** the repository.
2.  **Create a Branch** (`git checkout -b feature/my-new-feature`).
3.  **Make Your Changes.**
4.  **Commit** your changes (`git commit -m 'Add some feature'`).
5.  **Push** to the branch (`git push origin feature/my-new-feature`).
6.  Create a **Pull Request**.

## License

This project is licensed under the MIT License.

## Contact

[LinkedIn](https://www.linkedin.com/in/muhammed-mustafa-katar-62a666245/)
