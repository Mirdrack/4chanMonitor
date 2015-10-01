from bs4 import BeautifulSoup
import requests, shutil, string
import os, sys

def create_dirs(url):
	urlData = url.split('/');
	boardPath = './files/' + urlData[-4]
	threadPath = boardPath + '/' + urlData[-1];

	if not os.path.exists('./files'):
		os.makedirs('./files')
	if not os.path.exists(boardPath):
		os.makedirs(boardPath)
	if not os.path.exists(threadPath):
		os.makedirs(threadPath)
	return threadPath

def download_resource(url, dirname):
	filename = url.split('/')[-1]
	filePath = dirname + '/' + filename
	if not os.path.exists(filePath):
		response = requests.get(url, stream = True)
		with open(filePath, 'wb') as out_file:
		    shutil.copyfileobj(response.raw, out_file)
		del response
		#print('Downloading ' + url + '...')
		return 1
 	else: 
 		return 0


url = sys.argv[1] # We take the URL from the command line
r = requests.get(url)
data = r.text
soup = BeautifulSoup(data, 'html.parser')
dirname = create_dirs(url)
resources = 0

links = soup.find_all('a', class_='fileThumb')
print links.__len__(), ' Resources Going To Be Downloaded.'
for link in links:
	resources = resources + download_resource('http:' + link.get('href'), dirname)

print resources, ' Resources Downloaded.'