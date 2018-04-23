import json


with open('scatter.json', 'r') as content_file:
    content = content_file.read()

# print content
test = json.loads(content)
print len(test[0]['path'])