import {writeFileSync, readFileSync} from 'fs';
import {mapValues} from 'lodash-es';
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';
import d3Hexbin from 'd3-hexbin';
import jsdom from 'jsdom';
import path from 'path';

// NOTE:
// To convert html svg to svg file
// Add `xmlns="http://www.w3.org/2000/svg"` attribute to svg element
// Cut and past svg element to file with `.svg` extension

// ---
// Main
// ---

async function main() {
  printSectionTitle('Basic D3 Array');
  basicD3Array();

  const dom = makeDOM();

  printSectionTitle('Bar chart (vertical)');
  basicBarChartVertical(dom);

  printSectionTitle('Bar chart (horizontal)');
  basicBarChartHorizontal(dom);

  printSectionTitle('Area chart');
  basicAreaChart(dom);

  printSectionTitle('Box plot');
  basicBoxPlot(dom);

  printSectionTitle('Donut chart');
  basicDonutChart(dom);

  printSectionTitle('Bar chart (grouped)');
  basicBarChartGrouped(dom);

  printSectionTitle('Histogram (KDE)');
  basicHistogramKde(dom);

  printSectionTitle('Joint hexbin');
  basicJointHexbin(dom);

  printSectionTitle('Line chart');
  basicLineChart(dom);

  printSectionTitle('Line chart (multi)');
  basicLineMulti(dom);

  printSectionTitle('Pie chart');
  basicPieChart(dom);

  printSectionTitle('Scatter plot');
  basicScatterPlot(dom);

  printSectionTitle('Violin plot');
  basicViolinPlot(dom);

  printSectionTitle('Bar chart (stacked)');
  basicBarChartStacked(dom);

  printSectionTitle('Bar chart (stacked) (normalized)');
  basicBarChartStackNorm(dom);

  printSectionTitle('Area chart (stacked)');
  basicAreaChartStacked(dom);

  printSectionTitle('Sunburst');
  basicSunburst(dom);

  printSectionTitle('Sunburst (me)');
  basicSunburstMe(dom);
}

// ---
// Utils
// ---

function printSectionTitle(title: string): void {
  console.log(`\n${title.toUpperCase()}\n`);
}

function makeDOM(): jsdom.JSDOM {
  const html = `
    <!DOCTYPE html>
    <html>
      <body></body>
    </html>
  `;
  return new jsdom.JSDOM(html);
}

function getInputFilepath(fn: string): string {
  return path.join('.', 'data', 'input', fn);
}

function getOutputFilepath(fn: string): string {
  return path.join('.', 'data', 'output', fn);
}

// ---
// Examples
// ---

// API Docs: https://d3js.org/api

function basicD3Array() {
  function primitiveArrays() {
    // prettier-ignore
    const arr = [
      1, 2, 3, 4, 5,
      2, 3, 4, 5, 6,
      3, 4, 5, 6, 7,
      4, 5, 6, 7, 8
    ];
    console.log({
      min: d3.min(arr), // Also minIndex
      max: d3.max(arr), // Also maxIndex
      extent: d3.extent(arr),
      mean: d3.mean(arr),
      median: d3.median(arr), // Also medianIndex
      mode: d3.mode(arr),

      sum: d3.sum(arr), // Also fsum (full precision sum)
      'quantile (.25)': d3.quantile(arr, 0.25),
      variance: d3.variance(arr),
      deviation: d3.deviation(arr),

      rank: d3.rank(arr),
      cumsum: d3.cumsum(arr), // Also fcumsum

      every: d3.every(arr, d => d > 0),
      some: d3.some(arr, d => d > 5),
      filter: d3.filter(arr, d => d > 5),
      reverse: d3.reverse(arr), // NOT in-place
      sort: d3.sort(arr), // NOT in-place; default comparator: d3.ascending
    });
  }
  primitiveArrays();

  function objectArrays() {
    const arr = [
      {firstName: 'Kakashi', lastName: 'Hatake', age: 27},
      {firstName: 'Iruka', lastName: 'Umino', age: 25},
      {firstName: 'Itachi', lastName: 'Uchiha', age: 21},
      {firstName: 'Hiruzen', lastName: 'Sarutobi', age: 68},
      {firstName: 'Minato', lastName: 'Namikaze', age: 24},
      {firstName: 'Shisui', lastName: 'Uchiha', age: 24},
    ];

    console.log({
      least: d3.least(arr, d => d.age), // Also leastIndex
      greatest: d3.greatest(arr, d => d.age), // Also greatestIndex
      group: d3.group(arr, n => n.lastName), // Also groups, flatGroup
      index: d3.index(arr, n => `${n.firstName}:${n.lastName}`), // Like lodash keyBy
      rollup: d3.rollup(
        arr,
        v => v.length, // reduce array values to single value
        n => n.lastName // keyBy lastName
      ),
    });
  }
  objectArrays();

  function sets() {
    const arr = [1, 2, 3, 4, 5];
    console.log({
      difference: d3.difference(arr, [1, 5]),
      union: d3.union(arr, [5, 6]),
      intersection: d3.intersection(arr, [3, 4, 5, 6]),
      superset: d3.superset(arr, [3, 4, 5]),
      subset: d3.subset(arr, [1, 2, 3, 4, 5, 6]),
      disjoint: d3.disjoint(arr, [6, 7, 8, 9, 10]),
    });
  }
  sets();

  function misc() {
    console.log({
      range: d3.range(5),
      // shuffle: shuffles in-place
    });
  }
  misc();
}

function basicBarChartHorizontal(dom: jsdom.JSDOM): void {
  // Data
  const data = d3
    .csvParse(
      readFileSync(getInputFilepath('alphabet.csv'), {encoding: 'utf-8'}),
      ({letter, frequency}) => ({name: letter, value: +frequency})
    )
    .sort((a, b) => d3.descending(a.value, b.value));

  // Dimensions
  const barHeight = 25;
  const margin = {top: 30, right: 0, bottom: 30, left: 30};
  const height =
    Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;
  const width = height;

  // Scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleBand<number>()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1);

  const format = xScale.tickFormat(20, '%');

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', xScale(0))
    .attr('y', (d, i) => yScale(i)!)
    .attr('width', d => xScale(d.value) - xScale(0))
    .attr('height', yScale.bandwidth());

  svg
    .append('g')
    .attr('fill', 'white')
    .attr('text-anchor', 'end')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', d => xScale(d.value) - 4)
    .attr('y', (d, i) => yScale(i)! + yScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(d => format(d.value));

  // Axis (x)
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(0,${margin.top})`)
      .call(d3.axisTop(xScale).ticks(width / 80, '%'))
      .call(g => g.select('.domain').remove())
  );

  // Axis (y)
  svg.append('g').call(g =>
    g.attr('transform', `translate(${margin.left},0)`).call(
      d3
        .axisLeft(yScale)
        .tickFormat(i => data[i]!.name)
        .tickSizeOuter(0)
    )
  );

  // Save output and clear body
  writeFileSync(
    getOutputFilepath('bar-chart-horizontal.html'),
    dom.serialize()
  );
  svg.remove();
}

function basicBarChartVertical(dom: jsdom.JSDOM): void {
  // Data
  const data = d3
    .csvParse(
      readFileSync(getInputFilepath('alphabet.csv'), {encoding: 'utf-8'}),
      ({letter, frequency}) => ({name: letter, value: +frequency})
    )
    .sort((a, b) => d3.descending(a.value, b.value));

  // Dimensions
  const barWidth = 25;
  const margin = {top: 30, right: 30, bottom: 30, left: 30};
  const width =
    Math.ceil((data.length + 0.1) * barWidth) + margin.left + margin.right;
  const height = width;

  // Scale
  const xScale = d3
    .scaleBand<number>()
    .domain(d3.range(data.length))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .range([height - margin.top, margin.top]);

  const format = yScale.tickFormat(20, '%');

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d, i) => xScale(i)!)
    .attr('y', (d, i) => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(0) - yScale(d.value));

  svg
    .append('g')
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 8)
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', (d, i) => xScale(i)! + xScale.bandwidth() / 2.5)
    .attr('y', d => yScale(d.value) + 10)
    .attr('dx', '0.4em')
    .text(d => format(d.value));

  // Axis (x)
  svg.append('g').call(g =>
    g.attr('transform', `translate(0,${height})`).call(
      d3
        .axisTop(xScale)
        .tickFormat(i => data[i]!.name)
        .tickSizeOuter(0)
    )
  );

  // Axis (y)
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(height / 80, '%'))
      .call(g => g.select('.domain').remove())
  );

  // Save output and clear body
  writeFileSync(getOutputFilepath('bar-chart-vertical.html'), dom.serialize());
  svg.remove();
}

function basicAreaChart(dom: jsdom.JSDOM): void {
  type CsvValue = {date: Date; value: number};

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('aapl.csv'), {encoding: 'utf-8'}),
    ({date, close}) =>
      ({
        date: new Date(date),
        value: Number(close),
      }) as CsvValue
  );

  // Dimensions
  const margin = {top: 20, right: 20, bottom: 30, left: 30};
  const height = 450;
  const width = 1.4 * height;

  // Scale
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const curve = d3.curveLinear;
  const area = d3
    .area<CsvValue>()
    .curve(curve)
    .x(d => xScale(d.date))
    .y0(yScale(0))
    .y1(d => yScale(d.value));

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg.append('path').datum(data).attr('fill', 'steelblue').attr('d', area);

  // Axis
  svg.append('g').call(g =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
  );
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('$ Close')
      )
  );

  // Save output and clear body
  writeFileSync(getOutputFilepath('area-chart.html'), dom.serialize());
  svg.remove();
}

function basicBoxPlot(dom: jsdom.JSDOM): void {
  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('diamonds.csv'), {encoding: 'utf-8'}),
    ({carat, price}) => ({x: +carat, y: +price})
  );

  // Dimensions
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const height = 600;
  const width = 800;
  const n = width / 40;

  type Value = {x: number; y: number};
  type ValueBin = d3.Bin<Value, number>;
  type BinStats = {
    quartiles: [number, number, number];
    range: [number, number];
    outliers: {x: number; y: number}[];
  };
  type ValueBinWithStats = ValueBin & BinStats;

  // Bins
  const bins: ValueBinWithStats[] = d3
    .bin<Value, number>()
    .thresholds(n)
    .value(d => d.x)(data)
    .map((bin: ValueBin): ValueBinWithStats => {
      bin.sort((a, b) => a.y - b.y);
      const values = bin.map(d => d.y);
      const min = values[0];
      const max = values[values.length - 1];
      const q1 = d3.quantile(values, 0.25)!;
      const q2 = d3.quantile(values, 0.5)!;
      const q3 = d3.quantile(values, 0.75)!;
      const iqr = q3 - q1; // interquartile range
      const r0 = Math.max(min, q1 - iqr * 1.5);
      const r1 = Math.min(max, q3 + iqr * 1.5);

      return {
        ...bin,
        quartiles: [q1, q2, q3],
        range: [r0, r1],
        outliers: bin.filter(v => v.y < r0 || v.y > r1),
      } as ValueBinWithStats;
    });

  // Scale
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(bins, d => d.x0)!, d3.max(bins, d => d.x1)!])
    .rangeRound([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(bins, d => d.range[0])!, d3.max(bins, d => d.range[1])!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  const g = svg.append('g').selectAll('g').data(bins).join('g');

  g.append('path')
    .attr('stroke', 'currentColor')
    .attr(
      'd',
      d => `
        M${xScale((d.x0! + d.x1!) / 2)},${yScale(d.range[1])}
        V${yScale(d.range[0])}
      `
    );

  g.append('path')
    .attr('fill', '#ddd')
    .attr(
      'd',
      d => `
        M${xScale(d.x0!) + 1},${yScale(d.quartiles[2])}
        H${xScale(d.x1!)}
        V${yScale(d.quartiles[0])}
        H${xScale(d.x0!) + 1}
        Z
      `
    );

  g.append('path')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2)
    .attr(
      'd',
      d => `
        M${xScale(d.x0!) + 1},${yScale(d.quartiles[1])}
        H${xScale(d.x1!)}
      `
    );

  g.append('g')
    .attr('fill', 'currentColor')
    .attr('fill-opacity', 0.2)
    .attr('stroke', 'none')
    .attr('transform', d => `translate(${xScale((d.x0! + d.x1!) / 2)},0)`)
    .selectAll('circle')
    .data(d => d.outliers)
    .join('circle')
    .attr('r', 2)
    .attr('cx', () => (Math.random() - 0.5) * 4)
    .attr('cy', d => yScale(d.y));

  svg
    .append('g')
    .call(g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(n).tickSizeOuter(0))
    );

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(null, 's'))
      .call(g => g.select('.domain').remove())
  );

  // Save output and clear body
  writeFileSync(getOutputFilepath('box-plot.html'), dom.serialize());
  svg.remove();
}

function basicDonutChart(dom: jsdom.JSDOM): void {
  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('population-by-age.csv'), {
      encoding: 'utf-8',
    }),
    ({name, value}) => ({name, value: Number(value)})
  );

  type CsvValue = {name: string; value: number};

  // Dimensions
  const height = 500;
  const width = 1.4 * height;

  // Geometry
  const arc = (() => {
    const radius = Math.min(width, height) / 2;
    return d3
      .arc<CsvValue, d3.DefaultArcObject>()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);
  })();
  const pie = d3
    .pie<CsvValue>()
    .padAngle(0.005)
    .sort(null)
    .value(d => d.value);
  const color = d3
    .scaleOrdinal<string, string, never>()
    .domain(data.map(d => d.name))
    .range(
      d3
        .quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
        .reverse()
    );

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const arcs = pie(data);

  svg
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('fill', d => color(d.data.name))
    // @ts-expect-error (arc isn't correct type)
    .attr('d', arc)
    .append('title')
    .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .selectAll('text')
    .data(arcs)
    .join('text')
    // @ts-expect-error (PieArcDatum<CsvValue> vs DefaultArcObject)
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .call(text =>
      text
        .append('tspan')
        .attr('y', '-0.4em')
        .attr('font-weight', 'bold')
        .text(d => d.data.name)
    )
    .call(text =>
      text
        .filter(d => d.endAngle - d.startAngle > 0.25)
        .append('tspan')
        .attr('x', 0)
        .attr('y', '0.7em')
        .attr('fill-opacity', 0.7)
        .text(d => d.data.value.toLocaleString())
    );

  // Save output and clear body
  writeFileSync(getOutputFilepath('donut-chart.html'), dom.serialize());
  svg.remove();
}

function basicBarChartGrouped(dom: jsdom.JSDOM): void {
  type StateGroup = 'CA' | 'TX' | 'NY' | 'FL' | 'IL' | 'PA';

  type AgeGroup =
    | '5 to 13 Years'
    | '14 to 17 Years'
    | '18 to 24 Years'
    | '25 to 44 Years'
    | '45 to 64 Years'
    | '65 Years and Over';

  type AgeGroupColor =
    | '#98abc5'
    | '#8a89a6'
    | '#7b6888'
    | '#6b486b'
    | '#a05d56'
    | '#d0743c'
    | '#ff8c00';

  type CsvValue = {
    State: StateGroup;
  } & {
    [ageGroup in AgeGroup]: number;
  };

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('population-by-age-and-state.csv'), {
      encoding: 'utf-8',
    }),
    ({State, ...v}) =>
      ({
        State,
        ...mapValues(v, Number),
      }) as CsvValue
  );

  // Dimensions
  const margin = {top: 10, right: 10, bottom: 20, left: 40};
  const height = 500;
  const width = 1.4 * height;

  const ageGroupKeys = data.columns.slice(1) as AgeGroup[];
  const stateGroupKey = data.columns[0] as 'State';

  const color = d3
    .scaleOrdinal<AgeGroup, AgeGroupColor, never>()
    .range([
      '#98abc5',
      '#8a89a6',
      '#7b6888',
      '#6b486b',
      '#a05d56',
      '#d0743c',
      '#ff8c00',
    ]);

  // Scale
  const xScaleStateGroup = d3
    .scaleBand<StateGroup>()
    .domain(data.map(d => d[stateGroupKey]))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1);
  const xScaleAgeGroup = d3
    .scaleBand<AgeGroup>()
    .domain(ageGroupKeys)
    .rangeRound([0, xScaleStateGroup.bandwidth()])
    .padding(0.05);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d3.max(ageGroupKeys, key => d[key]))!])
    .nice()
    .rangeRound([height - margin.bottom, margin.top]);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr(
      'transform',
      d => `translate(${xScaleStateGroup(d[stateGroupKey])},0)`
    )
    .selectAll('rect')
    .data(d => ageGroupKeys.map(key => ({key, value: d[key]})))
    .join('rect')
    .attr('x', d => xScaleAgeGroup(d.key)!)
    .attr('y', d => yScale(d.value))
    .attr('width', xScaleAgeGroup.bandwidth())
    .attr('height', d => yScale(0) - yScale(d.value))
    .attr('fill', d => color(d.key));

  // X-axis
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleStateGroup).tickSizeOuter(0))
      .call(g => g.select('.domain').remove())
  );

  // Y-axis
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(null, 's'))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('Population')
      )
  );

  // Legend
  svg.append('g').call(svg => {
    const g = svg
      .attr('transform', `translate(${width},0)`)
      .attr('text-anchor', 'end')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('g')
      .data(color.domain().slice().reverse())
      .join('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    g.append('rect')
      .attr('x', -19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', color);

    g.append('text')
      .attr('x', -24)
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .text(d => d);
  });

  // Save output and clear body
  writeFileSync(getOutputFilepath('bar-chart-grouped.html'), dom.serialize());
  svg.remove();
}

function basicHistogramKde(dom: jsdom.JSDOM): void {
  const data: number[] = JSON.parse(
    readFileSync(getInputFilepath('old-faithful.json'), {encoding: 'utf-8'})
  );

  // Dimensions
  const margin = {top: 20, right: 20, bottom: 30, left: 30};
  const height = 500;
  const width = 1.6 * height;

  // Scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data) as [number, number])
    .nice()
    .range([margin.left, width - margin.right]);

  const thresholds = xScale.ticks(40);
  const bins = d3
    .bin<number, number>()
    .domain(xScale.domain() as [number, number])
    .thresholds(thresholds)(data);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, d => d.length)! / data.length])
    .range([height - margin.bottom, margin.top]);

  // Geometry
  const bandwidth = 6.0;
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .attr('fill', '#bbb')
    .selectAll('rect')
    .data(bins)
    .join('rect')
    .attr('x', d => xScale(d.x0!) + 1)
    .attr('y', d => yScale(d.length / data.length))
    .attr('width', d => xScale(d.x1!) - xScale(d.x0!) - 1)
    .attr('height', d => yScale(0) - yScale(d.length / data.length));

  function kde(
    kernel: (x: number) => number,
    thresholds: number[],
    data: number[]
  ): number[][] {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))!]);
  }

  function epanechnikov(bandwidth: number) {
    return function (x: number): number {
      return Math.abs((x /= bandwidth)) <= 1
        ? (0.75 * (1 - x * x)) / bandwidth
        : 0;
    };
  }

  const density = kde(epanechnikov(bandwidth), thresholds, data);

  svg
    .append('path')
    .datum(density)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('d', d => line(d as [number, number][]));

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .call(g =>
        g
          .append('text')
          .attr('x', width - margin.right)
          .attr('y', -6)
          .attr('fill', '#000')
          .attr('text-anchor', 'end')
          .attr('font-weight', 'bold')
      )
  );

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(null, '%'))
      .call(g => g.select('.domain').remove())
  );

  // Save output and clear body
  writeFileSync(getOutputFilepath('histogram-kde.html'), dom.serialize());
  svg.remove();
}

function basicJointHexbin(dom: jsdom.JSDOM): void {
  type CsvValue = {
    x: number;
    y: number;
    group: 'A' | 'B';
  };

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('density.csv'), {
      encoding: 'utf-8',
    }),
    ({x, y, group}) => ({x: +x, y: +y, group}) as CsvValue
  );

  // Dimensions
  const margin = {top: 10, right: 30, bottom: 30, left: 40};
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Scale
  const xScale = d3.scaleLinear().domain([5, 18]).range([0, width]);
  const yScale = d3.scaleLinear().domain([5, 20]).range([height, 0]);

  // Geometry
  const hexbinPoints: [number, number][] = data.map(d => [
    xScale(d.x),
    yScale(d.y),
  ]);
  const color = d3
    .scaleLinear<number, string, never>()
    .domain([0, 600]) // Number of points in the bin?
    // @ts-expect-error (string vs number)
    .range(['transparent', '#69b3a2']);

  const hexbin = d3Hexbin
    .hexbin()
    .radius(9) // size of the bin in px
    .extent([
      [0, 0],
      [width, height],
    ]);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // X-axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  // Y-axis
  svg.append('g').call(d3.axisLeft(yScale));

  svg
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  svg
    .append('g')
    .attr('clip-path', 'url(#clip)')
    .selectAll('path')
    .data(hexbin(hexbinPoints))
    .enter()
    .append('path')
    .attr('d', hexbin.hexagon())
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
    .attr('fill', d => color(d.length))
    .attr('stroke', 'black')
    .attr('stroke-width', '0.1');

  // Save output and clear body
  writeFileSync(getOutputFilepath('joint-hexbin.html'), dom.serialize());
  svg.remove();
}

function basicLineChart(dom: jsdom.JSDOM): void {
  type CsvValue = {date: Date; value: number};

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('aapl.csv'), {encoding: 'utf-8'}),
    ({date, close}): CsvValue => ({
      date: new Date(date),
      value: Number(close),
    })
  );

  // Dimensions
  const margin = {top: 20, right: 20, bottom: 30, left: 30};
  const height = 500;
  const width = 1.4 * height;

  // Scale
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, d => d.date) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Geometry
  const line = d3
    .line<CsvValue>()
    .defined(d => !isNaN(d.value))
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  // X-axis
  svg.append('g').call(g =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
  );

  // Y-axis
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('$ Close')
      )
  );

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);

  // Save output and clear body
  writeFileSync(getOutputFilepath('line.html'), dom.serialize());
  svg.remove();
}

function basicLineMulti(dom: jsdom.JSDOM): void {
  // Data
  const rawData = d3.csvParse(
    readFileSync(getInputFilepath('unemployment.csv'), {encoding: 'utf-8'})
  );
  const columns = rawData.columns.slice(1);
  const data = {
    y: '% Unemployment',
    series: rawData.map(d => ({
      name: d.name.replace(/, ([\w-]+).*/, ' $1'),
      values: columns.map(k => +d[k]),
    })),
    dates: columns.map(c => d3.utcParse('%Y-%m')(c)!),
  };

  // Dimensions
  const margin = {top: 20, right: 20, bottom: 30, left: 30};
  const height = 500;
  const width = 1.6 * height;

  // Scale
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data.dates) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.series, d => d3.max(d.values))!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('overflow', 'visible');

  // X-axis
  svg.append('g').call(g =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
  );

  // Y-axis
  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('% Unemployment')
      )
  );

  // Geometry
  const line = d3
    .line<number>()
    .defined(d => !isNaN(d))
    .x((d, i) => xScale(data.dates[i]))
    .y(d => yScale(d));

  // TODO: use path for hover event
  const path = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .selectAll('path')
    .data(data.series)
    .join('path')
    .style('mix-blend-mode', 'multiply')
    .attr('d', d => line(d.values));

  // Save output and clear body
  writeFileSync(getOutputFilepath('line-multi.html'), dom.serialize());
  svg.remove();
}

function basicPieChart(dom: jsdom.JSDOM): void {
  type CsvValue = {name: string; value: number};

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('population-by-age.csv'), {
      encoding: 'utf-8',
    }),
    ({name, value}): CsvValue => ({name, value: Number(value)})
  );

  // Dimensions
  const height = 500;
  const width = 1.4 * height;

  // Geometry
  const arc = d3
    .arc<CsvValue, d3.PieArcDatum<CsvValue>>()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);
  const arcLabel = (() => {
    const radius = (Math.min(width, height) / 2) * 0.8;
    return d3
      .arc<CsvValue, d3.PieArcDatum<CsvValue>>()
      .innerRadius(radius)
      .outerRadius(radius);
  })();
  const pie = d3
    .pie<CsvValue>()
    .sort(null)
    .value(d => d.value);
  const color = d3
    .scaleOrdinal<string, string, never>()
    .domain(data.map(d => d.name))
    .range(
      d3
        .quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
        .reverse()
    );
  const arcs = pie(data);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  svg
    .append('g')
    .attr('stroke', 'white')
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('fill', d => color(d.data.name))
    // @ts-expect-error (idk)
    .attr('d', arc)
    .append('title')
    .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .selectAll('text')
    .data(arcs)
    .join('text')
    .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
    .call(text =>
      text
        .append('tspan')
        .attr('y', '-0.4em')
        .attr('font-weight', 'bold')
        .text(d => d.data.name)
    )
    .call(text =>
      text
        .filter(d => d.endAngle - d.startAngle > 0.25)
        .append('tspan')
        .attr('x', 0)
        .attr('y', '0.7em')
        .attr('fill-opacity', 0.7)
        .text(d => d.data.value.toLocaleString())
    );

  // Save output and clear body
  writeFileSync(getOutputFilepath('pie.html'), dom.serialize());
  svg.remove();
}

function basicScatterPlot(dom: jsdom.JSDOM): void {
  type Species = 'setosa' | 'versicolor' | 'virginica';
  type CsvValue = {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: Species;
  };
  type InputColumns = keyof Omit<CsvValue, 'species'>;

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('iris.csv'), {encoding: 'utf-8'}),
    ({sepalLength, sepalWidth, petalLength, petalWidth, species}) =>
      ({
        sepalLength: Number(sepalLength),
        sepalWidth: Number(sepalWidth),
        petalLength: Number(petalLength),
        petalWidth: Number(petalWidth),
        species,
      }) as CsvValue
  );

  // Dimensions
  const padding = 20;
  const width = 850;

  const columns = data.columns.filter(d => d !== 'species') as InputColumns[];
  const size =
    (width - (columns.length + 1) * padding) / columns.length + padding;

  // Scale
  const xScale = columns.map(c =>
    d3
      .scaleLinear()
      .domain(d3.extent(data, d => d[c]) as [number, number])
      .rangeRound([padding / 2, size - padding / 2])
  );
  const yScale = xScale.map(x =>
    x.copy().range([size - padding / 2, padding / 2])
  );
  const zScale = d3
    .scaleOrdinal()
    .domain(data.map(d => d.species))
    .range(d3.schemeCategory10);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('viewBox', `${-padding} 0 ${width} ${width}`)
    .style('max-width', '100%')
    .style('height', 'auto');

  svg.append('g').call(
    (() => {
      const axis = d3
        // @ts-expect-error (idk)
        .axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
      return g =>
        g
          .selectAll('g')
          .data(xScale)
          .join('g')
          .attr('transform', (d, i) => `translate(${i * size},0)`)
          .each(function (d) {
            // @ts-expect-error (idk)
            return d3.select(this).call(axis.scale(d));
          })
          .call(g => g.select('.domain').remove())
          .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));
    })()
  );

  svg.append('g').call(
    (() => {
      const axis = d3
        // @ts-expect-error (idk)
        .axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
      return g =>
        g
          .selectAll('g')
          .data(yScale)
          .join('g')
          .attr('transform', (d, i) => `translate(0,${i * size})`)
          .each(function (d) {
            // @ts-expect-error (idk)
            return d3.select(this).call(axis.scale(d));
          })
          .call(g => g.select('.domain').remove())
          .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));
    })()
  );

  const cell = svg
    .append('g')
    .selectAll('g')
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join('g')
    .attr('transform', ([i, j]) => `translate(${i * size},${j * size})`);

  cell
    .append('rect')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('x', padding / 2 + 0.5)
    .attr('y', padding / 2 + 0.5)
    .attr('width', size - padding)
    .attr('height', size - padding);

  cell.each(function ([i, j]) {
    d3.select(this)
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale[i](d[columns[i]]))
      .attr('cy', d => yScale[j](d[columns[j]]));
  });

  cell
    .selectAll('circle')
    .attr('r', 3.5)
    .attr('fill-opacity', 0.7)
    // @ts-expect-error (idk)
    .attr('fill', d => zScale(d.species));

  svg
    .append('g')
    .style('font', 'bold 10px sans-serif')
    .selectAll('text')
    .data(columns)
    .join('text')
    .attr('transform', (d, i) => `translate(${i * size},${i * size})`)
    .attr('x', padding)
    .attr('y', padding)
    .attr('dy', '.71em')
    .text(d => d);

  // Save output and clear body
  writeFileSync(getOutputFilepath('scatter.html'), dom.serialize());
  svg.remove();
}

function basicViolinPlot(dom: jsdom.JSDOM): void {
  type Species = 'setosa' | 'versicolor' | 'virginica';
  type CsvValue = {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: Species;
  };

  // Data
  const data = d3.csvParse(
    readFileSync(getInputFilepath('iris.csv'), {encoding: 'utf-8'}),
    ({sepalLength, sepalWidth, petalLength, petalWidth, species}) =>
      ({
        sepalLength: Number(sepalLength),
        sepalWidth: Number(sepalWidth),
        petalLength: Number(petalLength),
        petalWidth: Number(petalWidth),
        species,
      }) as CsvValue
  );

  // Dimensions
  const margin = {top: 10, right: 30, bottom: 30, left: 40};
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Scale
  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(['setosa', 'versicolor', 'virginica'])
    .padding(0.05);
  const yScale = d3
    .scaleLinear()
    .domain([3.5, 8]) // Note that here the Y scale is set manually
    .range([height, 0]);

  // Geometry
  const histogram = d3
    .bin()
    .domain(yScale.domain() as [number, number])
    .thresholds(yScale.ticks(20))
    .value(d => d);

  // TODO: replace "nest" usage
  const sumstat = d3Collection
    .nest<CsvValue, d3.Bin<number, number>[]>() // { key: string, values: object[] }[]
    .key(d => d.species)
    .rollup(d => {
      const input = d.map(g => g.sepalLength);
      const bins = histogram(input);
      return bins;
    })
    .entries(data);

  let maxNum = 0;
  for (const i in sumstat) {
    const allBins = sumstat[i].value!;
    const lengths = allBins.map(a => {
      return a.length;
    });
    const longest = d3.max(lengths) as any as number;
    if (longest > maxNum) {
      maxNum = longest;
    }
  }

  const xNum = d3
    .scaleLinear()
    .range([0, xScale.bandwidth()])
    .domain([-maxNum, maxNum]);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g').call(d3.axisLeft(yScale));

  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  svg
    .selectAll('myViolin')
    .data(sumstat)
    .enter()
    .append('g')
    .attr('transform', d => 'translate(' + xScale(d.key) + ' ,0)')
    .append('path')
    .datum(d => d.value!)
    .style('stroke', 'none')
    .style('fill', '#69b3a2')
    .attr(
      'd',
      // @ts-expect-error (idk)
      d3
        .area()
        .x0(d => xNum(-d.length))
        .x1(d => xNum(d.length))
        // @ts-expect-error (idk)
        .y(d => yScale(d.x0))
        .curve(d3.curveCatmullRom)
    );

  // Save output and clear body
  writeFileSync(getOutputFilepath('violin-plot.html'), dom.serialize());
  svg.remove();
}

function basicBarChartStacked(dom: jsdom.JSDOM): void {
  type AgeGroups = {
    [ageGroup: string]: number;
  };

  type CsvValue = {
    name: string;
  } & AgeGroups;
  type CsvValueWithTotal = CsvValue & {total: number};

  // Data
  const data = d3
    .csvParse(
      readFileSync(getInputFilepath('population-by-age-and-state-full.csv'), {
        encoding: 'utf-8',
      }),
      ({name, ...ageGroups}, i, columns) => {
        const row = {
          name,
          ...mapValues(ageGroups, v => Number(v)),
        } as CsvValueWithTotal;
        row.total = d3.sum(columns, c => row[c]);
        return row;
      }
    )
    .sort((a, b) => b.total - a.total);

  // Dimensions
  const margin = {top: 10, right: 10, bottom: 20, left: 40};
  const height = 500;
  const width = 1.8 * height;

  // Geometry
  const formatValue = (x: number) =>
    isNaN(x) ? 'N/A' : x.toLocaleString('en');
  const series = d3
    .stack<any, CsvValue, string>()
    .keys(data.columns.slice(1) as string[])(data)
    .map(d => {
      d.forEach(p => {
        // @ts-expect-error ("v" doesnt have "key")
        p.key = d.key;
      });
      return d;
    });

  // color
  const color = d3
    .scaleOrdinal<string, string, string>()
    .domain(series.map(d => d.key))
    .range(d3.schemeSpectral[series.length])
    .unknown('#ccc');

  // Scale
  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))!])
    .rangeRound([height - margin.bottom, margin.top]);

  // D3 container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .selectAll('g')
    .data(series)
    .join('g')
    .attr('fill', d => color(d.key))
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', (d, i) => xScale(d.data.name as any as string)!)
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale.bandwidth())
    .append('title')
    // @ts-expect-error ("v" doesnt have "key")
    .text(p => `${p.data.name} ${p.key} ${formatValue(p.data[p.key])}`);

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .call(g => g.selectAll('.domain').remove())
  );

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(null, 's'))
      .call(g => g.selectAll('.domain').remove())
  );

  // Save output and clear body
  writeFileSync(getOutputFilepath('bar-chart-stacked.html'), dom.serialize());
  svg.remove();
}

function basicBarChartStackNorm(dom: jsdom.JSDOM): void {
  type AgeGroups = {
    [ageGroup: string]: number;
  };

  type CsvValue = {
    name: string;
  } & AgeGroups;
  type CsvValueWithTotal = CsvValue & {total: number};

  // Data
  const data = d3
    .csvParse(
      readFileSync(getInputFilepath('population-by-age-and-state-full.csv'), {
        encoding: 'utf-8',
      }),
      ({name, ...ageGroups}, i, columns) => {
        const row = {
          name,
          ...mapValues(ageGroups, v => Number(v)),
        } as CsvValueWithTotal;
        row.total = d3.sum(columns, c => row[c]);
        return row;
      }
    )
    .sort((a, b) => b['<10'] / b.total - a['<10'] / a.total);

  // Dimensions
  const margin = {top: 30, right: 10, bottom: 0, left: 30};
  const height = data.length * 25 + margin.top + margin.bottom;
  const width = 0.8 * height;

  // Geometry
  const formatValue = (x: number) =>
    isNaN(x) ? 'N/A' : x.toLocaleString('en');
  const formatPercent = d3.format('.1%');
  const series = d3
    .stack<any, CsvValue, string>()
    .keys(data.columns.slice(1) as string[])
    .offset(d3.stackOffsetExpand)(data)
    .map(d => {
      d.forEach(p => {
        // @ts-expect-error ("v" doesnt have "key")
        p.key = d.key;
      });
      return d;
    });
  // color
  const color = d3
    .scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemeSpectral[series.length])
    .unknown('#ccc');

  // Scale
  const xScale = d3.scaleLinear().range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.top, height - margin.bottom])
    .padding(0.08);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('overflow', 'visible');

  svg
    .append('g')
    .selectAll('g')
    .data(series)
    .enter()
    .append('g')
    // @ts-expect-error ("p" has no "key")
    .attr('fill', p => color(p.key))
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', d => xScale(d[0]))
    .attr('y', d => yScale(d.data.name)!)
    .attr('width', d => xScale(d[1]) - xScale(d[0]))
    .attr('height', yScale.bandwidth())
    .append('title')
    .text(
      p =>
        // @ts-expect-error ("p" has no "key")
        `${p.data.name} ${p.key} ${formatPercent(p[1] - p[0])} (${formatValue(p.data[p.key])})`
    );

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(0,${margin.top})`)
      .call(d3.axisTop(xScale).ticks(width / 100, '%'))
      .call(g => g.selectAll('.domain').remove())
  );

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickSizeOuter(0))
      .call(g => g.selectAll('.domain').remove())
  );

  // Save output and clear body
  writeFileSync(
    getOutputFilepath('bar-chart-stacked-normalized.html'),
    dom.serialize()
  );
  svg.remove();
}

function basicAreaChartStacked(dom: jsdom.JSDOM) {
  type IndustryGroups = {
    [industryGroup: string]: number;
  };

  type CsvValue = {
    date: Date;
  } & IndustryGroups;
  type CsvValueWithTotal = CsvValue & {total: number};

  // Data
  const data = d3
    .csvParse(
      readFileSync(getInputFilepath('unemployment-by-industry.csv'), {
        encoding: 'utf-8',
      }),
      ({date, ...industryGroups}, i, columns) => {
        const row = {
          date: new Date(date),
          ...mapValues(industryGroups, v => Number(v)),
        } as CsvValueWithTotal;
        row.total = d3.sum(columns, c => row[c]);
        return row;
      }
    )
    .sort((a, b) => b.total - a.total);

  // Dimensions
  const margin = {top: 20, right: 180, bottom: 30, left: 40};
  const height = 500;
  const width = 1.8 * height;

  const numericColumns = data.columns.slice(1) as string[];

  // Visual
  const series = d3.stack().keys(numericColumns)(data);
  const color = d3
    .scaleOrdinal<string, string, never>()
    .domain(numericColumns)
    .range(d3.schemeCategory10);

  // Scale
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, d => d.date) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Geometry
  const area = d3
    .area<[number, number] & {data: CsvValue}>() // TODO: fix type
    .x(d => xScale(d.data.date))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body.append('svg').attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .selectAll('path')
    .data(series)
    .join('path')
    .attr('fill', d => color(d.key))
    // @ts-expect-error (idk)
    .attr('d', area)
    .append('title')
    .text(d => d.key);

  svg.append('g').call(g =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
  );

  svg.append('g').call(g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('Unemployment')
      )
  );

  // Legend
  svg.append('g').call(svg => {
    const g = svg
      .attr(
        'transform',
        `translate(${width},${height / 2 - 10 * numericColumns.length})`
      )
      .attr('text-anchor', 'end')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('g')
      .data(color.domain().slice().reverse())
      .join('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    g.append('rect')
      .attr('x', -19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', color);

    g.append('text')
      .attr('x', -24)
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .text(d => d);
  });

  // Save output and clear body
  writeFileSync(getOutputFilepath('area-chart-stacked.html'), dom.serialize());
  svg.remove();
}

function basicSunburst(dom: jsdom.JSDOM): void {
  // Types
  type SunburstLeaf = {
    name: string;
    size: number;
  };
  type SunburstBranch = {
    name: string;
    children: (SunburstBranch | SunburstLeaf)[];
  };

  // Data
  const data: SunburstBranch = JSON.parse(
    readFileSync(getInputFilepath('flare.json'), {
      encoding: 'utf-8',
    })
  );

  // Dimensions
  const width = 1152; // outer width, in pixels
  const height = 1152; // outer height, in pixels
  const margin = {top: 1, right: 1, bottom: 1, left: 1};

  // Geometry
  const padding = 1; // separation between arcs
  const startAngle = 0; // the starting angle for the sunburst
  const endAngle = 2 * Math.PI; // the ending angle for the sunburst
  const radius =
    Math.min(
      width - margin.left - margin.right,
      height - margin.top - margin.bottom
    ) / 2; // outer radius
  const colorScheme = d3.interpolateRainbow; // color scheme, if any
  const fill = '#ccc'; // fill for arcs (if no color encoding)
  const fillOpacity = 0.6; // fill opacity for arcs

  // Helpers
  const label = (d: SunburstLeaf) => d.name;
  const value = (d: SunburstLeaf) => d.size;
  // const id = Array.isArray(data) ? (d: {id: string}) => d.id : null;
  const title = (n: d3.HierarchyNode<SunburstLeaf>) =>
    `${n
      .ancestors()
      .reverse()
      .map(d => d.data.name)
      .join('.')}\n${n.value!.toLocaleString('en')}`;

  // @ts-expect-error (Branch will have children, Leaf won't)
  const root = d3.hierarchy<SunburstLeaf>(data, d => d.children);
  root.sum(d => Math.max(0, value(d)));
  root.sort((a, b) => d3.descending(a.value, b.value));
  d3.partition<SunburstLeaf>().size([endAngle - startAngle, radius])(root);
  const color = d3
    .scaleSequential([0, root.children!.length], colorScheme)
    .unknown(fill);
  // @ts-expect-error (`d3.HierarchyNode<SunburstLeaf>` doesn't have `index`)
  root.children!.forEach((child, i) => (child.index = i));
  const arc = d3
    .arc<SunburstBranch, any>()
    .startAngle(d => d.x0 + startAngle)
    .endAngle(d => d.x1 + startAngle)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, (2 * padding) / radius))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - padding);

  // D3 Container
  const body = d3.select(dom.window.document.querySelector('body'));
  const svg = body
    .append('svg')
    .attr('viewBox', [
      margin.right - margin.left - width / 2,
      margin.bottom - margin.top - height / 2,
      width,
      height,
    ])
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'middle');

  const cell = svg.selectAll('a').data(root.descendants()).join('a');

  cell
    .append('path')
    // @ts-expect-error (idk)
    .attr('d', arc)
    // @ts-expect-error (`d3.HierarchyNode<SunburstLeaf>` doesn't have `index`)
    .attr('fill', color ? d => color(d.ancestors().reverse()[1]?.index) : fill)
    .attr('fill-opacity', fillOpacity);

  cell
    .filter((d: any) => ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
    .append('text')
    .attr('transform', (d: any) => {
      if (!d.depth) return null;
      const x = (((d.x0 + d.x1) / 2 + startAngle) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr('dy', '0.32em')
    .text(d => label(d.data));

  cell.append('title').text(title);

  svg.node();

  // Save output and clear body
  writeFileSync(getOutputFilepath('sunburst.html'), dom.serialize());
  svg.remove();
}

function basicSunburstMe(dom: jsdom.JSDOM): void {
  // Types
  type SunburstLeaf = {
    name: string;
    size: number;
  };
  type SunburstBranch = {
    name: string;
    children: (SunburstBranch | SunburstLeaf)[];
  };

  const configs = [
    {
      input: 'interests-software.json',
      output: 'sunburst-interests-software.html',
      colorScheme: d3.interpolateViridis,
    },
    {
      input: 'interests-hobbies.json',
      output: 'sunburst-interests-hobbies.html',
      colorScheme: d3.interpolateRainbow,
    },
  ];

  for (const {input, output, colorScheme} of configs) {
    // Data
    const data: SunburstBranch = JSON.parse(
      readFileSync(getInputFilepath(input), {
        encoding: 'utf-8',
      })
    );

    // Dimensions
    const width = 1000; // outer width, in pixels
    const height = 1000; // outer height, in pixels
    const margin = {top: 1, right: 1, bottom: 1, left: 1};
    const fontSize = 12;

    // Geometry
    const padding = 1; // separation between arcs
    const startAngle = 0; // the starting angle for the sunburst
    const endAngle = 2 * Math.PI; // the ending angle for the sunburst
    const radius =
      Math.min(
        width - margin.left - margin.right,
        height - margin.top - margin.bottom
      ) / 2;
    const fill = 'rgba(0, 0, 0, 0)'; // fill for arcs (if no color encoding)
    const fillOpacity = 0.9; // fill opacity for arcs

    // Helpers
    const label = (d: SunburstLeaf) => d.name;
    const value = (d: SunburstLeaf) => d.size;
    const title = (n: d3.HierarchyNode<SunburstLeaf>) =>
      `${n
        .ancestors()
        .reverse()
        .map(d => d.data.name)
        .filter(n => n)
        .join(' . ')}`;

    // @ts-expect-error (Branch will have children, Leaf won't)
    const root = d3.hierarchy<SunburstLeaf>(data, d => d.children);
    root.sum(d => Math.max(0, value(d)));
    root.sort((a, b) => d3.descending(a.value, b.value));
    d3.partition<SunburstLeaf>().size([endAngle - startAngle, radius])(root);
    const color = d3
      .scaleSequential([0, root.children!.length], colorScheme)
      .unknown(fill);
    // @ts-expect-error (`d3.HierarchyNode<SunburstLeaf>` doesn't have `index`)
    root.children!.forEach((child, i) => (child.index = i));
    const arc = d3
      .arc<SunburstBranch, any>()
      .startAngle(d => d.x0 + startAngle)
      .endAngle(d => d.x1 + startAngle)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, (2 * padding) / radius))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - padding);

    // D3 Container
    const body = d3.select(dom.window.document.querySelector('body'));
    const svg = body
      .append('svg')
      .attr('viewBox', [
        margin.right - margin.left - width / 2,
        margin.bottom - margin.top - height / 2,
        width,
        height,
      ])
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .attr('font-family', 'sans-serif')
      .attr('font-size', fontSize)
      .attr('text-anchor', 'middle');

    const cell = svg.selectAll('a').data(root.descendants()).join('a');

    cell
      .append('path')
      // @ts-expect-error (idk)
      .attr('d', arc)
      .attr(
        'fill',
        // @ts-expect-error (`d3.HierarchyNode<SunburstLeaf>` doesn't have `index`)
        color ? d => color(d.ancestors().reverse()[1]?.index) : fill
      )
      .attr('fill-opacity', fillOpacity);

    cell
      .filter((d: any) => ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
      .append('text')
      .attr('transform', (d: any) => {
        if (!d.depth) return null;
        const x = (((d.x0 + d.x1) / 2 + startAngle) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('fill', 'white')
      .attr('dy', '0.32em')
      .text(d => label(d.data));

    cell.append('title').text(title);

    // Save output and clear body
    writeFileSync(getOutputFilepath(output), dom.serialize());
    svg.remove();
  }
}

// ---
// Run
// ---

main();
