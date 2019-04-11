Assignment 4 - Visualizations and Multiple Views  
===
Demo Link: https://yuncm98.github.io/04-MultipleViews/

Introduction
==
This multi-chart visualization includes three basic chart which are map, pie chart and bar chart. Basically, these coordinate views display
different facets of the same data. This assignment is inspired by a tutorial project named `Dispatching Events`, instead of using a drop menu 
to pick up the state, I append a US national map aside using `us.json` file. The pie chart and bar chart will update along with
movement of the mouse over the map synchronously. The pie chart displays a rough distribution of the population of the chosen state, and also presents the total number of the population.
In addition, the bar chart presents more detail in terms of quantity, which gives a direct image to its viewers.

<img src='https://ws1.sinaimg.cn/large/006tNc79ly1g1yjpjwmr8j30ni0fkabk.jpg' width=500>

<img src='https://ws1.sinaimg.cn/large/006tNc79ly1g1y4nyaodbj30ka0as758.jpg' width=500>

<img src='https://ws2.sinaimg.cn/large/006tNc79ly1g1y4o0rvguj30lu0dkgmb.jpg' width=500>


Design Achievements
==
- Implementing three coordinate views which share same data
- Appending a legend aside the pie chart 
- Formatting all of the style of the displayed numeric information
- Implementing a dynamic y Axis of which labels will update according to the given state data

Technical Achievements
==
- Using D3.js `Dispatch` to coordinate views 
- Applying `TopoJson` to parse the map data and then drawing the national map 
- Adding an interpolate while updating the pie chart to make it more smooth
- Embedding a simple snippet code of `CSS` for programming practice

Resources
==
[Dispatching Events](https://bl.ocks.org/mbostock/5872848)