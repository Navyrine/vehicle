# Description

Project ini merupakan CRUD sederhana mengenai mobil, tujuan dari pembuatan project ini adalah untuk menerapkan idempotency dan juga menerapkan teknik search data.

## Tech Stack

- Express js
- Postgresql

## Features

- Insert data
- Update data
- Delete data
- Show all data
- Filter data by fuel type
- Auto complete sugestion (make and model)
- Search data by make, price range, year, and fuel_type
- Cursor pagination
- Idempotency

## Environment Variable

<table>
  <tr>
    <th>Variable</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>PORT</td>
    <td>YOUR_PORT</td>
  </tr>
  <tr>
    <td>DATABASE_URL</td>
    <td>YOUR_LINK_DATABASE OR postgresql://username:<password>@localhost:5432/db_name</td>
  </tr>
  <tr>
    <td>NODE_ENV</td>
    <td>YOUR_MODE</td>
  </tr>
  <tr>
    <td>LOG_LEVEL</td>
    <td>YOUR_LOG_LEVEL</td>
  </tr>
</table>

## Setup

### Clone Repository

```
git clone https://github.com/Navyrine/vehicle.git
```

### Backend

#### Install Node Modules

```
cd backend
npm install
```

#### Run Server

```
npx nodemon index.js
```

### Documentation

#### Install Node Modules

```
cd api-docs
npm install
```

#### Run Documentation

```
npm run dev
access url http://localhost:3000/api
```
