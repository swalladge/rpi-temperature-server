
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

    def __repr__(self):
        return "Temperature {}°C at {}".\
               format(self.temperature, self.timestamp)

    def dict(self):
        return {
                'temperature': self.temperature,
                'timestamp': self.timestamp
                }

class GeneralTemp(object):
    timestamp = 0
    temperature = 0

    def __init__(self, temperature, timestamp):
        self.temperature = temperature
        self.timestamp = timestamp

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

    def convert_temperature(self, value, unit):
        if unit == 'K':
          return value + 273.15
        elif unit == 'F':
          return (value * 1.8) + 32
        else:
          return value

    def get_current_temperature(self, unit):
        query = self.session.query(Temperature, func.max(Temperature.timestamp))
        t = query.one()
        curr_temp = GeneralTemp(t[0].temperature, t[0].timestamp)
        curr_temp.temperature = self.convert_temperature(curr_temp.temperature, unit)
        # note: it's a two tuple - (temperature_object, timestamp)
        return {'current': curr_temp.dict(),
                'unit': unit,
        }

    def get_temperature_at(self, timestamp, unit):
        query = self.session.query(Temperature)
        query = query.order_by(func.abs(Temperature.timestamp - timestamp))
        temp = query.first()
        spot_temp = GeneralTemp(temp.temperature, temp.timestamp)
        spot_temp.temperature = self.convert_temperature(spot_temp.temperature, unit)
        return {'spot': spot_temp.dict(),
                'unit': unit,
        }

    def get_temperature_list(self, lower, upper, unit, limit):
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
            first_id = query.first().id
            last_id = first_id + n - 1
            query = query.filter(((Temperature.id - first_id) % jump == 0) | (Temperature.id == last_id))

        # return:
        #   a list of dictionaries,
        #   number of rows selected in that range
        #   timestamp of the first record
        #   timestamp of the last record
        results = query.all()
        temperature_data = []
        for result in results:
          temperature_data.append(GeneralTemp(self.convert_temperature(result.temperature, unit), result.timestamp))
        temps = list(map(lambda t: t.dict(), temperature_data))
        return (temps,
                n,
                results[0].timestamp if 0 < len(results) else None,
                results[-1].timestamp if 0 < len(results) else None)

    def save_temperature(self, temp, time):
        """ log the temperature in the database """

        t = Temperature()
        t.timestamp = time
        t.temperature = temp
        self.session.add(t)
        return self.commit()

    def get_temperature_avg(self, lower, upper, unit):
        query = self.session.query(func.avg(Temperature.temperature), func.count(Temperature.id), func.min(Temperature.timestamp), func.max(Temperature.timestamp))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        # t is a 4-tuple: (average, number_of_points, smallest timestamp, largest timestamp)
        if t:
            return {'ave': self.convert_temperature(t[0], unit) if t[0] else None,
                    'count': t[1],
                    'unit': unit,
                    'from': lower,
                    'to': upper,
                    'lower': t[2],
                    'upper': t[3]
            }

    def get_temperature_min(self, lower, upper, unit):
        query = self.session.query(Temperature, func.count(Temperature.id), func.min(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        if t:
            if t[0]:
                the_min = GeneralTemp(t[0].temperature, t[0].timestamp)
                the_min.temperature = self.convert_temperature(the_min.temperature, unit)

            # do another query to get the min and max timestamp
            # adding it to the first query confuses which actual Temperature record is returned
            tsrange_query = self.session.query(func.min(Temperature.timestamp), func.max(Temperature.timestamp))
            filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                    Temperature.timestamp <= upper)
            tsrange = filtered_tsrange.first()

            return {'min': the_min.dict() if t[0] else None,
                    'count': t[1],
                    'unit': unit,
                    'from': lower,
                    'to': upper,
                    'lower': tsrange[0],
                    'upper': tsrange[1]
            }

    def get_temperature_max(self, lower, upper, unit):
        query = self.session.query(Temperature, func.count(Temperature.id), func.max(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        t = filtered.first()
        if t:
            if t[0]:
                the_max = GeneralTemp(t[0].temperature, t[0].timestamp)
                the_max.temperature = self.convert_temperature(the_max.temperature, unit)

            # do another query to get the min and max timestamp
            # adding it to the first query confuses which actual Temperature record is returned
            tsrange_query = self.session.query(func.min(Temperature.timestamp), func.max(Temperature.timestamp))
            filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                    Temperature.timestamp <= upper)
            tsrange = filtered_tsrange.first()

            return {'max': the_max.dict() if t[0] else None,
                    'count': t[1],
                    'unit': unit,
                    'from': lower,
                    'to': upper,
                    'lower': tsrange[0],
                    'upper': tsrange[1]
            }

    def get_temperature_stats(self, lower, upper, unit):

        # get the actual range
        tsrange_query = self.session.query(func.count(Temperature.id),
                                           func.min(Temperature.timestamp),
                                           func.max(Temperature.timestamp))
        filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                Temperature.timestamp <= upper)
        count, real_lower, real_upper = filtered_tsrange.first()

        # max
        query = self.session.query(Temperature, func.max(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)
        db_max = filtered.first()[0]
        if db_max:
            the_max = GeneralTemp(db_max.temperature, db_max.timestamp)
            the_max.temperature = self.convert_temperature(the_max.temperature, unit)

        # min
        query = self.session.query(Temperature, func.min(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)
        db_min = filtered.first()[0]
        if db_min:
            the_min = GeneralTemp(db_min.temperature, db_min.timestamp)
            the_min.temperature = self.convert_temperature(the_min.temperature, unit)

        # ave
        query = self.session.query(func.avg(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        the_ave = filtered.first()[0]

        return {'max': the_max.dict() if db_max else None,
                'min': the_min.dict() if db_min else None,
                'ave': self.convert_temperature(the_ave, unit) if the_ave else None,
                'count': count,
                'unit': unit,
                'from': lower,
                'to': upper,
                'lower': real_lower,
                'upper': real_upper
        }

    def commit(self):
        try:
            self.session.commit()
            return True
        except:
            self.session.rollback()
            return False

