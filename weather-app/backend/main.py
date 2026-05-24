from fastapi import FastAPI
from database import engine, SessionLocal
from models import Base, Weather
from schemas import WeatherCreate
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Weather API Running"}


# CREATE
# CREATE
@app.post("/weather")
def create_weather(weather: WeatherCreate):

    db = SessionLocal()

    try:

        new_weather = Weather(
            city=weather.city,
            temperature=weather.temperature,
            condition=weather.condition
        )

        db.add(new_weather)

        db.commit()

        db.refresh(new_weather)

        return new_weather

    finally:
        db.close()

# READ
# READ
@app.get("/weather")
def get_weather():

    db = SessionLocal()

    try:

        weather_data = db.query(Weather).all()

        return weather_data

    finally:
        db.close()

# UPDATE
# UPDATE
@app.put("/weather/{weather_id}")
def update_weather(
    weather_id: int,
    updated_weather: WeatherCreate
):
    db = SessionLocal()

    try:

        weather = db.query(Weather).filter(
            Weather.id == weather_id
        ).first()

        if not weather:
            return {"error": "Weather not found"}

        weather.city = updated_weather.city
        weather.temperature = updated_weather.temperature
        weather.condition = updated_weather.condition
        db.commit()

        db.refresh(weather)

        return weather

    finally:
        db.close()
# DELETE
# DELETE
@app.delete("/weather/{weather_id}")
def delete_weather(weather_id: int):

    db = SessionLocal()

    try:

        weather = db.query(Weather).filter(
            Weather.id == weather_id
        ).first()

        if not weather:
            return {"error": "Weather not found"}

        db.delete(weather)

        db.commit()

        return {"message": "Weather deleted successfully"}

    finally:
        db.close()
