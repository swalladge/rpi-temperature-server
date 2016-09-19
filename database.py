
# sqlalchemy parts we want to use
from sqlalchemy import create_engine, Column, Integer, Float, Sequence, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# for logging in the future
from tornado.log import gen_log

# other local modules
import config
import utils

Base = declarative_base()

class Temperature(Base):
    __tablename__ = 'temps'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)

    timestamp = Column(Integer, nullable=False)
    temperature = Column(Float, nullable=False)

    def __repr__(self):
        return "Temperature {}°C at {}".\
               format(self.temperature, self.timestamp)

    def dict(self):
        return {
                'temperature': self.temperature,
                'timestamp': self.timestamp
                }

class db():
    def __init__(self, url):
        """ inits the database """
        self.engine = create_engine(url, echo=False)
        self.metadata = Base.metadata
        self.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()

    def create_all(self):
        """ create all the tables and such """
        self.metadata.create_all(self.engine)

    def get_current_temperature(self):
        query = self.session.query(Temperature, func.max(Temperature.timestamp))
        t = query.one()
        # note: it's a two tuple - (temperature_object, timestamp)
        return t[0].dict()

    def get_temperature_list(self, lower, upper):
        """ returns a list of temperatures within (and including) the lower and
        upper timestamp bounds """

        query = self.session.query(Temperature)
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        # return a list of dictionaries
        temps = list(map(lambda t: t.dict(), filtered.all()))
        return temps

    def save_temperature(self, temp, time):
        """ log the temperature in the database """

        t = Temperature()
        t.timestamp = time
        t.temperature = temp
        self.session.add(t)
        return self.commit()

    def get_temperature_max(self, lower, upper):
        """ returns the maximum temperature for range """
        # TODO
        return True

    # TODO: more functions for max/min/ave/all/etc...

    def commit(self):
        try:
            self.session.commit()
            return True
        except:
            self.session.rollback()
            return False

