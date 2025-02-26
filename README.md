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
├── backend
│   ├── server.js        # Entry point for the server-side application
│   ├── syncFirestore.js # Updates changes from Addresses.xlsx file to Firestore database
├── data
│   └── Addresses.xlsx   # Excel file containing address data
├── package.json          # npm configuration file
├── .gitignore            # Files and directories to ignore by Git
├── .env.example          # Example environment variables file
├── LICENSE               # License information for the project
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

3. **Set up environment variables**:
   ```
   cp .env.example .env
   ```
Open .env and configure FIREBASE_KEY_PATH with the correct Firebase service account JSON path

4. **Run the server**:
   ```
   node backend/server.js
   ```
   
## Usage

Dropdown Selection:

Select the province, district, and commune from the dropdown menus. The application will display the corresponding addresses based on the selected options.

Search Feature:

Use the search bar to find locations by name, initials (e.g., "dvh" → "Dich Vong Hau"), or partial text (e.g., "am" → "Ha Nam"). Results will display full location details (e.g., "Dich Vong Hau, Cau Giay, Ha Noi

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

I don't know anything about this part :d 
