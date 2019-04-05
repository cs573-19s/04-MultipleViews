Assignment 4 - Visualizations and Multiple Views  
===
#### Sam Longenbach
##### Visualization: https://longenbach.github.io/04-MultipleViews/indexv2.html
##### Code: https://github.com/longenbach/04-MultipleViews/blob/master/indexv2.html

## Overview:
![Visual](img/full.png)

Above is a screenshot of the mutiple views visulzation I created. Divvy is a bike sharing platform in Chicago started in 2013. Users can check out a bike form one station and return it to another station for a small fee. I wanted to create a basic visulation to show the number of trips taken from different subsets of stations over time. All Divvy's trip and station data is public and avaible on their [website](https://www.divvybikes.com/system-data). For this visulzation I focused on 2013 stations and trips since working with all of the trip data would be quite large ~2.5gb.  

![Map](img/geo_raw2.png)
![Map_Raw](img/map.png)

From [OpenStreetMap](https://www.openstreetmap.org/#map=11/41.8370/-87.6742) using the [Overpass API](https://overpass-turbo.eu/) I was able to extract the GeoJSON file containing all bike paths in Chicago. The image above on the right is the selection of the various Chicago bike paths after running the following query below. 

```Java 
[out:json];
(
  // get cycle route relatoins
  relation[route=bicycle]({{bbox}});
  // get cycleways
  way[highway=cycleway]({{bbox}});
  way[highway=path][bicycle=designated]({{bbox}});
);

out body;
>;
out skel qt;
```
Once finished you can download the output as a GeoJSON file. Using 



## Introduction:

One of the most powerful techniques for mitigating the shortcomings of a given visualization is to link it with other views.
Linking a map to a bar or scatterplot, for instance, may allow you to overcome the shortcomings of a map.
In general, linking visualizations allows you to explore different parts of the data between views, and mitigates the shortcomings of a given view by pairing it with other views.
This technique, called coordinated multiple views, is the focus of this assignment.

Your task is to choose an interesting dataset and visualize it in *at least three* **linked** views, where interactions in any given view updates the other two.
Each view should use a different visualization type, and interaction in one of the views should impact what's shown in the other views.

You should choose data and visualizations that are sufficiently complex and interesting to ensure a user can discover interesting patterns and trends on their own.

For this assignment you should write everything from scratch.
You may *reference and adapt* code from books or the web, and if you do please provide a References section with links at the end of your Readme.

Resources
---

Data is Plural has a list of interesting datasets, many of which require processing.

These three examples are intended to show you what multiple views visualizations might look like. 
I wouldn't recommend using them as a your starting point, but you may find some inspiration:

1. This [scatterplot matrix](http://bl.ocks.org/mbostock/4063663) has code that explains brushing and linking. But remember you'll be doing this with different types of views.

2. The example visualization for [Crossfilter](http://square.github.io/crossfilter/) uses coordinated multiple views. The interaction and brushing technique is well-executed.

3. The [dispatching events](https://github.com/d3/d3-dispatch) page is a good example of using events, rather than explicit functions, for controlling behavior. Views can listen for events in other views and respond accordingly.

This GIF from a similar course shows how views can work together:

![cmv gif](https://raw.githubusercontent.com/dataviscourse/2015-dataviscourse-homework/master/hw3/preview.gif)

*If you aren't familiar with event-based programming you should experiment with d3.dispatch and other approaches to coordinating views well before the deadline (it's tricky.)*

Don't forget to run a local webserver when you're coding and debugging.

Requirements
---

0. Your code should be forked from the GitHub repo and linked using GitHub pages.
1. Your project should load a dataset you found on the web. Put this file in your repo.
2. Your project should use d3 to build a visualization of the dataset. 
3. Your writeup (readme.md in the repo) should contain the following:

- Working link to the visualization hosted on gh-pages.
- Concise description and screenshot of your visualization.
- Description of the technical achievements you attempted with this visualization.
- Description of the design achievements you attempted with this visualization.

GitHub Details
---

- Fork the GitHub Repository. You now have a copy associated with your username.
- Make changes to index.html to fulfill the project requirements. 
- Make sure your "master" branch matches your "gh-pages" branch. See the GitHub Guides referenced above if you need help.
- Edit the README.md with a link to your gh-pages site, for example http://YourUsernameGoesHere.github.io/04-MapsAndViews/index.html
- To submit, make a [Pull Request](https://help.github.com/articles/using-pull-requests/) on the original repository.
