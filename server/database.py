
# sqlalchemy parts we want to use
from sqlalchemy import (create_engine, Column, Integer, Float, Sequence, func, desc)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Temperature(Base):
    __tablename__ = 'temps'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)

    timestamp = Column(Integer, nullable=False)
    temperature = Column(Float, nullable=False)

    def __repr__(self):
        return "Temperature {}°C at {}".\
               format(self.temperature, self.timestamp)

    @staticmethod
    def convert(t, unit='C'):
        # Be happy to convert None Celsius to None in any other units
        # This avoids having to always validate t before calling convert()
        if t is None:
          return None
        if unit == 'K':
          result = t + 273.15
        elif unit == 'F':
          result = (t * 1.8) + 32
        elif unit == 'R':
          result = (t + 273.15) * 1.8
        else:
          result = t
        return round(result, 6)

    def get_data(self, unit='C'):
        return {
                'temperature': self.convert(self.temperature, unit),
                'timestamp': self.timestamp
                }

class db():

    # set of allowed/enabled units
    allowed_units = {'C', 'K', 'F', 'R'}

    def __init__(self, url):
        """ inits the database """
        self.engine = create_engine(url, echo=False)
        self.metadata = Base.metadata
        self.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()

    def create_all(self):
        """ create all the tables and such """
        self.metadata.create_all(self.engine)

    def delete_temperature_data(self):
        """ delete all the data in the db """
        self.session.query(Temperature).delete()
        return self.commit()

    def get_current_temperature(self, unit='C'):
        query = self.session.query(Temperature, func.max(Temperature.timestamp))
        t = query.one()

        data = t[0].get_data(unit)
        data['unit'] = unit
        return data

    def get_temperature_at(self, timestamp, unit='C'):
        query = self.session.query(Temperature)
        query = query.order_by(func.abs(Temperature.timestamp - timestamp))

        data = query.first().get_data(unit)
        data['unit'] = unit
        return data

    def get_temperature_list(self, lower, upper, limit, unit='C'):
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
            first_id = query.first().id
            if limit == 1:
              # They just want only 1 point, so choose a point near the middle
              middle_id = first_id + (n // 2)
              query = query.filter(Temperature.id == middle_id)
            else:
              # Choose up to (limit-1) rows from the first (n-1) rows
              # by selecting every jump_th row
              jump = ((n-1) // (limit-1)) + 1
              # Organise the mod (%) calculation to always select the first row
              # by calculating the offset of the id from the first_id
              # And always select the last row,
              # which could make at most((limit-1)+1)=limit rows in total
              last_id = first_id + n - 1
              query = query.filter(((Temperature.id - first_id) % jump == 0) | (Temperature.id == last_id))

        results = query.all()
        temps = list(map(lambda t: t.get_data(unit), results))

        return {'count': len(temps),
                'temperature_array': temps,
                'from': lower,
                'unit': unit,
                'to': upper,
                'lower': results[0].timestamp if len(results) > 0 else None,
                'upper': results[-1].timestamp if len(results) > 0 else None,
                'full_count': n
        }

    def save_temperature(self, temp, time):
        """ log the temperature in the database """

        t = Temperature()
        t.timestamp = time
        t.temperature = temp
        self.session.add(t)
        return self.commit()

    def get_temperature_avg(self, lower, upper, unit='C'):
        query = self.session.query(func.avg(Temperature.temperature), func.count(Temperature.id), func.min(Temperature.timestamp), func.max(Temperature.timestamp))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        data = {'ave': None,
                'count': 0,
                'lower': None,
                'upper': None,
                'from': lower,
                'to': upper,
                'unit': unit
               }
        t = filtered.first()
        # t is a 4-tuple: (average, number_of_points, smallest timestamp, largest timestamp)
        # only fill in values if we have at least a data point
        if t[1] > 0:
            data['ave'] = Temperature.convert(t[0], unit)
            data['count'] = t[1]
            data['lower'] = t[2]
            data['upper'] = t[3]
        return data

    def get_temperature_min(self, lower, upper, unit='C'):
        query = self.session.query(Temperature)
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper).order_by(Temperature.temperature)

        data  = {'min': None,
                 'count': 0,
                 'from': lower,
                 'to': upper,
                 'unit': unit,
                 'lower': None,
                 'upper': None
                }
        t = filtered.first()
        if t:
            # do another query to get the count and min and max timestamp
            # adding it to the first query confuses which actual Temperature record is returned
            tsrange_query = self.session.query(func.count(Temperature.id), func.min(Temperature.timestamp), func.max(Temperature.timestamp))
            filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                    Temperature.timestamp <= upper)
            tsrange = filtered_tsrange.first()

            data['min'] = t.get_data(unit)
            data['count'] = tsrange[0]
            data['lower'] = tsrange[1]
            data['upper'] = tsrange[2]

        return data


    def get_temperature_max(self, lower, upper, unit='C'):
        query = self.session.query(Temperature)
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper).order_by(desc(Temperature.temperature))

        data  = {'max': None,
                 'count': 0,
                 'from': lower,
                 'to': upper,
                 'unit': unit,
                 'lower': None,
                 'upper': None
                }
        t = filtered.first()
        if t:
            # do another query to get the count and min and max timestamp
            # adding it to the first query confuses which actual Temperature record is returned
            tsrange_query = self.session.query(func.count(Temperature.id), func.min(Temperature.timestamp), func.max(Temperature.timestamp))
            filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                    Temperature.timestamp <= upper)
            tsrange = filtered_tsrange.first()

            data['max'] = t.get_data(unit)
            data['count'] = tsrange[0]
            data['lower'] = tsrange[1]
            data['upper'] = tsrange[2]
        return data

    def get_temperature_stats(self, lower, upper, unit='C'):

        # get the actual range
        tsrange_query = self.session.query(func.count(Temperature.id),
                                           func.min(Temperature.timestamp),
                                           func.max(Temperature.timestamp))
        filtered_tsrange = tsrange_query.filter(Temperature.timestamp >= lower,
                                                Temperature.timestamp <= upper)
        count, real_lower, real_upper = filtered_tsrange.first()

        # max
        query = self.session.query(Temperature)
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper).order_by(desc(Temperature.temperature))
        the_max = filtered.first()

        # min
        query = self.session.query(Temperature)
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper).order_by(Temperature.temperature)
        the_min = filtered.first()

        # ave
        query = self.session.query(func.avg(Temperature.temperature))
        filtered = query.filter(Temperature.timestamp >= lower,
                                Temperature.timestamp <= upper)

        the_ave = filtered.first()[0]

        return {'max': the_max.get_data(unit) if the_max else None,
                'min': the_min.get_data(unit) if the_min else None,
                'ave': Temperature.convert(the_ave, unit) if the_ave is not None else None,
                'count': count,
                'from': lower,
                'unit': unit,
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

