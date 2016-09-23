
# sqlalchemy parts we want to use
from sqlalchemy import (create_engine, Column, Integer, Float, Sequence, func)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
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

    # static property for getting item closest to certain timestamp
    # terrible hack but works for now
    relative = 0

    @hybrid_property
    def distance(self):
        return abs(self.relative - self.timestamp)

    @distance.expression
    def distance(cls):
        return func.abs(cls.relative - cls.timestamp)

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

    def get_temperature_at(self, timestamp):
        # uses awful hack to order it correctly...
        Temperature.relative = timestamp
        query = self.session.query(Temperature)
        query = query.order_by(Temperature.distance)
        temp = query.first()
        return temp.dict()

    def get_temperature_list(self, lower, upper):
        """ returns a list of temperatures within (and including) the lower and
        upper timestamp bounds """

        # set up the actual query
        query = self.session.query(Temperature).filter(
                                    Temperature.timestamp >= lower,
                                    Temperature.timestamp <= upper)

        # get number of rows
        n = self.session.query(func.count(Temperature.id)).filter(
                                    Temperature.timestamp >= lower,
                                    Temperature.timestamp <= upper).first()[0]

        # check if the number of rows returned will be too long
        if n > config.temp_max_length:
            # if so, skip every jump_th row
            jump = (n // config.temp_max_length ) + 1
            query = query.filter(Temperature.id % jump == 0)

        # return a list of dictionaries, and number of total rows in that range
        temps = list(map(lambda t: t.dict(), query.all()))
        return (temps, n)

    def save_temperature(self, temp, time):
        """ log the temperature in the database """

        t = Temperature()
        t.timestamp = time
        t.temperature = temp
        self.session.add(t)
        return self.commit()

    def get_temperature_avg(self, lower, upper):
        query = self.session.query(func.avg(Temperature.temperature), func.count(Temperature.id))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        # t is a two-tuple: (average, number_of_points)
        if t:
            return {'ave': t[0],
                    'count': t[1],
                    'lower': lower,
                    'upper': upper
            }

    def get_temperature_min(self, lower, upper):
        query = self.session.query(Temperature, func.count(Temperature.id), func.min(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        if t:
            return {'min': t[0].dict() if t[0] else None,
                    'count': t[1],
                    'lower': lower,
                    'upper': upper
            }

    def get_temperature_max(self, lower, upper):
        query = self.session.query(Temperature, func.count(Temperature.id), func.max(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        if t:
            return {'max': t[0].dict() if t[0] else None,
                    'count': t[1],
                    'lower': lower,
                    'upper': upper
            }

    def commit(self):
        try:
            self.session.commit()
            return True
        except:
            self.session.rollback()
            return False

