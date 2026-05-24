from pydantic import BaseModel

class WeatherCreate(BaseModel):
    city: str
    temperature: float
    condition: str