import * as d3 from "d3";

class Chart1 {
    setup() {
        this.width = 600;
        this.height = 400;
        this.margin = { left: 100, top: 50, right: 50, bottom: 60 };
        this.hasAnimated = false;

        // SVG Größe bestimmen
        this.svg = d3.select("#chart1")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        // Daten laden von .csv
        d3.csv("/assets/data/appleMobility.csv")
            .then(this.dataLoaded.bind(this));
    }

    dataLoaded(data) {
        const parseTime = d3.timeParse("%-Y/%-m/%d");

        data.forEach(d => {
            // In korrekte Typen umwandeln
            d.driving = +d.driving;
            d.transit = +d.transit;
            d.walking = +d.walking;
            d.date = parseTime(d.date);
        });
        console.log(data);
        // Nur "S&P 500" Aktie anzeigen
        // data = data.filter(d => {
        //     return d.symbol == "S&P 500";
    

        // Skalen
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => { return d.date; }))
            .range([0, this.width]);

        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(xScale));

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => { return +d.driving; })]).nice()
            .range([this.height, 0]);

        this.svg.append("g")
            .call(d3.axisLeft(yScale));

        // Labels für Achsen

        // X Achse
        this.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", this.width)
            .attr("y", this.height + 50)
            .attr("fill", "white")
            .text("Jahre");

        // Y Achse
        this.svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -this.margin.left + 50)
            .attr("x", 0)
            .attr("fill", "white")
            .text("Aktienwert");

        // Pfde zeichnen
        this.svg.append("path")
            .datum(this.data)
            .attr("fill", "#cce5df")
            .attr("stroke-width", 1.5)
            .attr("class", "driving")
            .attr("d", d3.area()
                .x(d => { return this.xScale(d.date); })
                .y0(this.height)
                .y1( d => { return this.yScale(d.driving); })
            );

        this.svg.append("path")
            .datum(this.data)
            .attr("fill", "#cce5df")
            .attr("stroke-width", 1.5)
            .attr("class", "driving")
            .attr("d", d3.area()
                .x(d => { return this.xScale(d.date); })
                .y0(this.height)
                .y1( d => { return this.yScale(d.driving); })
            );


        // Daten und Skala für Zugriff außerhalb von setup() speichern
        this.data = data;
        this.xScale = xScale;
        this.yScale = yScale;
    }

    reached() {
        
    }

    exited() {
        console.log("Chart 1 exited");
    }
}

export default Chart1;