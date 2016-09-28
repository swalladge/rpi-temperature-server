
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

    def get_temperature_list(self, lower, upper, limit):
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
        if n > limit:
            # if so, skip every jump_th row
            jump = (n // limit) + 1
            query = query.filter(Temperature.id % jump == 0)

        # return:
        #   a list of dictionaries,
        #   number of rows selected in that range
        #   timestamp of the first record
        #   timestamp of the last record
        results = query.all()
        temps = list(map(lambda t: t.dict(), results))
        return (temps, n, results[0].timestamp, results[-1].timestamp)

    def save_temperature(self, temp, time):
        """ log the temperature in the database """

        t = Temperature()
        t.timestamp = time
        t.temperature = temp
        self.session.add(t)
        return self.commit()

    def get_temperature_avg(self, lower, upper):
        query = self.session.query(func.avg(Temperature.temperature), func.count(Temperature.id), func.min(Temperature.timestamp), func.max(Temperature.timestamp))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        # t is a 4-tuple: (average, number_of_points, smallest timestamp, largest timestamp)
        if t:
            return {'ave': t[0],
                    'count': t[1],
                    'from': lower,
                    'to': upper,
                    'lower': t[2],
                    'upper': t[3]
            }

    def get_temperature_min(self, lower, upper):
        query = self.session.query(Temperature, func.count(Temperature.id), func.min(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        if t:
            # do another query to get the min and max timestamp
            # adding it to the first query confuses which actual Temperature record is returned
            tsrange_query = self.session.query(func.min(Temperature.timestamp), func.max(Temperature.timestamp))
            filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                    Temperature.timestamp <= upper)
            tsrange = filtered_tsrange.first()

            return {'min': t[0].dict() if t[0] else None,
                    'count': t[1],
                    'from': lower,
                    'to': upper,
                    'lower': tsrange[0],
                    'upper': tsrange[1]
            }

    def get_temperature_max(self, lower, upper):
        query = self.session.query(Temperature, func.count(Temperature.id), func.max(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        if t:
            # do another query to get the min and max timestamp
            # adding it to the first query confuses which actual Temperature record is returned
            tsrange_query = self.session.query(func.min(Temperature.timestamp), func.max(Temperature.timestamp))
            filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                    Temperature.timestamp <= upper)
            tsrange = filtered_tsrange.first()

            return {'max': t[0].dict() if t[0] else None,
                    'count': t[1],
                    'from': lower,
                    'to': upper,
                    'lower': tsrange[0],
                    'upper': tsrange[1]
            }

    def commit(self):
        try:
            self.session.commit()
            return True
        except:
            self.session.rollback()
            return False

