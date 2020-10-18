import * as d3 from "d3";

let style = getComputedStyle(document.body);

class Chart2 {
  setup() {
    this.width = 1000;
    this.height = 400;
    this.margin = { left: 100, top: 50, right: 50, bottom: 60 };
    this.hasAnimated = false;

    // SVG Größe bestimmen
    this.svg = d3
      .select("#chart2")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // Daten laden von .csv
    d3.csv("/assets/data/google.csv").then(this.dataLoaded.bind(this));

    // Event Listener
    d3.selectAll("#chart2-filter .nav-item").on("click", this.click.bind(this));
  }

  dataLoaded(data) {
    d3.timeFormatDefaultLocale({
      decimal: ",",
      thousands: ".",
      grouping: [3],
      currency: ["€", ""],
      dateTime: "%a %b %e %X %Y",
      date: "%d.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
      ],
      shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      months: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
      ],
      shortMonths: [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez"
      ]
    });

    const parseTime = d3.timeParse("%Y-%m-%d");

    data.forEach((d) => {
      // In korrekte Typen umwandeln
      d.Einzelhandel = +d.Einzelhandel;
      d.Supermärkte = +d.Supermärkte;
      d.Parks = +d.Parks;
      d.Bahnhof = +d.Bahnhof;
      d.Arbeitsplatz = +d.Arbeitsplatz;
      d.date = parseTime(d.date);
    });

    // Nur "S&P 500" Aktie anzeigen
    // data = data.filter(d => {
    //     return d.symbol == "S&P 500";

    // Skalen
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          return d.date;
        })
      )
      .range([0, this.width]);

    this.svg
      .append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .style("font-size", "13px")
      .style("font-family", "Barlow")
      .style("color", style.getPropertyValue("--color-black"))
      .call(d3.axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain([
        -100,
        d3.max(data, (d) => {
          return +d.Parks;
        })
      ])
      .nice()
      .range([this.height, 0]);

    this.svg
      .append("g")
      .style("font-size", "13px")
      .style("font-family", "Barlow")
      .style("color", style.getPropertyValue("--color-black"))
      .call(d3.axisLeft(yScale));

    // Labels für Achsen

    // X Achse
    this.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", this.width)
      .attr("y", this.height + 50)
      .attr("fill", style.getPropertyValue("--color-black"))
      .text("Jahr 2020");

    // Y Achse
    this.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -this.margin.left + 50)
      .attr("x", 0)
      .attr("fill", style.getPropertyValue("--color-black"))
      .text("Prozentuale Änderung");

    // Daten und Skala für Zugriff außerhalb von setup() speichern
    this.data = data;
    this.xScale = xScale;
    this.yScale = yScale;

    this.drawPaths();
  }

  reached() {}

  drawPaths() {
    this.svg
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke-width", 0.5)
      .attr("stroke", "black")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => {
            return this.xScale(d.date);
          })
          .y(300)
      );

    // In einer Gruppe zeichnen
    this.svg = this.svg.append("g").attr("class", "graph");

    // Einzelhandel
    const EinzelhandelPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "shirt")
      //.attr('car', function(d){ return 'car' + d.id; })
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#31FFB5")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => {
            return this.xScale(d.date);
          })
          //.y0(this.height)
          .y((d) => {
            return this.yScale(d.Einzelhandel);
          })
      );

    const EinzelhandelPathLength = EinzelhandelPath.node().getTotalLength();
    EinzelhandelPath.attr(
      "stroke-dasharray",
      EinzelhandelPathLength + " " + EinzelhandelPathLength
    ).attr("stroke-dashoffset", EinzelhandelPathLength);

    // Supermärkte
    const SupermärktePath = this.svg
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("class", "shopping")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#F65220")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)

          .x((d) => {
            return this.xScale(d.date);
          })
          .y((d) => {
            return this.yScale(d.Supermärkte);
          })
      );

    const SupermärktePathLength = SupermärktePath.node().getTotalLength();
    SupermärktePath.attr(
      "stroke-dasharray",
      SupermärktePathLength + " " + SupermärktePathLength
    ).attr("stroke-dashoffset", SupermärktePathLength);

    // Walk
    const ParksPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "outdoor")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#21C4F1")
      .attr("stroke-miter", 5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)

          .x((d) => {
            return this.xScale(d.date);
          })
          .y((d) => {
            return this.yScale(d.Parks);
          })
      );

    const ParksPathLength = ParksPath.node().getTotalLength();
    ParksPath.attr(
      "stroke-dasharray",
      ParksPathLength + " " + ParksPathLength
    ).attr("stroke-dashoffset", ParksPathLength);

    //FLUGZEUG
    const BahnhofPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "school")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#E9961A")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => {
            return this.xScale(d.date);
          })
          //.y0(this.height)
          .y((d) => {
            return this.yScale(d.Bahnhof);
          })
      );

    const BahnhofPathLength = BahnhofPath.node().getTotalLength();
    BahnhofPath.attr(
      "stroke-dasharray",
      BahnhofPathLength + " " + BahnhofPathLength
    ).attr("stroke-dashoffset", BahnhofPathLength);

    //Arbeitsplatz

    const ArbeitsplatzPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "work")
      //.attr('car', function(d){ return 'car' + d.id; })
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#EE51FC")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => {
            return this.xScale(d.date);
          })
          //.y0(this.height)
          .y((d) => {
            return this.yScale(d.Arbeitsplatz);
          })
      );

    const ArbeitsplatzPathLength = ArbeitsplatzPath.node().getTotalLength();
    ArbeitsplatzPath.attr(
      "stroke-dasharray",
      ArbeitsplatzPathLength + " " + ArbeitsplatzPathLength
    ).attr("stroke-dashoffset", ArbeitsplatzPathLength);

    //Home

    const HomePath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "home")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#F9E82D")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => {
            return this.xScale(d.date);
          })
          .y((d) => {
            return this.yScale(d.Home);
          })
      );

    const HomePathLength = HomePath.node().getTotalLength();
    HomePath.attr(
      "stroke-dasharray",
      HomePathLength + " " + HomePathLength
    ).attr("stroke-dashoffset", HomePathLength);
  }

  click(e) {
    const pathClass = e.target.classList[1];

    this.svg.selectAll("path").transition().duration(200).style("opacity", 1);

    this.svg
      .select("." + pathClass)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);
  }

  exited() {
    console.log("Chart 2 exited");
  }
}

export default Chart2;
