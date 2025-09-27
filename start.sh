#!/bin/bash

echo "Starting KalamKriti Handloom Platform..."
echo

echo "Installing backend dependencies..."
npm install

echo
echo "Starting backend server..."
echo "Backend will run on http://localhost:3000"
echo

# Start the server in background
npm run dev &

echo
echo "Backend server started!"
echo
echo "To view the website:"
echo "1. Open handloom.html in your browser"
echo "2. Or use a local server like Live Server"
echo
echo "Press Ctrl+C to stop the server"
echo

# Wait for user input
read -p "Press Enter to continue..."
