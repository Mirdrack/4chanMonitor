# 4Chan Monitor

## Idea
A clone client of 4Chan website where the app display all categories and threads but you can makr threads in order to be monitored by the server side application to be downloading the images of marked threads.

## How to achieve this
Building a Node JS App using Express to serve the clone client of 4Chan. 
The app will be connected to a MongoDB whre we gonna store the threads info and the images names. 
The app will be pooling the selected threads, receiving the information comparing the request info with the stored data, downloading the new content and storing the information on the database, after this the app will emmit an event to be listened on the client side whre the information will be updated. 

## Steps
1. Analize 4chan
2. Serve a basic web client
3. Make a remote request with the web client to 4chan
4. Serve the board categories
5. Make a section to display all threads of one category
6. Make a section to display a thread (only images)
7. Develop a way to monitoring the marked threads to ask for the new data
8. Create a comparing method to check the stored date and the requested data
9. Develop a way to ask and storage the new data

## To do's
Update this Read me with the steps to scrap the site