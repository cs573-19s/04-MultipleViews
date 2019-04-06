Assignment 4 - Visualizations and Multiple Views
===
Topic: ShangHai MTR Visualization
===

Working Link
----
https://yutinghan.github.io/04-MultipleViews/

Overview
----
This project visualizes one day of ShangHai MTR Line 5. There are Four coordinated views as shown in Figure 1. 

- View-GeoMap shows 17 Metro lines on geomap and each circle denotes one metro running at this moment.
- View-Line5 is the enlarged view from View-GeoMap.
- View-Passenger-Load presents the passenger load on each metro at this moment. The X-axis denotes stations of Line 5 from the start to end and Y-axis denotes the passenger load, how many people on the metro.
- The left side on View-Time indicates time in 24-hours and the right side is a line chart. Here, X-axis denotes the time in minutes. For example, 300 means 5:00 am. And Y-axis denotes how many metros on Line 5 at this moment.

There are two modes, "animation play" and "animation pause". And the linked interactions are somewhat different in these two modes, which will be introduced later. 

<p align="center"><kbd><img src="img/overview1.png" height="100%" width="100%"></kbd> Figure 1</p>



Data
----
- stations_by_name
The geolocation of each stations are provided.

Four Views
----
- GeoMap
- Line 5
- Passenger Load
- Timeline

Demo
----

Technical Achievement Description
----

Design Achievement Description
----

Reference
----
Data: https://github.com/jeevanyue/metro
Slider: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518



