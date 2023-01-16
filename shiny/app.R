# Full App

library(shiny)
library(reactlog)

library(readr)
library(tidyverse)

library(ggmosaic)
library(DT)


reactlog_enable()


###
# PLOT CONSTANTS
###

DENSITY_Y_MAX <- 1

BOX_PLOT_COLOR <- c("TRUE"="#67a9cf",
                    "FALSE"="#ef8a62")
BOX_PLOT_LABELS <- c("TRUE"="Selected",
                     "FALSE"="Not Selected")

DENSITY_PLOT_COLOR <- c("siCtrl_avg"= "#7b3294",
                        "siNup93_avg"= "#c2a5cf",
                        "siNup153_avg"= "#008837")

DENSITY_PLOT_LABELS <- c("siCtrl_avg"= "Control",
                       "siNup93_avg"= "Nup93",
                       "siNup153_avg"="Nup153"
                       )
DENSITY_PLOT_LEGEND <- "Average fpkm\nafter indicated\nsiRNA treatment"

MOSAIC_PLOT_FILL <- c("0"= "#7b3294",
                     "1"= "#c2a5cf",
                     "2"="#a6dba0",
                     "3"= "#008837")

MOSAIC_PLOT_LABELS <- c("0"= "Neither Nup",
                        "1"= "Nup93",
                        "2"="Nup153",
                        "3"= "Both Nups") 

###
# Data Import and Processing (includes calculated "constants")
###

all_gene_data_df <- read_csv("data/nup_si_damid_gene_df.csv") %>%
    mutate(length = end - start) %>%
    select(Refseq, length, chr, siRNA_Class, DamID_Class) %>%
    mutate(across(chr:DamID_Class, as.factor)) %>%
    mutate(gene_sel_bool=replicate(length(Refseq), TRUE)) %>%
    mutate(chr_sel_bool=replicate(length(Refseq), TRUE))
ALL_GENES_COUNT <- nrow(all_gene_data_df)

# Creation of this df depends on all_gene_data_df
GSE87831_fpkm_full_df <- filter(read_csv("data/GSE87831_fpkm_longer.csv")) %>%
    filter(fpkm != 0) %>%
    mutate(log10_fpkm = log10(fpkm)) %>%
    select(Refseq, Copies, run, fpkm, log10_fpkm) %>%
    filter(Refseq %in% all_gene_data_df$Refseq)
x_data_log10_min <- min(filter(GSE87831_fpkm_full_df)$log10_fpkm)
x_data_log10_max <- max(filter(GSE87831_fpkm_full_df)$log10_fpkm)


all_gene_data_df <- left_join(all_gene_data_df, pivot_wider(GSE87831_fpkm_full_df,
                                                            names_from = run,
                                                            names_glue = "{run}_{.value}",
                                                            values_from = c(log10_fpkm)) %>%
                                  select(Refseq, contains("log10_fpkm")),
                      by="Refseq"
                      )



base_density_plt <- ggplot(data = GSE87831_fpkm_full_df) +
    geom_density(aes(color = run, x = log10_fpkm), linewidth = 1.25) + # need to scale to make density of subset selected fall on the same scale
    coord_cartesian(xlim = c(x_data_log10_min, x_data_log10_max), ylim=c(0, DENSITY_Y_MAX)) +
#    theme(legend.position="none") +
    scale_color_manual(name=DENSITY_PLOT_LEGEND, values = DENSITY_PLOT_COLOR) +
    labs(title="RNA-Seq Expression Density (log10 Scaled)")




# Define UI

ui <- fluidPage( # Layout Guide: https://shiny.rstudio.com/articles/layout-guide.html
    # Row 1
    fluidRow(
        column(6, # "RNA-Seq Expression Density (Scaled)",
               plotOutput("rna_expr_density_ptop", brush = brushOpts("rna_expr_brush", direction = "x"))
        ),
        column(6, # "Distribution of Gene Length by Chromosome",
            plotOutput("gene_length_box_ptop", click = clickOpts("chr_length_click", clip = TRUE))
            # Question: would there be a benefit to doing chromosome versus brushing by length?
            # Question: how would setting up both work?
        )
    ),
    # Row 2
    fluidRow(
        column(4, # "Genes Classified by DamID and siRNA Assays",
               plotOutput("gene_assay_mosaic_ptop", click = clickOpts("gene_assay_click", clip = TRUE))
        ),
        column(8, # "Selected Genes",
               # want table of selected genes here
               DT::dataTableOutput("gene_table")
        )
    )
)


# Establish Server Logic
server <- function(input, output) {

    all_genes_data <- reactiveVal(all_gene_data_df)
    
    
    gene_assay_plt <- reactiveVal()

    
    fpkm_sel_rxtv <- reactive({
        if(is.null(input$rna_expr_brush)) return()
        filter(GSE87831_fpkm_full_df, 
                      Refseq %in% filter(all_genes_data(),
                                         gene_sel_bool==TRUE & chr_sel_bool==TRUE)$Refseq)
    })
    
    ###################   
    # Event Listeners #
    ###################
    
    observeEvent(input$gene_assay_click, {
        # NOTE: could make this interaction more complex... maybe by allowing user to select which axis they want to subset on
        #       MAYBE do this for next version AFTER IT GETS TURNED IN
        ## NOTE: want to write medium post about this?! accessing ggplot object and re: mosaic plot
        ##          include how round(), as mentioned in boxplot examples, does not work here
        
        gene_assay_plt_data <- layer_data(gene_assay_plt(), i = 1L) 
        temp_df <- all_genes_data()
        
        for(i in 1:nrow(gene_assay_plt_data)){
            if( between(input$gene_assay_click$x, gene_assay_plt_data$xmin[i], gene_assay_plt_data$xmax[i]) &
                between(input$gene_assay_click$y, gene_assay_plt_data$ymin[i], gene_assay_plt_data$ymax[i]) ) {
                
                sel_siRNA_Class <- gene_assay_plt_data$x__siRNA_Class[i]
                sel_DamID_Class <- gene_assay_plt_data$x__fill__DamID_Class[i]
                break
            }
        }
        
        temp_df$gene_sel_bool <- temp_df$siRNA_Class == sel_siRNA_Class & temp_df$DamID_Class == sel_DamID_Class
        
        all_genes_data(temp_df)
        
        
    },
    ignoreInit = TRUE)

        
   observeEvent(input$chr_length_click, {
        
        temp_df <- all_genes_data()
        
        gene_current_sel <- temp_df$chr_sel_bool
        gene_chr_click <- temp_df$chr == round(input$chr_length_click$y)
        
        # negate chr_sel_bool for all genes on the selected chromosome
        temp_df$chr_sel_bool[gene_chr_click==TRUE] <- !gene_current_sel[gene_chr_click==TRUE]
        
# something about updating the density plot? or something that will force it to update?? I thought updating all_genes_data() would do it...?        
        
        all_genes_data(temp_df)
        
    }, ignoreInit = TRUE)

      
   observeEvent(input$rna_expr_brush, {
       # if brushing is complete, proceed
       temp_df <- all_genes_data()
       
       temp_df[temp_df$Refseq %in% brushedPoints(GSE87831_fpkm_full_df, 
                                                 input$rna_expr_brush,
                                                 xvar="log10_fpkm")$Refseq,]$gene_sel_bool <- TRUE
       
       temp_df[!(temp_df$Refseq %in% brushedPoints(GSE87831_fpkm_full_df, 
                                                   input$rna_expr_brush,
                                                   xvar="log10_fpkm")$Refseq),]$gene_sel_bool <- FALSE
       
       all_genes_data(temp_df)
       
       # return the subset of densities of the genes represented in the selected area
       ##### NOTE: think some of thse are not represented in the same place on the x axis (??)

       # return(filter(GSE87831_fpkm_full_df, 
       #               Refseq %in% filter(all_genes_data(),
       #                                  gene_sel_bool==TRUE & chr_sel_bool==TRUE)$Refseq))
   }, ignoreInit = TRUE)
   

    ################    
    # Plot Outputs #
    ################
   
    output$gene_assay_mosaic_ptop <- renderPlot({
        p <- ggplot(data = filter(all_genes_data(), gene_sel_bool == TRUE & chr_sel_bool == TRUE)) +
                geom_mosaic(aes(x = product(DamID_Class, siRNA_Class), fill=DamID_Class)) +
                geom_mosaic_text(aes(x = product(DamID_Class, siRNA_Class), label = after_stat(.wt)), as.label=TRUE) +
                scale_x_productlist(labels=as_tibble(MOSAIC_PLOT_LABELS)$value) +
                theme(axis.text.x = element_text(angle = 90, hjust = 1, vjust = .5)) + 
                scale_y_productlist(labels=NULL) +
                scale_fill_manual(values = MOSAIC_PLOT_FILL, labels=MOSAIC_PLOT_LABELS) +
                labs(title="Genes Classified by DamID and siRNA Assays", x="siRNA Treatment Class", y="DamID Assay Results") +
#                theme_mosaic() +
                theme(axis.text.x = element_text(angle = 90, hjust = 1),
                      axis.ticks.x = element_blank(),
                      axis.ticks.y = element_blank())
        gene_assay_plt(p)
        p
    })
    
    output$gene_length_box_ptop <- renderPlot({
        p <- ggplot(data=filter(filter(all_genes_data(), gene_sel_bool == TRUE),
                    1 <= as.numeric(chr) & as.numeric(chr) <= 22)) +
            geom_boxplot(aes(y = chr, x = length, color=chr_sel_bool),
                         position = "dodge") +
            scale_color_manual( values = BOX_PLOT_COLOR, limits = names(BOX_PLOT_COLOR), labels=BOX_PLOT_LABELS ) +
            labs(title="Distribution of Gene Length by Chromosome")
        p
    })
    
    output$rna_expr_density_ptop <- renderPlot({
        p <- base_density_plt
        
        if(!is.null(fpkm_sel_rxtv())){
            p <- p + geom_density(data = fpkm_sel_rxtv(),
                                  mapping = aes(color = run, x = log10_fpkm, after_stat(scaled)), linewidth = 1.25) +
#                scale_color_manual(name=DENSITY_PLOT_LEGEND, values = DENSITY_PLOT_COLOR) +
                labs(title="RNA-Seq Expression Density (log10 Scaled)")
        }
        p
    })
    
    output$gene_table = DT::renderDataTable({
        select(all_genes_data(), -c(chr_sel_bool, gene_sel_bool))
    })
    
}

# Run Application
shinyApp(ui = ui, server = server)
