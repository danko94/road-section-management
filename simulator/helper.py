import random

# get starting end ending section of car given car type
def get_sections(cType, dt_string, special_day):
    hour = int(dt_string[:2])
    if(special_day == 0 and hour<22 and hour >5 ):
        if cType == 'Truck':
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 5:
                start_sec = 1
                if num2 < 10:
                    end_sec = 6
                else:
                    end_sec = 5
            elif num < 7:
                start_sec = 2
                if num2 < 2:
                    end_sec = 3
                else:
                    end_sec = 4
            elif num < 9:
                start_sec = 3
                if num2 < 10:
                    end_sec = 6
                else:
                    end_sec = 5
            elif num < 10:
                start_sec = 4
                if num2< 10:
                    end_sec = 6
                else:
                    end_sec = 5
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
        elif cType == 'Private':
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 5:
                start_sec = 2
                if num2 < 10:
                    end_sec = 4
                else:
                    end_sec = 3
            elif num < 7:
                start_sec = 3
                if num2 <= 9:
                    end_sec = 4
                else:
                    end_sec = 5           
            elif num < 9:
                start_sec = 4
                if num2 <= 7:
                    end_sec = 5
                else:
                    end_sec = 6            
            elif num < 10:
                start_sec = 1
                end_sec = random.randint(2,6)
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
        else:
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 2:
                start_sec = 1
                if num2 < 10:
                    end_sec = 2
                else:
                    end_sec = 3
            elif num < 6:
                start_sec = 2
                if num2 < 10:
                    end_sec = 3
                else:
                    end_sec = 4
            elif num < 10:
                start_sec = 3
                if num2 < 10:
                    end_sec = 4
                else:
                    end_sec = 5
            elif num < 11:
                start_sec = 4
                if num2 < 10:
                    end_sec = 5
                else:
                    end_sec = 6
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
    elif(special_day == 0 and (hour>22 or hour <5)):
        if cType == 'Truck':
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 5:
                start_sec = 1
                if num2 < 10:
                    end_sec = 3
                else:
                    end_sec = 2
            elif num < 7:
                start_sec = 2
                if num2 < 10:
                    end_sec = 4
                else:
                    end_sec = 3
            elif num < 9:
                start_sec = 3
                if num2 < 9:
                    end_sec = 5
                else:
                    end_sec = 4
            elif num < 10:
                start_sec = 4
                if num2< 8:
                    end_sec = 6
                else:
                    end_sec = 5
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
        elif cType == 'Private':
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 5:
                start_sec = 2
                if num2 < 2:
                    end_sec = 3
                else:
                    end_sec = 4
            elif num < 7:
                start_sec = 3
                if num2 <= 10:
                    end_sec = 4
                else:
                    end_sec = 5           
            elif num < 9:
                start_sec = 4
                if num2 <= 10:
                    end_sec = 5
                else:
                    end_sec = 6            
            elif num < 10:
                start_sec = 1
                end_sec = 2
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
        else:
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 2:
                start_sec = 1
                if num2 < 10:
                    end_sec = 3
                else:
                    end_sec = 4
            elif num < 6:
                start_sec = 2
                if num2 < 10:
                    end_sec = 5
                else:
                    end_sec = 6
            elif num < 10:
                start_sec = 3
                if num2 < 10:
                    end_sec = 6
                else:
                    end_sec = 5
            elif num < 11:
                start_sec = 4
                if num2 < 10:
                    end_sec = 5
                else:
                    end_sec = 6
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
    elif(special_day == 1):
        if cType == 'Truck':
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 5:
                start_sec = 1
                if num2 < 10:
                    end_sec = 2
                else:
                    end_sec = 3
            elif num < 7:
                start_sec = 2
                if num2 < 10:
                    end_sec = 3
                else:
                    end_sec = 4
            elif num < 9:
                start_sec = 3
                if num2 < 9:
                    end_sec = 4
                else:
                    end_sec = 5
            elif num < 10:
                start_sec = 4
                if num2< 8:
                    end_sec = 5
                else:
                    end_sec = 6
            else:
                start_sec = 5
                end_sec = 6
            return start_sec, end_sec
           
        elif cType == 'Private':
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 5:
                start_sec = 2
                if num2 < 10:
                    end_sec = 5
                else:
                    end_sec = 6
            elif num < 7:
                start_sec = 3
                if num2 <= 10:
                    end_sec = 6
                else:
                    end_sec = 5           
            elif num < 9:
                start_sec = 4
                if num2 <= 10:
                    end_sec = 6
                else:
                    end_sec = 5            
            elif num < 10:
                start_sec = 5
                end_sec = 6
            else:
                start_sec = 1
                end_sec = 4
            return start_sec, end_sec
        else:
            num = random.randint(0,10)
            num2 = random.randint(0,10)
            start_sec = 0
            end_sec = 0
            if num < 2:
                start_sec = 1
                if num2 < 9:
                    end_sec = 5
                else:
                    end_sec = 6
            elif num < 6:
                start_sec = 2
                if num2 < 9:
                    end_sec = 5
                else:
                    end_sec = 6
            elif num < 10:
                start_sec = 3
                if num2 < 9:
                    end_sec = 5
                else:
                    end_sec = 6
            elif num < 11:
                start_sec = 4
                if num2 < 7:
                    end_sec = 5
                else:
                    end_sec = 6
            else:
                start_sec = 5
                end_sec = 6
    return start_sec, end_sec
       