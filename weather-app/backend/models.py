from sqlalchemy import Column, Integer, String
from database import Base

class Weather(Base):

    __tablename__ = "weather"

    id = Column(Integer, primary_key=True, index=True)

    city = Column(String)

    temperature = Column(String)

    condition = Column(String)