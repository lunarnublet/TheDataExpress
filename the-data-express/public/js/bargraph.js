var ctx1 = document.getElementById("graph-canvas-1").getContext("2d");
var ctx2 = document.getElementById("graph-canvas-2").getContext("2d");
var ctx3 = document.getElementById("graph-canvas-3").getContext("2d");

function BarGraph(ctx)
{
    this.ctx = ctx;
    this.width = 450;
    this.height = 200;	
    this.maxValue;
    this.margin = 5;
    this.colors = ["purple", "red", "green", "yellow"];
    this.curArr = [];
    this.backgroundColor = "rgba(0,0,0,0)";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 100;
    this.animationSteps = 10;
}

BarGraph.prototype.update = function (newArr) 
{
    this.curArr = newArr;
    this.draw(newArr);
};

BarGraph.prototype.draw = function(array)
{
    var numOfBars = array.length;
    var barWidth;
    var barHeight;
    var border = 2;
    var ratio;
    var maxBarHeight;
    var gradient;
    var largestValue;
    var graphAreaX = 0;
    var graphAreaY = 0;
    var graphAreaWidth = this.width;
    var graphAreaHeight = this.height;
    var i;

    if (this.ctx.canvas.width !== this.width || this.ctx.canvas.height !== this.height) 
    {
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
    }

    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, graphAreaWidth, graphAreaHeight);

    if(this.xAxisLabelArr.length)
    {
        graphAreaHeight-= 40;
    }

    barWidth = (graphAreaWidth / numOfBars) - this.margin * 2;
    maxBarHeight = graphAreaHeight - 25;

    for (i = 0; i < array.length; ++i) 
    {
        ratio = array[i] / 100;
        
        barHeight = ratio * maxBarHeight;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = "#999";

        this.ctx.fillStyle = "#333";			
        this.ctx.fillRect(this.margin + i * this.width / numOfBars, graphAreaHeight - barHeight, barWidth, barHeight);
            
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = "#333";
        this.ctx.font = "bold 12px sans-serif";
        this.ctx.textAlign = "center";

        try 
        {
            this.ctx.fillText(parseInt(array[i],10) + "%",
            i * this.width / numOfBars + (this.width / numOfBars) / 2,
            graphAreaHeight - barHeight - 10);
        } catch (ex) {}

        if (this.xAxisLabelArr[i])
        {				
            this.ctx.fillStyle = "#333";
            this.ctx.font = "bold 12px sans-serif";
            this.ctx.textAlign = "center";
            try 
            {
                this.ctx.fillText(this.xAxisLabelArr[i],
                i * this.width / numOfBars + (this.width / numOfBars) / 2,
                this.height - 10);
            } catch (ex) {}
        }
    }
};

var test = ["This", "Is", "Test"];

var graph1 = new BarGraph(ctx1);
graph1.margin = 2;
graph1.width = 450;
graph1.height = 200;
graph1.xAxisLabelArr = graph1AnswerNames;
graph1.update(graph1Answers);

var graph2 = new BarGraph(ctx2);
graph2.margin = 2;
graph2.width = 450;
graph2.height = 200;
graph2.xAxisLabelArr = graph2AnswerNames;
graph2.update(graph2Answers);

var graph3 = new BarGraph(ctx3);
graph3.margin = 2;
graph3.width = 450;
graph3.height = 200;
graph3.xAxisLabelArr = graph3AnswerNames;
graph3.update(graph3Answers);
