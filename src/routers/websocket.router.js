const express = require('express');
const expressWs = require('express-ws');

const WebSocketRouter = express.Router();
expressWs(WebSocketRouter);

// Хранилище подключенных админов
const adminClients = new Set();

// Хранилище подключенных пользователей
const userClients = new Set();

// WebSocket-эндпоинт для клиентов
WebSocketRouter.ws('/client', (ws) => {
	console.log('Client connected');

	// Добавляем клиента в хранилище
	userClients.add(ws);

	ws.on('message', (message) => {
		console.log('Message from client:', message);

		// Отправляем сообщение только администраторам
		adminClients.forEach((adminWs) => {
			if (adminWs.readyState === ws.OPEN) {
				adminWs.send(message);
			}
		});
	});

	// Удаляем клиента при закрытии соединения
	ws.on('close', () => {
		userClients.delete(ws);
		console.log('Client disconnected');
	});
});

// WebSocket-эндпоинт для админов
WebSocketRouter.ws('/admin', (ws) => {
	console.log('Admin connected');

	// Добавляем администратора в хранилище
	adminClients.add(ws);

	ws.on('message', (message) => {
		console.log('Message from admin:', message);

		// Отправляем сообщение всем подключенным клиентам
		userClients.forEach((clientWs) => {
			if (clientWs.readyState === ws.OPEN) {
				clientWs.send(message);
			}
		});
	});

	// Удаляем администратора при закрытии соединения
	ws.on('close', () => {
		adminClients.delete(ws);
		console.log('Admin disconnected');
	});
});

module.exports = WebSocketRouter;
