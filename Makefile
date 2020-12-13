.PHONY: refresh
refresh:
	cd docker && \
	docker-compose down && \
	docker-compose up --detach
