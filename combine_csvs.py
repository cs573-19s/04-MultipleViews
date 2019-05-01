import os
import csv

directory = os.fsencode("mass_shooting_data")
d = "mass_shooting_data"
month_dict = {"January": "01",
              "February": "02",
              "March": "03",
              "April": "04",
              "May": "05",
              "June": "06",
              "July": "07",
              "August": "08",
              "September": "09",
              "October": "10",
              "November": "11",
              "December": "12"
              }

master_csv_data = {"Incident Date": [],
                   "State": [],
                   "City or County": [],
                   "Address": [],
                   "# Killed": [],
                   "# Injured": [],
                   }
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    f = open(os.path.join(d, filename), 'r')
    for line in f:
        if "Incident Date" not in line:
            l = line.split(',')
            master_csv_data["Incident Date"].append(l[0] + l[1])
            master_csv_data["State"].append(l[2])
            master_csv_data["City or County"].append(l[3])
            master_csv_data["Address"].append(l[4])
            master_csv_data["# Killed"].append(l[5])
            master_csv_data["# Injured"].append(l[6])

print(master_csv_data["Incident Date"])

master_file = open('master_mass_shooting_data.csv', 'w')

master_file.write("IncidentDate,State,CityorCounty,Address,Killed,Injured\n")
for num in range(len(master_csv_data["Incident Date"])):
    row = []
    pieces = master_csv_data["Incident Date"][num][1:-1]
    pieces = pieces.split(" ")
    print(pieces)
    fixed_date = pieces[2] + '-' + month_dict[pieces[0]]

    row.append(fixed_date)
    row.append(master_csv_data["State"][num])
    row.append(master_csv_data["City or County"][num])
    row.append(master_csv_data["Address"][num])
    row.append(master_csv_data["# Killed"][num])
    row.append(master_csv_data["# Injured"][num])
    master_file.write(",".join(map(str, row)) + "\n")
    # master_file.write(master_csv_data["Incident Date"][num] + ',' + master_csv_data["State"][num] + ','
    #                   + master_csv_data["City or County"][num] + ',' + master_csv_data["Address"][num] + ','
    #                   + master_csv_data["# Killed"][num] + ',' + master_csv_data["# Injured"][num] + '\n')
master_file.close()
