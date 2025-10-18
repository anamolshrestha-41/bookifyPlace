from datetime import datetime, timedelta
import time

userInput=input("Enter poll: ")

if userInput == "poll":
    poll = True
    start_time = datetime.now()
    end_time = start_time + timedelta(minutes=2)

    print("Poll started!")
    print("Start time:", start_time.strftime("%H:%M:%S"))
    print("End time:", end_time.strftime("%H:%M:%S"))

    # Optional: Keep checking until 2 minutes pass
    while datetime.now() < end_time:
        time_left = (end_time - datetime.now()).seconds
        print(f"Time left: {time_left} seconds", end="\r")
        time.sleep(1)

    print("\nPoll ended.")
else:
    poll = False
    print("Poll not started.")