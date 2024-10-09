import React from "react";
import * as d3 from "d3";

interface LineChartProps {
  width: number;
  height: number;
  dataSets: Array<{ name: string; data: Array<{ x: number; y: number }> | [] }>;
}

interface LineChartState {
  dataSetsCopy: Array<{
    name: string;
    data: Array<{ x: number; y: number }> | [];
  }>;
}

class LineChartV3 extends React.Component<LineChartProps, LineChartState> {
  private svgRef: React.RefObject<SVGSVGElement>;
  private zoomTransform: d3.ZoomTransform = d3.zoomIdentity;
  private intervalId: NodeJS.Timeout | null = null;
  constructor(props: LineChartProps) {
    super(props);
    this.svgRef = React.createRef();
    this.state = {
      dataSetsCopy: [...props.dataSets],
    };
  }

  componentDidMount() {
    this.createChart();
    this.intervalId = setInterval(() => {
        this.updateChart();
      }, 1000);
  }

  shouldComponentUpdate(nextProps: LineChartProps, nextState: Readonly<{}>) {
    if (nextProps.dataSets !== this.props.dataSets) {
      this.updateChart();
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps: LineChartProps) {
    console.log("compare");
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.createChart();
    }

    if (this.state.dataSetsCopy.length < this.props.dataSets.length) {
      this.setState({ dataSetsCopy: [...this.props.dataSets] });
      this.updateChart();
    }
  }

  createChart() {
    if (!this.svgRef.current) return;

    const { width, height } = this.props;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svgElement = d3
      .select<SVGSVGElement, unknown>(this.svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const defs = svgElement.append("defs");
    defs
      .append("clipPath")
      .attr("id", "chartAreaClip")
      .append("rect")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    const g = svgElement
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${chartHeight})`);

    g.append("g").attr("class", "y-axis");

    g.append("g")
      .attr("class", "x-grid")
      .attr("transform", `translate(0,${chartHeight})`);

    g.append("g").attr("class", "y-grid");

    g.append("g")
      .attr("clip-path", "url(#chartAreaClip)")
      .attr("class", "chart-area");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10])
      .on("zoom", (event) => {
        this.zoomTransform = event.transform;
        this.updateChart();
      });

    svgElement.call(zoom);

    this.updateChart();
  }

  updateChart() {
    if (!this.svgRef.current) return;
  
    const { width, height, dataSets } = this.props;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
  
    const maxX = Math.max(...dataSets.flatMap((dataset) => dataset.data.map((d) => d.x)), 10) || 10;
    const maxY = Math.max(...dataSets.flatMap((dataset) => dataset.data.map((d) => d.y)), 10) || 10;
  
    const xScale = d3
      .scaleLinear()
      .domain([0, maxX])
      .range([0, chartWidth]);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([chartHeight, 0]);
  
    const svgElement = d3.select<SVGSVGElement, unknown>(this.svgRef.current);
    const transformedX = this.zoomTransform.rescaleX(xScale);
    const transformedY = this.zoomTransform.rescaleY(yScale);
  
    const colorScale = d3.scaleOrdinal<number, string>(d3.schemeCategory10);
  
    svgElement
      .select<SVGGElement>(".x-axis")
      .call(d3.axisBottom(transformedX).ticks(10) as any);
  
    svgElement
      .select<SVGGElement>(".y-axis")
      .call(d3.axisLeft(transformedY).ticks(10) as any);
  
    svgElement
      .select<SVGGElement>(".x-grid")
      .call(
        d3
          .axisBottom(transformedX)
          .tickSize(-chartHeight)
          .tickFormat(() => "") as any
      )
      .selectAll("line")
      .style("stroke", "#e0e0e0");
  
    svgElement
      .select<SVGGElement>(".y-grid")
      .call(
        d3
          .axisLeft(transformedY)
          .tickSize(-chartWidth)
          .tickFormat(() => "") as any
      )
      .selectAll("line")
      .style("stroke", "#e0e0e0");
  
    svgElement
      .select(".chart-area")
      .selectAll(".line")
      .data(dataSets)
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d, i) => colorScale(i))
      .attr("stroke-width", 2)
      .attr(
        "d",
        (d) =>
          d3
            .line<{ x: number; y: number }>()
            .x((d) => transformedX(d.x))
            .y((d) => transformedY(d.y))(d.data) || ""
      );
  }
  render() {
    console.log("re-render");
    return <svg ref={this.svgRef}></svg>;
  }
}

export default LineChartV3;
