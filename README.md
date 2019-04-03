Assignment 4 - Visualizations and Multiple Views  
===

- Jason Abel
- Github Repo: https://github.com/jabel3141/04-MultipleViews
- gh-pages site: https://jabel3141.github.io/04-MultipleViews/


## Data

The data I used for this project was obtained from http://jmcauley.ucsd.edu/data/amazon/ however the data was massively large with over 1.5 million reviews and so I could not upload the full file to gituhub. Instead I took the first 1000 data entries and used that for the project instead (test.json). 

# Description

This project is trying to analyze Amazon Electronics Reviews through ratings, summary words, and dates (shown in the first picture below). The timeline shows the dates, the ratings is shown in the bar chart and the summary words is shown through the word cloud. A user can interact with each visualization to filter values and update the visualizations (as shown in the second pic below). 

The general outline of interactions is as follows:
* Filtering the timeline (manipulating the brush) will only use reviews for the other 2 visualizations within the specified timeline. ie) if a october 2012 - october 2013 is selected, the words in the word cloud will only use the summary words from reviews in that time range and same with the ratings where the bar chart will only show ratings in that time range.
* Selecting words in the word cloud will also make the other 2 visualizations only use reviews with the selected words inside the summary. ie) if the word great is selected, the timeline will only show points where the summary of that review had the word great in it and the bar chart would only show the ratings of reviews with the word great in the summary. 
* Selecting a rating value in the bar chart will filter the reviews to only use the reviews with the specified ratings for the other 2 visualizations. ie) if you select the rating 3, the timeline will only show points where the review had a rating of 3 and the word cloud will only show words in the summary where the review rating was a 3.

You can use a combination of all 3 when filtering and it will perform all of them together. ie) if you select great in the word cloud and the 3 rating in the bar chart, the timeline will only show points where the rating was a 3 and the summary contained the word great. The other combinations will work in the same way where a visualization will only show values based on the other 2 visualization's filters.

![Overview Pic](/img/Overall.PNG)

![Overview Filtered Pic](/img/overallFiltered.PNG)


## Known Tiny Issues

When looking the timeline, if you only have one datapoint with one date, the timeline would normally break. To fix this, I made another data point with the same value so that the timeline would seem like a timeline but would just be a range of the one date (as shown in the picture below).

![Timeline One Point Pic](/img/timelineOnePoint.PNG)

I encountered one tiny bug with the code which is unknown why it is acting wierd. When using the brush in the timeline, if you selection only contains a few reviews and you end up selecting word in the word cloud that only has 1 review in it, the timeline and brush are fine, updating so that the timeline only contains that value. However, if you were to then unselect the single word, the brush filter disappears but is still filtering the correct area as it was before the selection in the word cloud. The pictures below tries to demonstrate this.

Before selecting word filter
![Bug 1 Pic](/img/bug3.PNG)

After selecting word filter
![Bug 2 Pic](/img/bug1.PNG)

After unselecing the word filter
![Bug 3 Pic](/img/bug2.PNG)


## Timeline

This timeline (shown in the first picture below) is showing when the amazon reviews were recorded. A dot on the line represents 1 review. A user can use the brush filter to select the time area they want to see for the other graphs as shown in the second picture. This will get all the reviews between the filtered times and update the other views respectively to represent this change. Additionally, a user can clear the filter which will reset the filter position to be the full length of the timeline.

![Timeline Pic](/img/timeline.PNG)

![Timeline Filtered Pic](/img/timelineFiltered.PNG)


## Word Cloud

The word cloud (as seen in the first picture below) is showing the words provided in the summary of the amazon reviews. The idea behind this is to see which words appear more frequently in the reviews to see if they correlate to a specific time or a specific rating. A user can select which word they want to take a closer look at by clicking on words individually like in the second picture below. This will filter the reviews for the other two visualizations to only reviews with those words and update the visualizationos accordingly. Addictionally, the user can clear the filter of selected words and all the words will be unhighlighted and reset. 

![Word Cloud Pic](/img/wordcloud.PNG)

![Word Cloud Filtered Pic](/img/wordcloudFiltered.PNG)


## Bar Chart

The bar chart (as seen in the first picture below) is showing the number of ratings of each rating (1-5). Each bar on the chart represents a rating value and the larger the bar, the more ratings there were with that rating value. A user can click on which rating they want to look at closer (as seen in the second pic below). Selecting a rating will filter the reviews for the other visualizations to only contain the ones with the selected ratings. Additionally, the user can clear the filtered ratings which will unhighlight the bars and reset the filter. 

![Bar Chart Pic](/img/barchart.PNG)

![Bar Chart Filtered Pic](/img/barchartFiltered.PNG)


## Sources

Used for the word cloud
* https://bl.ocks.org/jyucsiro/767539a876836e920e38bc80d2031ba7

Used for the timeline
* https://github.com/denisemauldin/d3-timeline

Used to help understand D3 dispatch
* https://bl.ocks.org/mbostock/5872848


## Technical Achievements
- Used D3.dispatch for coordinate updating the visualizations
- Used a brush to help filter the time data
- Used transitions to make the bar chart update nicely
- kept track of all the data and filtering manually instead of using an outside library
- Brush position will update based on the other selected values to fit the change in the timeline
- Allowed for clearing filters in each of the visualizations


## Design Achievements
- Used bootstrap to help format the webpage
- Used D3 color scheme to color the bar chart and the word cloud text
- Show the current filters applied to the visualizations
- Timeline and barchart dates and numbers update to distribute the area its using well
- Highlighted selected words and bars to make it easier to see which ones are selected in the filter