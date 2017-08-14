import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import './Chart.scss';

function draw(chart, config) {
  const { axis, padding, data: { x, type, columns } } = config;
  const svg = d3.select(chart).select('.chart-svg');
  const main = svg.select('.chart-main');
  const chartWidth = svg.attr('width');
  const chartHeight = svg.attr('height');
  const width = chartWidth - padding.left - padding.right;
  const height = chartHeight - padding.top - padding.bottom;
  const yMin = axis.y.min;
  const yFormat = axis.y.tick.format;
  const xType = axis.x.type;
  const xFormat = axis.x.tick.format;

  if (xType === 'timeseries' && x === 'timestamp') {
    const xColumn = columns.filter(column => column[0] === x)[0].slice(1);
    const rawYColumns = columns.filter(column => column[0] !== x);
    const yColumns = rawYColumns.map(column => column.slice(1));
    const yLabels = rawYColumns.map(column => column.slice(0, 1)[0]);
    const dataSets = yLabels.map((yLabel, colIndex) => {
      return {
        label: yLabel,
        data: xColumn.map((d, rowIndex) => {
          return {
            timestamp: d,
            value: +yColumns[colIndex][rowIndex],
          };
        }).sort((d1, d2) => d1.timestamp.getTime() - d2.timestamp.getTime()),
      };
    });

    const xExtent = d3.extent(dataSets[0].data, d => d.timestamp);
    const xScale = d3.scaleTime()
      .domain(xExtent)
      .range([0, width]);
    const xTicks = xScale.ticks();
    let newXTicks = xTicks;
    if (xTicks.length > 10) {
      newXTicks = [];
      for (let i = 0; i < xTicks.length; i += 2) {
        newXTicks.push(xTicks[i]);
      }
    }
    if (newXTicks[newXTicks.length - 1] < xExtent[1]) {
      const lastXTick = new Date(newXTicks[newXTicks.length - 1].getTime() * 2 - newXTicks[newXTicks.length - 2].getTime());
      newXTicks.push(lastXTick);
      xExtent[1] = lastXTick;
      xScale.domain(xExtent);
    }
    const firstXTick = new Date(newXTicks[0].getTime() * 2 - newXTicks[1].getTime());
    if (newXTicks[0].getTime() > xExtent[0].getTime()) {
      newXTicks.unshift(firstXTick);
      xExtent[0] = firstXTick;
      xScale.domain(xExtent);
    }
    const xAxis = d3.axisBottom(xScale)
      .tickValues(newXTicks)
      .tickFormat(xFormat)
      .tickSizeInner(-height)
      .tickSizeOuter(0)
      .tickPadding(10);

    let yMax = d3.max(dataSets, set => d3.max(set.data, d => d.value));
    if (yMax === yMin) {
      yMax = yMin + 10;
      if (yFormat(yMin) === '0%') {
        yMax = 100;
      }
    }
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0]);
    const yTicks = yScale.ticks();
    const newYTicks = [];
    for (let i = 0; i < yTicks.length; i += 2) {
      newYTicks.push(yTicks[i]);
    }
    if (newYTicks[newYTicks.length - 1] < yMax) {
      const lastYTick = newYTicks[newYTicks.length - 1] * 2 - newYTicks[newYTicks.length - 2];
      newYTicks.push(lastYTick);
      yMax = lastYTick;
      yScale.domain([yMin, yMax]);
    }
    const yAxis = d3.axisLeft(yScale)
      .tickValues(newYTicks)
      .tickFormat(yFormat)
      .tickSizeInner(-width)
      .tickSizeOuter(0)
      .tickPadding(10);

    main.select('.chart-x-axis')
      .attr('transform', `translate(0, ${height})`) // TODO: why
      .call(xAxis);

    main.select('.chart-y-axis')
      .call(yAxis);

    main.select('.chart-tip-lines')
      .selectAll('line')
      .data(dataSets[0].data)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.timestamp))
      .attr('x2', d => xScale(d.timestamp))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'black')
      .attr('opacity', 0)
      .on('mouseover', function handler(d, i) {
        const top = +d3.select(this).attr('y1') + padding.top;
        const left = +d3.select(this).attr('x1') + padding.left;
        let html = `<div class="chart-tip-text"><i class="iconfont icon-time"></i>&nbsp;&nbsp;${xFormat(d.timestamp)}</div>`;
        dataSets.forEach((set, j) => (html += `<div class="chart-tip-text"><div class="chart-tip-circle chart-tip-circle-${j}"></div>${yFormat(set.data[i].value)}</div>`));
        d3.select(chart).select('.chart-tip')
          .style('display', 'initial')
          .style('top', `${top}px`)
          .style('left', `${left}px`)
          .html(`<div class="chart-tip-triangle"></div><div class="chart-tip-content">${html}</div>`);
      })
      .on('mouseout', () => {
        d3.select(chart).select('.chart-tip')
          .style('display', 'none');
      });

    if (type === 'line') {
      const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value));

      main.select('.chart-data')
        .selectAll('path')
        .data(dataSets)
        .enter()
        .append('path')
        .attr('class', (set, index) => `chart-line chart-line-${index}`)
        .attr('d', set => line(set.data));
    }

    if (type === 'area') {
      const area = d3.area()
        .x(d => xScale(d.timestamp))
        .y0(() => yScale(yMin))
        .y1(d => yScale(d.value));

      main.select('.chart-data')
        .selectAll('path')
        .data(dataSets)
        .enter()
        .append('path')
        .attr('class', (set, index) => `chart-area chart-area-${index}`)
        .attr('d', set => area(set.data));
    }

    const labels = svg.select('.chart-legend')
      .attr('transform', `translate(${width / 2 - (yLabels.length - 1) * 70 / 2 + 20}, ${height + 53})`)
      .selectAll('g')
      .data(yLabels)
      .enter()
      .append('g');

    labels
      .append('circle')
      .attr('cx', (label, index) => index * 70)
      .attr('cy', 0)
      .attr('r', 3)
      .attr('class', (label, index) => `chart-legend-circle-${index}`);

    labels
      .append('text')
      .text((label) => label)
      .attr('x', (label, index) => index * 70 + 10)
      .attr('y', 5)
      .attr('class', 'chart-legend-text');
  }
}

function createChart(chart, config) {
  const { padding } = config;
  const chartWidth = chart.getBoundingClientRect().width;
  const chartHeight = chart.getBoundingClientRect().height;

  const svg = d3.select(chart)
    .append('svg')
      .attr('class', 'chart-svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight);

  const main = svg
    .append('g')
      .attr('class', 'chart-main')
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

  main
    .append('g')
      .attr('class', 'chart-x-axis');

  main
    .append('g')
      .attr('class', 'chart-y-axis');

  main
    .append('g')
      .attr('class', 'chart-data');

  main
    .append('g')
    .attr('class', 'chart-tip-lines');


  d3.select(chart)
    .append('div')
    .attr('class', 'chart-tip');

  svg
    .append('g')
      .attr('class', 'chart-legend');

  if (config.data.columns[0].length > 1) {
    draw(chart, config);
  }
}

function removeChart(chart) {
  chart.innerHTML = '';
}

class Chart extends React.Component {

  constructor() {
    super();

    this.state = {};

    this.onWindowResize = this.onWindowResize.bind(this);
  }

  componentDidMount() {
    createChart(this.chart, this.props.config);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate() {
    draw(this.chart, this.props.config);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    removeChart(this.chart);
    createChart(this.chart, this.props.config);
  }

  render() {
    return (
      <div className="chart" ref={chart => { this.chart = chart; }} />
    );
  }
}

Chart.defaultProps = {};

Chart.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Chart;
