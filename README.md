## Multi-Tenant NestJS API

### About

NestJS RESTful API supporting runtime database switching for multi-tenancy

[Spec](https://github.com/lvnhmd/multidb-api/blob/main/spec/spec.pdf)

---

### Running in Development

`git clone https://github.com/lvnhmd/bullhorn-multidb-api.git`

`cd bullhorn-multidb-api`

Run `docker-compose up --build` to start the application.

The following databases will be created in Docker containers for **Tenant1** and **Tenant2** 
and seeded with data:

`master_db (port 5432)`

`tenant1_db (port 5433)`

`tenant2_db (port 5434)`

---

### API Endpoint Documentation

The OpenAPI/Swagger documentation can be accessed at http://localhost:3000/api when the application is running

---

### Testing

`cd bullhorn-multidb-api`

`yarn test`

---

### Configuring Extra Tenants

1. Edit `docker-compose.yml` to add new tenant database services

2. Update the `seeder.service.ts` to include the new tenant configurations

---

### TODO

- [ ] Add examples for request bodies in Swagger documentation 
- [ ] Fix failing service tests 
- [ ] Add end to end tests
- [ ] Move database credentials to environment variables and out of source code
- [ ] Create repository classes for each entity and refactor services to use them
- [ ] Add example to demonstrate a one to many relationship ( e.g User has Tasks )
- [ ] Add authentication using JWT token and make use of guards
- [ ] Use Redis to cache the response when getting a resource
- [ ] Use interceptors for error logs
