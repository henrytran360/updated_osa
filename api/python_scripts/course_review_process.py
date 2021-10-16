import json

# Opening JSON file
f = open('Course_info3_short.json',)

# returns JSON object as
# a dictionary
data = json.load(f)

# Iterating through the json
# list

for key, val in data.items():
    filename = key + '.json'

    with open(filename, 'w') as out_json_file:
        # Save each obj to their respective filepath
        # with pretty formatting thanks to `indent=4`

        json.dump({key: val}, out_json_file, indent=4)

# Closing file
f.close()
