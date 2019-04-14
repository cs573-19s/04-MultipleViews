Assignment 4 - Visualizations and Multiple Views  
===

The following is an example of coordinated multiple views. I decided to have an interacted world map, where different visualization types are interactive and linked together, to display different information about each country in the world.

Link to GitHub Pages
---
https://asolergayoso.github.io/04-MultipleViews


Visualization Details
--

For this project, I decided to utilize three different visualization techniques that display information about a particular country. In particular, the data being displayed is birthrate calculated in number of births divided by 1000 population, evolution of Gross Domestic Product from 1960 to 2017, and finally the geographical location of every country through a map. Unfortunately, I was unable to find all the necessary data on a single dataset, so I had to pull information from different datasets and form my own. The following datasets make up the overall data visualized in this project. 
- *facebook.csv* contains the birthdate information for each country (obtained from https://perso.telecom-paristech.fr/eagan/class/igr204/datasets)
- *gdp.csv* contains the gdp growth for every country since 1960 (obtained from https://data.worldbank.org/indicator/ny.gdp.mktp.cd)
- *map.csv* contains all the additional data for the map to work (obtained from https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json)

To represent the birthrate I decided to use a barchart, where each country is placed on the x-axis and the birthrate value on the y-axis. As seen in the image below, the number countries surpasses the length of the x-axis, for that reason the dragging function was added in order to scroll left and righgt in the x-axis to see all the countries. When the user hovers over a specific bar, the birthrate value is pappears on the top of the bar. 

![Watch Video](https://github.com/asolergayoso/04-MultipleViews/blob/master/img/barchart.gif)

For the gdp growth from 1960 to 2017 information I decided to use multiple line chart, as it makes it easier to visualize information over time. Each line is color coded as ordinal data with the d3 color scheme function. When the user hovers over a particular line, it will automatically change the opacity of such line in contrast to the rest, to make it easier to differentiate. Additionally the name of the country that line represent will apear on the top of the screen.

![Watch Video](https://github.com/asolergayoso/04-MultipleViews/blob/master/img/linechart.gif)

Finally, I used a world map to display geographical information. When the user hovers over a country on the map, a label with the name of the country will apear. Moreover, there is an additional zoom function thatzooms into the specific country the user has clicked on. 

![Watch Video](https://github.com/asolergayoso/04-MultipleViews/blob/master/img/map.gif)


Coordinated Multiple Views
--
The different visualizations are interconnected by intereaction, meaning that user interaction in any of the them will cause the other two to change, hence making it easier for the user to view different statistics about a country with one single click. For intance, clicking on a specific country on the map will make the multi line chart to highlight the speific line of that country, and similarly with the barchart. The process is the same for the barchart and the line chart, since clicking a specific line or chart, will cause the map to zoom into the corresponding country. See below:

![Watch Video](https://github.com/asolergayoso/04-MultipleViews/blob/master/img/interactive_map.gif)


Technical Achievements
---







