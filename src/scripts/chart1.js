import * as d3 from "d3";

let style = getComputedStyle(document.body);

class Chart1 {
  setup() {
    this.width = 1000;
    this.height = 400;
    this.margin = { left: 100, top: 50, right: 50, bottom: 60 };
    this.hasAnimated = false;

    // SVG Größe bestimmen
    this.svg = d3
      .select("#chart1")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // Daten laden von .csv
    Promise.all([
      d3.csv("/assets/data/appleMobility.csv"),
      d3.csv("/assets/data/flug.csv")
    ]).then(this.dataLoaded.bind(this));

    // Event Listener
    d3.selectAll("#chart1-filter .nav-item").on("click", this.click.bind(this));
  }
  range;
  ange;
  ange;

  dataLoaded([data, data2]) {
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
    const parseTimeAir = d3.timeParse("%Y-%m-%d");

    data.forEach((d) => {
      // In korrekte Typen umwandeln
      d.driving = +d.driving;
      d.transit = +d.transit;
      d.walking = +d.walking;
      d.date = parseTime(d.date);
    });

    data2.forEach((d) => {
      // In korrekte Typen umwandeln
      d.DateTime = parseTimeAir(d.DateTime);
      d.percent = +d.percent;
    });

    //console.log(data2);
    //console.log(data);
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
      .style("font-size", "13px")
      .style("font-family", "Barlow")
      .attr("fill", style.getPropertyValue("--color-black"))
      .attr("transform", `translate(0, ${this.height})`)
      .call(d3.axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain([
        -100,
        d3.max(data, (d) => {
          return +d.driving - 80;
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
      .style("font-size", "16px")
      .style("color", style.getPropertyValue("--color-black"))
      .attr("x", this.width)
      .attr("y", this.height + 50)
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
    this.data2 = data2;
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
          .y(200)
      );

    // In einer Gruppe zeichnen
    this.svg = this.svg.append("g").attr("class", "graph");

    // Driving
    const drivingPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "car")
      //.attr('car', function(d){ return 'car' + d.id; })
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#EFDF23")
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
            return this.yScale(d.driving - 100);
          })
      );

    const drivingPathLength = drivingPath.node().getTotalLength();
    drivingPath
      .attr("stroke-dasharray", drivingPathLength + " " + drivingPathLength)
      .attr("stroke-dashoffset", drivingPathLength);

    // Train
    const trainPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("class", "train")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#E8A238")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .defined((d) => {
            return d.transit !== 0;
          })
          .x((d) => {
            return this.xScale(d.date);
          })
          .y((d) => {
            return this.yScale(d.transit - 100);
          })
      );

    const trainPathLength = trainPath.node().getTotalLength();
    trainPath
      .attr("stroke-dasharray", trainPathLength + " " + trainPathLength)
      .attr("stroke-dashoffset", trainPathLength);

    // Walk
    const walkingPath = this.svg
      .append("path")
      .datum(this.data)
      .attr("class", "walk")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#6AACFF")
      .attr("stroke-miter", 5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .defined((d) => {
            return d.walking !== 0;
          })
          .x((d) => {
            return this.xScale(d.date);
          })
          .y((d) => {
            return this.yScale(d.walking - 100);
          })
      );

    const walkingPathLength = walkingPath.node().getTotalLength();
    walkingPath
      .attr("stroke-dasharray", walkingPathLength + " " + walkingPathLength)
      .attr("stroke-dashoffset", walkingPathLength);

    //FLUGZEUG
    const airplanePath = this.svg
      .append("path")
      .datum(this.data2)
      .attr("class", "airplane")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke", "#F06439")
      .attr("stroke-miter", 5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => {
            return this.xScale(d.DateTime);
          })
          .y((d) => {
            return this.yScale(d.percent);
          })
      );

    const airplanePathLength = airplanePath.node().getTotalLength();
    airplanePath
      .attr("stroke-dasharray", airplanePathLength + " " + airplanePathLength)
      .attr("stroke-dashoffset", airplanePathLength);
  }

  click(e) {
    const pathClass = e.target.classList[1];
    const navItem = document.getElementsByClassName("nav-item " + pathClass)[0];

    this.svg
      .select("." + pathClass)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

      if(navItem.classList.contains('is-active')){
        navItem.classList.remove('is-active');
        this.svg.select("." + pathClass).attr("class", pathClass);
        this.svg.select("." + pathClass).transition().duration(200).style("opacity", 0);
      } else {
        navItem.classList.add('is-active');
        this.svg.select("." + pathClass).attr("class", pathClass + " is-active");
      }
  }

  exited() {
    console.log("Chart 1 exited");
  }
}

export default Chart1;
