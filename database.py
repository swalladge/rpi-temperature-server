
# sqlalchemy parts we want to use
from sqlalchemy import create_engine, Column, Integer, Float, Sequence
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
               format(self.t, self.timestamp)

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
        # TODO
        # dummy data now for testing
        t = Temperature()
        t.timestamp = utils.now(True)
        t.temperature = 18.5
        return t.dict()

    def get_temperature_list(self, lower, upper):
        """ returns a list of temperatures within (and including) the lower and
        upper timestamp bounds """
        # TODO
        # dummy data now for testing
        t = Temperature()
        t.timestamp = utils.now(True)
        t.temperature = 18.5
        t2 = Temperature()
        t2.timestamp = utils.now(True)
        t2.temperature = 18.5
        return [t.dict(), t2.dict()]

    def save_temperature(self, temp, time):
        """ log the temperature in the database """
        # TODO
        return True

    def get_temperature_max(self, lower, upper):
        """ returns the maximum temperature for range """
        # TODO
        return True

    def commit(self):
        try:
            self.session.commit()
            return True
        except:
            self.session.rollback()
            return False

