# ChatApp (WhatsApp Clone)

This project is a real-time chat application inspired by WhatsApp. It allows users to send instant messages, track online statuses, and offers other essential features.
[🇬🇧 Turkish README](README.tr.md)
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

- 🔐 **User Registration and Authentication:** Secure user registration and authentication using JWT and bcrypt.
- ⚡ **Real-Time Messaging:** Instant messaging powered by Socket.IO.
- 👀 **Online Status Tracking:** Ability to monitor users' online/offline statuses.
- 🔍 **Search Functionality:** Search for users and messages.
- 👤 **User Profile Management:** Manage user profiles with ease.
- 📱 **Responsive Design:** A responsive user interface for seamless use across different devices.

### Upcoming Features

- 🏷️ Username tag system (username#1234)
- ✓ Read receipts
- ✏️ Message editing
- 📸 Story sharing
- 📎 File sharing
- 🔐 Two-factor authentication
- 🌐 Multi-language support
- 🎨 Theme customization
- 🔤 In-app language selection

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

## Database Schema

The application uses PostgreSQL with the following table structure:

### Tables

#### users

- `user_id` - serial (Primary Key)
- `user_name` - varchar(50)
- `user_email` - varchar(100)
- `password_hash` - varchar(255)
- `profile_picture_url` - varchar(255)
- `bio` - text
- `created_at` - timestamp with time zone
- `last_seen` - timestamp with time zone

#### chats

- `chat_id` - serial (Primary Key)
- `chat_type` - varchar(20)
- `chat_name` - varchar(100)
- `created_at` - timestamp with time zone

#### chat_participants

- `chat_id` - integer (Foreign Key)
- `user_id` - integer (Foreign Key)
- `joined_at` - timestamp with time zone

#### messages

- `message_id` - serial (Primary Key)
- `chat_id` - integer (Foreign Key)
- `sender_id` - integer (Foreign Key)
- `message_text` - text
- `sent_at` - timestamp with time zone
- `is_edited` - boolean
- `edited_at` - timestamp with time zone

#### user_settings

- `user_id` - integer (Foreign Key)
- `theme` - varchar(20)
- `notification_enabled` - boolean
- `language` - varchar(10)
- `font_size` - varchar(10)
- `last_updated` - timestamp with time zone

#### contacts

- `user_id` - integer (Foreign Key)
- `contact_id` - integer (Foreign Key)
- `contact_name` - varchar(100)
- `added_at` - timestamp with time zone

### Database Initialization

1. Create a new PostgreSQL database:

```sql
CREATE DATABASE chatapp;
```

2. Execute the schema creation script:

```sql
-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE
);

-- Create chats table
CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    chat_type VARCHAR(20) NOT NULL,
    chat_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_participants table
CREATE TABLE chat_participants (
    chat_id INTEGER REFERENCES chats(chat_id),
    user_id INTEGER REFERENCES users(user_id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(chat_id),
    sender_id INTEGER REFERENCES users(user_id),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE
);

-- Create user_settings table
CREATE TABLE user_settings (
    user_id INTEGER REFERENCES users(user_id) PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    font_size VARCHAR(10) DEFAULT 'medium',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE contacts (
    user_id INTEGER REFERENCES users(user_id),
    contact_id INTEGER REFERENCES users(user_id),
    contact_name VARCHAR(100),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, contact_id)
);
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
