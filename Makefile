
start-db:
	sudo systemctl start mongod
stop-db:
	sudo systemctl stop mongod
status-db:
	sudo systemctl status mongod
backend-dev:
	cd backend && npm start dev
backend-prod:
	cd backend && npm start prod

.PHONY: start-db stop-db status-db backend-dev backend-prod
