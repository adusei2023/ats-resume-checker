#!/bin/bash

echo "Starting ATS Resume Checker..."

# Function to clean up background processes
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT

# Start backend server
echo "Starting backend server on port 3001..."
cd server && node index.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend development server
echo "Starting frontend server on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 ATS Resume Checker is now running!"
echo "📖 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait
