import * as d3 from "d3";

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

    // d3.csv("/assets/data/appleMobility.csv")
    // .then(this.dataLoaded.bind(this));
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
      d.ApothekenUndSupermarkte = +d.ApothekenUndSupermarkte;
      d.Parks = +d.Parks;
      d.Bahnhof = +d.Bahnhof;
      d.Arbeitsplatz = +d.Arbeitsplatz;
      d.Home = +d.Home;
      d.date = parseTime(d.date);
    });

    console.log(data);

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
      .call(d3.axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain([
        -200,
        d3.max(data, (d) => {
          return +d.Parks - 100;
        })
      ])
      .nice()
      .range([this.height, 0]);

    this.svg.append("g").call(d3.axisLeft(yScale));

    // Labels für Achsen

    // X Achse
    this.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", this.width)
      .attr("y", this.height + 50)
      .attr("fill", "white")
      .text("Jahr 2020");

    // Y Achse
    this.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -this.margin.left + 50)
      .attr("x", 0)
      .attr("fill", "white")
      .text("Prozentuale Änderung zu Baseline");

    // Daten und Skala für Zugriff außerhalb von setup() speichern
    this.data = data;
    this.xScale = xScale;
    this.yScale = yScale;
  }

  reached() {
    if (!this.hasAnimated && this.data) {
      this.svg
        .append("path")
        .datum(this.data)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "grey")
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveBasis)
            .x((d) => {
              return this.xScale(d.date);
            })
            .y(200)
          //.y1(this.height)
        );

      this.svg
        .append("path")
        .datum(this.data)
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
            .y(this.height)
          //.y1(this.height)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.xScale(d.date);
            })
            //.y0(this.height)
            .y((d) => {
              return this.yScale(d.Einzelhandel);
            })
        );

      this.svg
        .append("path")
        .datum(this.data)
        .attr("fill", "none")
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
            .y(this.height)
          //.y1(this.height)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.xScale(d.date);
            })
            //.y0(this.height)
            .y((d) => {
              return this.yScale(d.ApothekenUndSupermarkte);
            })
        );

      this.svg
        .append("path")
        .datum(this.data)
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
            .y(this.height)
          //.y1(this.height)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.xScale(d.date);
            })
            //.y0(this.height)
            .y((d) => {
              return this.yScale(d.Parks - 100);
            })
        );

      this.svg
        .append("path")
        .datum(this.data)
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
            .y(this.height)
          //.y1(this.height)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.xScale(d.date);
            })
            //.y0(this.height)
            .y((d) => {
              return this.yScale(d.Bahnhof);
            })
        );

      this.svg
        .append("path")
        .datum(this.data)
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "#EE51FC")
        .attr("stroke-miter", 5)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveBasis)
            .x((d) => {
              return this.xScale(d.date);
            })
            .y(this.height)
          //.y1(this.height)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.xScale(d.date);
            })
            //.y0(this.height)
            .y((d) => {
              return this.yScale(d.Arbeitsplatz);
            })
        );

      this.svg
        .append("path")
        .datum(this.data)
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
            .y(this.height)
          //.y1(this.height)
        )
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.xScale(d.date);
            })
            //.y0(this.height)
            .y((d) => {
              return this.yScale(d.Home);
            })
        );

      this.hasAnimated = true;
    }
  }

  exited() {
    console.log("Chart 1 exited");
  }
}

export default Chart2;
