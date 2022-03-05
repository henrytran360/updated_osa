import requests;
from bs4 import BeautifulSoup;
import json

response = requests.get("https://courses.rice.edu/courses/!SWKSCAT.info?action=SUBJECTS&term=202220")
text = response.text
with open("depts.xml", "w") as f:
  f.write(text)
