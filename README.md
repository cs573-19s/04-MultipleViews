Assignment 4 - Visualizations and Multiple Views  
===

[gh-pages index file](https://jpetittowpi.github.io/04-MultipleViews/), which isn't particularly useful as the interactive app is hosted by shinyapps.io: [Omic Explorer](https://jtourtellottewpi.shinyapps.io/omic_explorer/)


This vis sequencing-based DamID and siRNA classification (discrete values) with quantitative (continuous) RNAseq data from experiments that examined the relationship between active chromatin and association with the nuclearpore complex (NPC) focused on Nups 93 and 153.

![Initial app view, before interaction](/img/shiny_init.png "Initial App view of Density and Box Plots in the top row and Mosaic plot and table in the second row")

The density plot examines the distribution of RNA-seq expression measured in fpkm transformed by log10 and scaled. Brushing on this graph looks at the distribution calculated using only results within the brush area. Genes with at least one recorded fpkm value for a given experimental condition are used to update the other graphs.
![Brushing Interaction](/img/shiny_brushing.png)

The box plot looks at the distribution of gene lengths for each chromosome with respect to the currently selected gene set. By clicking on one of the chromosome box plots, one can elimate or add the genes on that chromosome to the selected gene set, which updates the other graphs.
![Box Plot Clicking Interaction](/img/shiny_clicking.png)

The mosaic plot looks at the classification of the genes in the selected gene set based on how it the gene reacted to siRNA treatment or chromatin association via DamID with respect to Nups 93 and 153. Clicking on the plot sets the gene set to one combination of siRNA and DamID association.
![Mosaic Clicking Interaction](/img/shiny_clicking_assay.png)

Achievements
===
The technical achievements I attempted with this visualization were to learn how to use shiny to visualize genomic data in unique ways. I have been particularly interested in looking at distributions of change in different sequencing data (RNA-seq, Hi-C over multiple time points, and so on), and the interactions in this vis open the door for a new way to look at these data types. After showing my PI this visualization in its earliest forms, he thinks it can be developed into a useful tool for looking for gene targets for imaging experiments.

The design achievements I accomplished included learning to work within the UI grid system that underlies shiny apps as well as seeking color palattes that are color-blind friendly.
