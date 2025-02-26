# Address Finder Application

This project is a web application that allows users to find addresses based on their input. It utilizes data from an Excel file containing address information, providing a user-friendly interface for selecting provinces, districts, communes, and specific addresses.

## Project Structure

```
address-finder-app
├── public
│   ├── index.html        # HTML structure of the web application
│   ├── styles.css       # CSS styles for the application
│   └── scripts
│       └── main.js      # Front-end JavaScript functionality
├── src
│   ├── server.js        # Entry point for the server-side application
│   └── routes
│       └── addressRoutes.js # Routes for handling address-related requests
├── data
│   └── Addresses.xlsx   # Excel file containing address data
├── package.json          # npm configuration file
├── .gitignore            # Files and directories to ignore by Git
└── README.md             # Documentation for the project
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd address-finder-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the server**:
   ```
   node src/server.js
   ```

4. **Open the application**:
   Navigate to `http://localhost:3000` in your web browser.

## Usage

- Select the province, district, and commune from the dropdown menus.
- The application will display the corresponding addresses based on the selected options.
- You can view the address details in the results section.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.