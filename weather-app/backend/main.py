from fastapi import FastAPI
from database import engine, SessionLocal
from models import Base, Weather
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
@app.post("/weather")
def create_weather(city: str, temperature: str, condition: str):

    db = SessionLocal()

    weather = Weather(
        city=city,
        temperature=temperature,
        condition=condition
    )

    db.add(weather)

    db.commit()

    db.refresh(weather)

    return weather

# READ
@app.get("/weather")
def get_weather():

    db = SessionLocal()

    weather_data = db.query(Weather).all()

    return weather_data

# UPDATE
@app.put("/weather/{weather_id}")
def update_weather(
    weather_id: int,
    city: str,
    temperature: str,
    condition: str
):

    db = SessionLocal()

    weather = db.query(Weather).filter(
        Weather.id == weather_id
    ).first()

    weather.city = city
    weather.temperature = temperature
    weather.condition = condition

    db.commit()

    db.refresh(weather)

    return weather

# DELETE
@app.delete("/weather/{weather_id}")
def delete_weather(weather_id: int):

    db = SessionLocal()

    weather = db.query(Weather).filter(
        Weather.id == weather_id
    ).first()

    db.delete(weather)

    db.commit()

    return {"message": "Weather deleted successfully"}
