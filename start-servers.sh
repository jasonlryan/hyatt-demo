#!/bin/bash

echo "🔄 Killing existing processes..."

# Kill any processes using ports 3000, 5173, 5174
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Kill any node/nodemon processes
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "nodemon.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "✅ Processes killed"

# Wait a moment for ports to be freed
sleep 2

echo "🚀 Starting servers..."

# Start backend in background
cd hive
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend in background
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Servers started!"
echo "📊 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup when script is terminated
cleanup() {
    echo ""
    echo "🔄 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    
    # Kill any remaining processes
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    lsof -ti:5174 | xargs kill -9 2>/dev/null || true
    
    echo "✅ Servers stopped"
    exit 0
}

# Set up trap to cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 
