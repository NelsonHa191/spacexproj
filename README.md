# SpaceX Explorer

Welcome to the **SpaceX Explorer** website! 🚀 This project allows you to view the latest SpaceX updates and launches using the SpaceX API. Note that the API has been discontinued, but the website still functions using the last known data.

## Features

- View the latest SpaceX launches.
- Check out SpaceX mission details and updates.
- User-friendly interface with a clean, responsive design.

## Requirements

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Python](https://www.python.org/) (for running certain backend scripts, if applicable)

## Setup Instructions

### 1. Clone the repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/yourusername/spacex-explorer.git
cd spacex-explorer
```
### 2. Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install the dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
node server.js
```

### 3. Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install the dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

The frontend will now be running and can be accessed in your browser at http://localhost:3000 (or the relevant port configured).

## Project Structure

- `server/` - Contains the backend code to fetch SpaceX API data and serve it to the frontend.
- `client/` - Contains the frontend code for the SpaceX Explorer website.
- `.gitignore` - Specifies which files and folders should be ignored by Git (like `node_modules/` and `.env` files).
- `server.js` - Main file to start the backend server.
- `package.json` - Contains the metadata and dependencies for both frontend and backend.
- `README.md` - This file with project documentation.

## Contributing

Feel free to fork the repository and submit pull requests. If you encounter any issues or have feature requests, please create an issue on GitHub.

### How to Contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -am 'Add new feature'`.
4. Push to your branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).











