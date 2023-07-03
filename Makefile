
start-db:
	sudo systemctl start mongod
stop-db:
	sudo systemctl stop mongod
status-db:
	sudo systemctl status mongod
backend-dev:
	cd backend && npm run dev
backend-prod:
	cd backend && npm run prod
frontend:
	cd frontend && npm run start
.PHONY: start-db stop-db status-db backend-dev backend-prod frontend
