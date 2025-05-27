# BackendHoliday

This project is a backend server built with Node.js. It uses Firebase for authentication and data storage. Please follow the steps below to install, configure, and run the project.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Firebase project and service account key (JSON file)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/arjunprajapat923/BackendHoliday.git
cd BackendHoliday
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

**Note:** The required Firebase configuration JSON file has been removed from this repository for security reasons.

- Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
- Navigate to **Project Settings > Service Accounts**.
- Click on **Generate new private key** and download the JSON file.
- Place this JSON file in the root directory of your project (e.g., `serviceAccountKey.json`).

**Update your code** to use the correct path to your JSON key file if necessary.

### 4. Run the Server

```bash
node server.js
```

The server should now be running! By default, it will listen on the port specified in your `server.js` file.

## Troubleshooting

- If you get errors related to Firebase, ensure your service account JSON is valid and correctly referenced in your code.
- Make sure all dependencies are installed with `npm install`.

## Contributing

Feel free to fork this repository and submit pull requests.

## License

This project is licensed under the MIT License.