Assignment 4 - Visualizations and Multiple Views  
===

Link to GitHub Pages
---
https://asolergayoso.github.io/04-MultipleViews

The following is an example of coordinated multiple views. I decided to have an interacted world map, where different visualization types are interactive and linked together, to display different information about each country in the world.

Visualization Details
--

For this project, I decided to utilize three different visualization techniques that display information about a particular country. In particular, the data being displayed is birthrate calculated in number of births divided by 1000 population, evolution of Gross Domestic Product from 1960 to 2017, and finally the geographical location of every country through a map. Unfortunately, I was unable to find all the necessary data onm the same dataset, so I had to pull information from different datasets and form my own. 

To represent the birthrate I decided to use a barchart, where each country is placed on the x-axis and the birthrate value on the y-axis. As seen in the image below, the number countries surpasses the length of the x-axis, for that reason the dragging function was added in order to scroll left and righgt in the x-axis to see all the countries. When the user hovers over a specific bar, the birthrate value is pappears on the top of the bar. 

For the gdp growth from 1960 to 2017 information I decided to use multiple line chart, as it makes it easier to visualize information over time. Each line is color coded as ordinal data with the d3 color scheme function. When the user hovers over a particular line, it will automatically change the opacity of such line in contrast to the rest, to make it easier to differentiate. Additionally the name of the country that line represent will apear on the top of the screen.

Finally, I used a world map to display geographical information. When the user hovers over a country on the map, a label with the name of the country will apear. 



Coordinated Multiple Views
--







