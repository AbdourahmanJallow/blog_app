### Setup

    npm run dev

### Blog App | REST API

### Technologies Used

1. Node js
2. Express
3. MongoDB

<!-- Controllers -->

### Authentication

1. User authentication

### Blog model & blog routes

1. Define blog schema
    - include fields like title, content, blog_photo, author(current loggedIn user)
2. Create blog, get blog(s),update and delete
    - only loggedIn users should be allowed to post a blog
    - only blog author should be able to update & and delete blog
    - fetch blogs and populate the blog author
3. Add comment to a blog

### User model & user routes

1. Define User schema
    - name, email, password, role, and blogs[]
    - register user, login and logout
    - return token after register and login to access private routes
    - Only loggedIn users can create and manage blogs
