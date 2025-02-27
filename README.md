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
│   ├── server.js           # Entry point for the server-side application
│   ├── syncFirestore.js    # Updates changes from Addresses.xlsx file to Firestore database
│   ├── localServer.js      # Entry point for the server-side application, but fetch data from local
│   ├── syncLocal.js        # Updates changes from Addresses.xlsx file to local
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
   or
   ```
   node backend/localServer.js
   ```
5. **Set up firebase-cli for deployment**
   ```
   firebase login
   ```
   ```
   firebase deploy
   ```
   for local testing
   ```
   firebase serve
   ```
   
## Usage

Dropdown Selection:

Select the province, district, and commune from the dropdown menus. The application will display the corresponding addresses based on the selected options.

Search Feature:

Use the search bar to find locations by name, initials (e.g., "dvh" → "Dich Vong Hau"). Results will display full location details (e.g., "Dich Vong Hau, Cau Giay, Ha Noi)

## Contributing

I don't know, was doing this while having a headache, a cold. Kinda dizzy.

## License

I don't know anything about this part :d 
