#!/bin/bash

echo "🧪 Lancement des tests..."

# Test API Node.js
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/)
if [ "$STATUS" == "200" ]; then
  echo "✅ Backend Node.js OK"
else
  echo "❌ Backend Node.js KO (status: $STATUS)"
fi

# Test API Python
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/)
if [ "$STATUS" == "200" ]; then
  echo "✅ Backend Python OK"
else
  echo "❌ Backend Python KO (status: $STATUS)"
fi

# Test Frontend
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$STATUS" == "200" ]; then
  echo "✅ Frontend OK"
else
  echo "❌ Frontend KO (status: $STATUS)"
fi

# Test Stats Python API
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/stats)
if [ "$STATUS" == "200" ]; then
  echo "✅ API Stats Python OK"
else
  echo "❌ API Stats Python KO"
fi

echo "🎉 Tests terminés !"