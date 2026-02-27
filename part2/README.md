# HBnB - AirBnB Clone

A RESTful API built with Python and Flask, inspired by AirBnB. This project implements the business logic and API endpoints for managing users, places, reviews, and amenities.

---

## Project Structure

```
hbnb/
├── app/
│   ├── __init__.py            # Flask app factory
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── users.py       # User endpoints
│   │       ├── places.py      # Place endpoints
│   │       ├── reviews.py     # Review endpoints
│   │       └── amenities.py   # Amenity endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py            # User model
│   │   ├── place.py           # Place model
│   │   ├── review.py          # Review model
│   │   └── amenity.py         # Amenity model
│   ├── services/
│   │   ├── __init__.py        # Facade singleton
│   │   └── facade.py          # HBnBFacade - communication between layers
│   ├── persistence/
│   |    ├── __init__.py
│   |    └── repository.py      # In-memory repository (temporary storage)
|   └── tests/
|       ├── unittest_hbnb.py
│       └── Testing_report.md
├── run.py                     # Application entry point
├── config.py                  # Environment configuration
├── requirements.txt           # Python dependencies
└── README.md
```

---

## Architecture

The project follows a **3-layer architecture**:

- **Presentation Layer** (`api/`) — Defines the API routes and handles HTTP requests/responses using Flask and flask-restx.
- **Business Logic Layer** (`models/`) — Contains the core entities (User, Place, Review, Amenity) and their rules.
- **Persistence Layer** (`persistence/`) — Handles data storage. Currently uses an in-memory repository (data is lost on restart). Will be replaced by a SQL database in a future part.

Communication between layers is managed through the **Facade pattern** (`services/facade.py`), which acts as a single entry point between the API and the underlying logic/storage.

---

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/hbnb.git
cd hbnb
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

```bash
python run.py
```

The API will be available at: `http://127.0.0.1:5000`  
Interactive API documentation (Swagger UI): `http://127.0.0.1:5000/api/v1/`

### cURL Examples (Terminal Only)

## Create a user

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/users/" -H "Content-Type: application/json" -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
}'
```

## Create an amenity

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/amenities/" -H "Content-Type: application/json" -d '{
    "name": "WiFi"
}'
```

## Create a place

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/places/" -H "Content-Type: application/json" -d '{
    "title": "Cozy Studio",
    "description": "Near center",
    "price": 80,
    "latitude": 48.8566,
    "longitude": 2.3522,
    "owner_id": "<OWNER_ID>",
    "amenities": ["<AMENITY_ID>"]
}'
```

## Create a review

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/reviews/" -H "Content-Type: application/json" -d '{
    "text": "Great place",
    "rating": 5,
    "user_id": "<REVIEWER_ID>",
    "place_id": "<PLACE_ID>"
}'
```

## Get reviews by place

```bash
curl -X GET "http://127.0.0.1:5000/api/v1/places/<PLACE_ID>/reviews"
```


---

## API Endpoints

| Resource   | Method | Endpoint                        | Description              |
|------------|--------|---------------------------------|--------------------------|
| Users      | GET    | `/api/v1/users`                 | List all users           |
| Users      | POST   | `/api/v1/users`                 | Create a new user        |
| Users      | GET    | `/api/v1/users/<id>`            | Get a user by ID         |
| Users      | PUT    | `/api/v1/users/<id>`            | Update a user            |
| Places     | GET    | `/api/v1/places`                | List all places          |
| Places     | POST   | `/api/v1/places`                | Create a new place       |
| Places     | GET    | `/api/v1/places/<id>`           | Get a place by ID        |
| Places     | PUT    | `/api/v1/places/<id>`           | Update a place           |
| Reviews    | GET    | `/api/v1/reviews`               | List all reviews         |
| Reviews    | POST   | `/api/v1/reviews`               | Create a new review      |
| Reviews    | GET    | `/api/v1/reviews/<id>`          | Get a review by ID       |
| Reviews    | PUT    | `/api/v1/reviews/<id>`          | Update a review          |
| Reviews    | DELETE | `/api/v1/reviews/<id>`          | Delete a review          |
| Amenities  | GET    | `/api/v1/amenities`             | List all amenities       |
| Amenities  | POST   | `/api/v1/amenities`             | Create a new amenity     |
| Amenities  | GET    | `/api/v1/amenities/<id>`        | Get an amenity by ID     |
| Amenities  | PUT    | `/api/v1/amenities/<id>`        | Update an amenity        |

---

## Dependencies

```
flask
flask-restx
```

Install them with:
```bash
pip install -r requirements.txt
```

---

## Authors

Nicolas DA SILVA (NicolasDS83600)
Joshua BURLE (Joshuaburle)
Alexandre GUILLAMON (AlexandreG83)