var drag = d3.behavior.drag()
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

    drag.positions = [0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240];


function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
  var originalY = d3.select(this).attr("transform");
  console.log("transform", originalY);
  drag.dragItem = {};
  drag.dragItem.yPos = originalY.match(/translate\((.*), (.*)\)/);
  drag.dragItem.yPos = parseInt(drag.dragItem.yPos[2]);
  console.log("dragItem: ", drag.dragItem.yPos);
  // originalY = originalY.split(", ");
  // originalY = originalY[1].substring(0,2);
  // console.log(originalY);
  // d3.select(this).attr("data-original-y", originalY);
  // drag.originalY = originalY;
}

function dragged(d) {
  var originalYPos = drag.dragItem.yPos;
  var closest = null;

  var getClosestValues = function(a, x) {
    var lo, hi;
    for (var i = a.length; i--;) {
        if (a[i] <= x && (lo === undefined || lo < a[i])) lo = a[i];
        if (a[i] >= x && (hi === undefined || hi > a[i])) hi = a[i];
    };
    var snapTo = (Math.abs(x - lo) < Math.abs(x - hi)) ? lo : hi;
    return [lo, hi, snapTo];
}

  drag.closest = getClosestValues(drag.positions, d3.event.y);
  d3.select('.dragging').attr("transform", "translate(0, " + d3.event.y + ")");

  // $.each(drag.positions, function(){
  //   if (closest == null || Math.abs(this - d3.event.y) < Math.abs(closest - d3.event.y)) {
  //     closest = this;
  //   }
  // });

  console.log(drag.closest);
//   var originalY = parseInt(drag.originalY);
//   var draggedItem = d3.select('.dragging');
//   console.log("Dragged oy: ", originalY);
//   // var gElems = $('.shifts').find('g');
//   // console.log(d3.event);
//   draggedItem.attr("transform", "translate(0, " + d3.event.y + ")");
//   console.log("Eventy: ", d3.event.y);
//   if (d3.event.y > (originalY + 12)) {
//     console.log("greater difference than 24");
//     draggedItem.attr("transform", "translate(0, " + (originalY + 24) + ")");
//     $(".dragging").next().attr("transform", "translate(0, " + originalY + ")");
//     draggedItem.classed("dragging", false);
//     dragended();
//   }
//   if (d3.event.y < (originalY - 12)) {
//     console.log("lesser difference than 24");
//     draggedItem.attr("transform", "translate(0, " + (originalY - 24) + ")");
//     $(".dragging").prev().attr("transform", "translate(0, " + originalY + ")");
//     draggedItem.classed("dragging", false);
//     dragended(d);
//   }
}

function dragended(d) {
  var gElems = $(".dragging").siblings();
  var originalElemPos = drag.positions.indexOf(drag.dragItem.yPos);
  var newElemPos = drag.positions.indexOf(drag.closest[2]);
  console.log("original elem pos: ", originalElemPos)
  console.log("new elem pos: ", newElemPos);
  // var elemsToMove = [];

  // for (var i = Math.abs(originalElemPos) + 1; i < Math.abs(newElemPos); i++) {
  //     elemsToMove.push(i);
  // }

  var difference = function (a, b) { return Math.abs(a - b) }
  var elemsToMove = difference(originalElemPos, newElemPos);
  console.log(elemsToMove);



  // 4 - 1 [2,3]
  // 9 - 5 [6, 7, 8]
  // 6 - 5 [6]
  // 5 - 6 [5]
  // 1 - 0 [1]

  // if you're moving the element UP
  if (drag.dragItem.yPos > drag.closest[2]) {
    for (var i = 0; i < elemsToMove; i++) {
      var toMove = $('.dragging').parent().find("g:eq(" + (originalElemPos - (i + 1)) + ")");

      var originalYToMove = toMove.attr("transform");
      originalYToMove = originalYToMove.match(/translate\((.*), (.*)\)/);
      originalYToMove = parseInt(originalYToMove[2]);

      toMove.attr("transform", "translate(0, " + (originalYToMove + 24) + ")");
    }
    // get however many elements are in between yPos and drag.closest and move them all +24
  }
  // if you're moving the element DOWN
  else {
    for (var i = 0; i < elemsToMove; i++) {
      var toMove = $('.dragging').parent().find("g:eq(" + (originalElemPos + (i + 1)) + ")");

      var originalYToMove = toMove.attr("transform");
      originalYToMove = originalYToMove.match(/translate\((.*), (.*)\)/);
      originalYToMove = parseInt(originalYToMove[2]);

      toMove.attr("transform", "translate(0, " + (originalYToMove - 24) + ")");
    }
    // get however many elements are in between yPos and drag.closest and move them all -24
  }

  // var gToMove = $('.dragging').siblings("g[transform='translate(0, " + drag.closest[2] + ")']");
  // console.log(gToMove);
  // $(gToMove).attr("transform", "translate(0, " + drag.dragItem.yPos + ")");
  d3.select(this).attr("transform", "translate(0, " + drag.closest[2] + ")");
  d3.select(this).classed("dragging", false);
  drag.dragItem = {};
}

















  function Chart(margins, height, width, selector) {
    this.getMargins = function(margins) {
      if (typeof margins === "number") {
        return [margins, margins, margins, margins]
      }
      else if (margins instanceof Array) { return margins }
      else {
        console.log("Error: Chart margins should either be an integer or array of integers. You provided a " + typeof margins)
      }
    },
    this.margins = this.getMargins(margins),
    this.height = height - this.margins[0] - this.margins[2],
    this.width = width - this.margins[1] - this.margins[3],
    this.drawChartBase = function() {

      this.shotChart = d3.select(selector)

      // this.shotChart = svg.append("svg:g")
      // this.shotChart.attr("transform", "translate(" + this.margins[3] + "," + this.margins[0] + ")");
    },
    this.config = function(opts) {
      if (opts.scales) { this.setupScales(opts.scales); }
      if (opts.xAxis) { this.setupHorizontalAxis(opts.xAxis.tickValues, opts.xAxis.tickFormat, opts.xAxis.orient); }
      if (opts.yAxis) { this.setupVerticalAxis(opts.yAxis.tickValues, opts.yAxis.ticks, opts.yAxis.tickFormat, opts.yAxis.orient); }
    },

    /* Handle Axis & Scales */
    this.setupScales = function(axesScales) {
      var self = this;
      $.each(axesScales, function(i, axisData) {
        self[axisData.axis] = d3.scale[axisData.scaleType]().domain(axisData.domainVal)[axisData.rangeType](axisData.range);
      });
      self.axisContainer = this.shotChart.append('svg').attr('height',35).append('g').attr("width", width)
        .attr("height", 80).attr("transform", "translate(" + this.margins[3] + "," + this.margins[0] + ")");
    },
    this.setupHorizontalAxis = function(customTickVals, formatTicks, orientation) {
      var xAxis = d3.svg.axis().scale(this["x"]).orient(orientation).tickSubdivide(true)
          .tickValues(customTickVals)
          .tickFormat(formatTicks);

      this.axisContainer.append("svg:g")
            .attr("class", "x axis")
            .call(xAxis);

      this.axisContainer.selectAll(".x.axis .tick line")
          .attr("y1", -10)
          .attr("y2", -(this.height + 10))

    },
    this.setupVerticalAxis = function(customTickVals, tickCount, formatTicks, orientation) {
      var yAxis = d3.svg.axis().scale(this["y"]).orient(orientation).tickValues(customTickVals);

      this.axisContainer.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);
    }
    this.drawShifts = function(playerShift, shifts) {
      console.log(playerShift);
      var area = d3.svg.area()
        .interpolate("shifts")
        .x0(chart.width)
        .x1(0)
        .y0(function(d) { console.log(d); return 15; })
        .y1(function(d) { return 0; });

      // var areaData = [];
      // for (var i = 0; i < shifts.length; i++) {
      //   areaData.push({ "start_time": strength[i].start_time, "end_time": strength[i].end_time, "team": strength[i].advantage })
      // }

      $.each(shifts, function(i, d) {
        d3.select('.shift-area').append("rect")
          .datum(d)
          .attr("d", area)
          .attr("height", chart.height)
          .attr("x", chart.x(d.shift_start))
          .attr("width", chart.x(d.shift_end - d.shift_start))
          .attr("class", function(d) { return "area " + d.team });
      });
    }
  }





    var chart = new Chart([20,0,0,70], 800, 1000, "#shift-chart");
    chart.drawChartBase();
    var allPlayers = [];



  function getShiftData() {
    $.ajax({
      url: "http://localhost.nytimes.com:8000/shiftdata.json",
      success: function(shiftData) {
        $.each(shiftData, function(index, playerShift) {
          allPlayers.push(playerShift.player);
        });
        generateChart(allPlayers, shiftData);
      }
    });
  };

  setInterval(getShiftData, 2000);


  /* shot data, strength data */
  function generateChart(allPlayers, shiftData) {
    console.log("GENERATING");
    chart.config({
        "scales": [
          { "axis": "x", "range": [0, chart.width], "domainVal": [0, 3600], "scaleType": "linear", "rangeType": "range" },
          { "axis": "y", "domainVal": allPlayers, "range": [chart.height, 0], "rangeType": "rangeBands", "scaleType": "ordinal" }
        ],
        "xAxis": {
          "tickValues": [0, 1200, 2400, 3600],
          "orient": "top",
          "tickFormat": function(d) {
              if (d === 0) { return "1st" }
              else if (d === 1200) { return "2nd" }
              else if (d === 2400) { return "3rd" }
              else if (d === 3600) { return "End" }
            }
        }
        // "yAxis": {
        //   "orient": "left",
        //   "tickValues": allPlayers,
        //   "tickFormat": function(d, i) {
        //     console.log(d.player);
        //     console.log(i);
        //     return d.player;
        //   }
        // }
      });


      chart.shotChart.append("ul").attr('class', 'shifts').attr("x", 80).attr("y", 80).attr("width", chart.width).attr("height", chart.height);



    $.each(shiftData, function(index, playerShift) {
      var shiftLi = d3.select('.shifts').append("li")
      shiftLi.append('p').text(function() { return playerShift.number + " " + playerShift.player; }).attr('width', 100).attr('height', 20).attr('x',0).attr('y',0);
      shiftLi.append('svg').attr("width", chart.width).attr("height", chart.y.rangeBand() - 2).attr("x", 100).attr("transform", "translate(100, " + chart.y.rangeBand() * index + ")").attr('class', 'player-shift').attr('id', playerShift.player).selectAll("rect")
        .data(playerShift.shifts).enter().append('rect')
        .attr("height", chart.y.rangeBand() - 2)
        .attr("x", function(d, i) { return chart.x(d.shift_start); })
        .attr("y", 0)
        .attr("width", function(d, i) { return chart.x(d.shift_end - d.shift_start); })
        .attr("class", function(d, i) { var goal = (d.goals > 0) ? " goal" : ""; return "shift " + playerShift.team + goal; })

    });

    $("ul.shifts").sortable();

    // d3.selectAll('.player-shift').call(drag)
// d3.select("input").on("change", change);
// var sortTimeout = setTimeout(function() {
//     d3.select("input").property("checked", true).each(change);
//   }, 2000);

// function change() {
//     clearTimeout(sortTimeout);

//     // Copy-on-write since tweens are evaluated after a delay.

//     (this.checked) ? window.allPlayers = window.allPlayers.sort() : window.allPlayers = window.allPlayers.sort().reverse();
//     chart.y = d3.scale.ordinal().domain(window.allPlayers).rangeBands([chart.height, 0]);

//     var transition = chart.shotChart.transition().duration(750),
//         delay = function(d, i) { return i * 50; };



//     transition.selectAll(".player-shift")
//         .delay(delay)
//         .attr("transform", function(d, i) { return "translate(0, " + (chart.y.rangeBand() * i) + ")" });

//     chart.setupVerticalAxis(window.allPlayers, null, null, "left")
//     transition.select(".y.axis")
//       .selectAll("g")
//         .delay(delay);
//   }


  };
