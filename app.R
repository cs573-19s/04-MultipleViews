# Full App

library(shiny)
library(reactlog)

library(tidyverse)
library(readr)
library(ggmosaic)


reactlog_enable()




GSE87831_fpkm_full_df <- filter(read_csv("data/GSE87831_fpkm_longer.csv")) %>% filter(fpkm != 0) %>% mutate(log10_fpkm = log10(fpkm)) %>% select(Refseq, Copies, run, fpkm, log10_fpkm)
x_data_log10_min <- min(filter(GSE87831_fpkm_longer_shiny, fpkm != 0)$log10_fpkm)
x_data_log10_max <- max(filter(GSE87831_fpkm_longer_shiny, fpkm != 0)$log10_fpkm)
DENSITY_Y_MAX <- 1

all_gene_data_df <- read_csv("data/nup_si_damid_gene_df.csv") %>%
    mutate(length = end - start) %>%
    select(Refseq, length, chr, siRNA_Class, DamID_Class) %>%
    mutate(across(chr:DamID_Class, as.factor)) %>%
    mutate(gene_sel_bool=replicate(length(Refseq), TRUE)) %>%
    mutate(chr_sel_bool=replicate(length(Refseq), TRUE))
ALL_GENES_COUNT <- nrow(all_gene_data_df)

base_density_plt <- ggplot(data = GSE87831_fpkm_full_df) +
    geom_density(aes(color = run, x = log10_fpkm)) + # need to scale to make density of subset selected fall on the same scale
    coord_cartesian(xlim = c(x_data_log10_min, x_data_log10_max), ylim=c(0,DENSITY_Y_MAX)) +
    theme(legend.position="none")


# Define UI

ui <- fluidPage( # Layout Guide: https://shiny.rstudio.com/articles/layout-guide.html
    
    fluidRow(
# Column 1
        column(6,
            fluidRow(
                column(12, "Genes Classified by DamID and siRNA Assays",
                    plotOutput("gene_assay_mosaic_ptop", click = clickOpts("gene_assay_click", clip = TRUE))
                )
            ),
            fluidRow(
                column(12, "Distribution of Gene Length by Chromosome",
                    plotOutput("gene_length_box_ptop", click = clickOpts("chr_length_click", clip = TRUE))
                    # Question: would there be a benefit to doing chromosome versus brushing by length?
                    # Question: how would setting up both work?
                )
            )
        ),
# Column 2
        column(6, "density_plot",
            fluidRow(
                column(12, "RNA-Seq Expression Density (Scaled)",
                       plotOutput("rna_expr_density_ptop", brush = brushOpts("rna_expr_brush", direction = "x"))
                )
            ),
            fluidRow(
                column(12, "Selected Genes",
                      # want table of selected genes here
                )
            )
        )
    
    )
)





# Establish Server Logic
server <- function(input, output) {

    all_genes_data <- reactiveVal(all_gene_data_df)
    
    
    gene_assay_plt <- reactiveVal()

    
    fpkm_sel_rxtv <- reactive({
        
        # if brushing isn't complete, stop
        # (kind of a "mouse up" event listener doesn't exist in shiny work around)
        
#        if(is.null(input$rna_expr_brush)) return()
        
        # if brushing is complete, proceed
        # temp_df <- all_genes_data()
        # 
        # temp_df[temp_df$Refseq %in% brushedPoints(GSE87831_fpkm_full_df, 
        #                                           input$rna_expr_brush,
        #                                           xvar="log10_fpkm")$Refseq,]$gene_sel_bool <- TRUE
        # 
        # temp_df[!(temp_df$Refseq %in% brushedPoints(GSE87831_fpkm_full_df, 
        #                                             input$rna_expr_brush,
        #                                             xvar="log10_fpkm")$Refseq),]$gene_sel_bool <- FALSE
        # 
        # all_genes_data(temp_df)
        
        # return the subset of densities of the genes represented in the selected area
        ##### NOTE: think some of thse are not represented in the same place on the x axis (??)
        # return(filter(GSE87831_fpkm_full_df, 
        #               Refseq %in% filter(all_genes_data(),
        #                                  gene_sel_bool==TRUE & chr_sel_bool==TRUE)$Refseq))
        
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
       
       return(filter(GSE87831_fpkm_full_df, 
                     Refseq %in% filter(all_genes_data(),
                                        gene_sel_bool==TRUE & chr_sel_bool==TRUE)$Refseq))
   },
   ignoreInit = TRUE)
   

    ################    
    # Plot Outputs #
    ################
   
    output$gene_assay_mosaic_ptop <- renderPlot({
        p <- ggplot(data = filter(all_genes_data(), gene_sel_bool == TRUE & chr_sel_bool == TRUE)) +
                geom_mosaic(aes(x = product(DamID_Class, siRNA_Class), fill=DamID_Class)) +
                geom_mosaic_text(aes(x = product(DamID_Class, siRNA_Class), label = after_stat(.wt)), as.label=TRUE) +
                theme_mosaic()
        gene_assay_plt(p)
        p
    })
    
    output$gene_length_box_ptop <- renderPlot({
        p <- ggplot(data=filter(all_genes_data(),
                                1 <= as.numeric(chr) & as.numeric(chr) <= 22)) +
            geom_boxplot(aes(y = chr, x = length, color=chr_sel_bool),
                         position = "dodge")
        p
    })
    
    output$rna_expr_density_ptop <- renderPlot({
        p <- base_density_plt
        
        if(!is.null(fpkm_sel_rxtv())){
            p <- p + geom_density(data = fpkm_sel_rxtv(), mapping = aes(color = run, x = log10_fpkm, after_stat(scaled)))
        }
        p
    })
    
}

# Run Application
shinyApp(ui = ui, server = server)
