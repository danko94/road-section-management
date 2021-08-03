import time, random, requests
import helper
from datetime import datetime


CTYPE = 0
SSEC = 1
ESEC = 2
STIME = 3
CAR_ON_ROAD = 4
NUM_OF_SECTS = 5
CAR_LEFT_ROAD = 6
REL_SEC = 7

ENT_ROAD = 0
ENT_SEC = 1
EXIT_SEC = 2
EXIT_ROAD = 3

cars = ['Truck', 'Truck', 'Truck', 'Private', 'Private', 'Private', 'Private', 'Private', 'Van', 'Van']
events = ['enter_road', 'enter_section', 'exit_section', 'exit_road']
special_day = 0
weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']



MAX_TIME = 60
TIME_IN_SECTION = 6
MAX_CARS = 100


cars_on_road = {}

#curr_day = weekday[random.randint(0,6)]

def simulate(curr_day):
    special_day = 0
    if curr_day=='saturday':
        special_day = 1
    else:
        sd = random.randint(0,99)
        if sd < 7:
            special_day = 1

    now = datetime.now()       

    # H:M:S
    dt_string = now.strftime("%H:%M:%S")

    # print(f'today is {curr_day}, special day: {special_day}')

    for i in range(MAX_CARS):

        cType = cars[random.randint(0,9)]
        start_sec, end_sec = helper.get_sections(cType,dt_string,special_day)
        start_time = random.randint(0, MAX_TIME-1)
        num_of_sects =  end_sec-start_sec
        car_on_road = False
        car_left_road = False
        curr_rel_section = 1
        cars_on_road[i] = [cType, start_sec, end_sec, start_time, car_on_road, num_of_sects, car_left_road, curr_rel_section]


    base_time = int(time.time())
    curr_time = int(time.time())





    url = 'http://localhost:3003'


    while curr_time <= base_time + MAX_TIME + 30:
        for car_id in cars_on_road:
            car_details = cars_on_road[car_id]
            curr_time = int(time.time())
            time_passed = curr_time-base_time
            if car_details[CAR_LEFT_ROAD]:
                continue
            if not car_details[CAR_ON_ROAD] and time_passed >= car_details[STIME]: # enter road event
                car_details[CAR_ON_ROAD] = True
                print(car_details[CTYPE], 'ID:', car_id , 'entered road on section', car_details[SSEC])
                json = {'id': str(base_time)+str(car_id), 'time': int(time.time()), 'weekday': curr_day, 
                            'special': special_day, 'cType': car_details[CTYPE], 'event':events[ENT_ROAD], 
                            'section':car_details[SSEC]}
                try:
                    res = requests.post(url, json=json)
                except Exception:
                    print('error occured')
            if car_details[CAR_ON_ROAD]:
                num_of_sects = car_details[NUM_OF_SECTS]
                if time_passed >= car_details[STIME] + num_of_sects * TIME_IN_SECTION: # exit road event
                    # datetime object containing current date and time
                    now = datetime.now()       

                    # H:M:S
                    dt_string = now.strftime("%H:%M:%S")
                    # print(dt_string)

                    print(car_details[CTYPE], 'ID:', car_id , 'exited road on section', car_details[ESEC], 'after', num_of_sects*TIME_IN_SECTION, 'seconds and', num_of_sects, 'sections')
                    json = {'id': str(base_time)+str(car_id), 'time': int(time.time()), 'weekday': curr_day, 'special': special_day ,
                                'cType': car_details[CTYPE], 'event':events[EXIT_ROAD], 'section':car_details[ESEC]}
                    json2 = {'id': car_id,'date_time': dt_string,'time': int(time.time()), 'weekday': curr_day, 'special': special_day
                                    ,'cType': car_details[CTYPE], 'start_section': car_details[SSEC],  'end_section':car_details[ESEC]}
                    try:
                        res = requests.post(url, json=json)
                        res2 = requests.post(url, json=json2)
                    except Exception:
                        print('error occured')
                    car_details[CAR_LEFT_ROAD] = True
                curr_rel_section = car_details[REL_SEC]
                if num_of_sects > curr_rel_section:
                    if time_passed >= car_details[STIME] + curr_rel_section * TIME_IN_SECTION: # exit/enter section event
                        print(car_details[CTYPE], 'ID:', car_id , 'exited', car_details[SSEC]+curr_rel_section-1, 'and entered', car_details[SSEC]+curr_rel_section)
                        car_details[REL_SEC]+=1
                        json = {'id': str(base_time)+str(car_id), 'time': int(time.time()), 'weekday': curr_day, 'special': special_day, 
                                'cType': car_details[CTYPE], 'event':events[EXIT_SEC], 
                                'section':car_details[SSEC]+curr_rel_section-1} # exit section
                        try:
                            res = requests.post(url, json=json)
                        except Exception:
                            print('error occured')
                        json = {'id': str(base_time)+str(car_id), 'time': int(time.time()), 'weekday': curr_day, 
                                    'special': special_day, 'cType': car_details[CTYPE], 
                                    'event':events[ENT_SEC], 'section':car_details[SSEC]+curr_rel_section} # enter section
                        try:
                            res = requests.post(url, json=json)
                        except Exception:
                            print('error occured')


    print('simulation finished')

    for key in cars_on_road:
        print(key, cars_on_road[key])

    
# for day in weekday:
#     simulate(day)
simulate('monday')