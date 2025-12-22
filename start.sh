#!/bin/bash

echo "Iniciando servidor backend..."
cd server && npm start &

echo "Aguardando servidor iniciar..."
sleep 3

echo "Iniciando frontend..."
cd .. && npm run dev