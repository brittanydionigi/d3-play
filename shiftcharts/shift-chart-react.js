var Shift = React.createClass({
  displayName: "Shift",
  render: function() {
    return React.DOM.rect({ height: "18", className: "shift " + this.props.team + " " + this.props.shiftGoals, width: this.props.rectWidth, x: this.props.xPosition }, '');
  }
});

var PlayerShift = React.createClass({
  displayName: "PlayerShifts",
  handlePlayerClick: function() {
    var playerDetails = PlayerDetails({
      player: this.props.player
    });
    React.renderComponent(playerDetails, document.getElementById('player-details'));
  },
  render: function() {
    var self = this;
    var playersShifts = this.props.shifts.map(function(shift, index) {
      var shift = Shift({
        "shiftGoals": shift.event,
        "key": shift.shift_start,
        "team": self.props.team,
        "shiftNumber": index,
        "rectWidth": ((shift.shift_end - shift.shift_start) / 3600) * 1600,
        "xPosition": (shift.shift_start / 3600) * 1600
      });

      return shift;
    })
    return React.DOM.li({ key: this.props.player }, React.DOM.p({ onClick: this.handlePlayerClick, className: this.props.position + '-fense' }, this.props.number + " " + this.props.player), React.DOM.svg({ className: "player-shift", width: "930", height: "18"}, playersShifts))
  }
});

var PlayerShiftList = React.createClass({
  displayName: "PlayerShiftList",
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.getShiftData();
    // setInterval(this.getShiftData, this.props.pollInterval);
  },
  getDefaultProps: function() {
    return {
      pollInterval: 10000
    };
  },
  getShiftData: function() {
    // $.ajax({
    //   url: "http://localhost.nytimes.com:8000/shiftdata.json",
    //   success: function(data) {
    //     console.log("SUCCESS: ", data);
        this.setState({data: window.shiftdata});
    //   }.bind(this)
    // });
  },
  componentDidMount: function() {
    var listNode = this.getDOMNode();
    // $(listNode).sortable();
  },
  render: function() {

    var playerShifts = this.state.data.map(function(playerShift, index) {
      var playerShift = PlayerShift({
        "player": playerShift.player,
        "number": playerShift.number,
        "position": playerShift.position,
        "team": playerShift.team,
        "shifts": playerShift.shifts,
        "key": playerShift.player
      });
      return playerShift;
    })

    return React.DOM.ul({className: "shifts"}, playerShifts);
  }
});

var Chart = React.createClass({
  displayName: "ShiftChart",
  getDefaultProps: function() {
    return {
      height: 800,
      width: 1600
    };
  },
  render: function() {
    var self = this;
    var timelineAxis = React.DOM.svg({ height: "35", width: this.props.width }, "TimeLine");
    var shiftList = PlayerShiftList();
    return React.DOM.div({ id: this.props.id, height: this.props.height, width: this.props.width }, timelineAxis, shiftList, StrengthAreas());
  }
});



  var StrengthAreas = React.createClass({
    render: function() {
      return React.DOM.svg({ className: "strength" }, React.DOM.rect({ width: "100", height: "400", x: "150" }));
    }
  });



// var AddPlayerForm = React.createClass({

// });

// var SortPlayersForm = React.createClass({

// });

  var PlayerDetails = React.createClass({
    render: function() {
      return React.DOM.div("<p>Player Details: </p><span>" + this.props.player + "</span>")
      //return React.DOM.p({ className: "player-player" }, "Player name: ", React.DOM.span({}, this.props.player), React.DOM.div({}, "Most Frequent Opponents: " + opponents))
    }
  });



var shiftChart = Chart({
  id: "shift-chart"
});

React.renderComponent(shiftChart, document.getElementById('wrapper'));



var allPlayerShifts = {};

function getAllShifts(playerShifts) {
    var totalShifts = [];
    _.each(playerShifts, function (shift) {
        var shifts = _.range(shift.shift_start, shift.shift_end + 1);
        totalShifts = totalShifts.concat(shifts);
    });
    return totalShifts;
};

_.each(window.shiftdata, function (playerShift, index) {
    allPlayerShifts[playerShift.player] = getAllShifts(playerShift.shifts);
});

function getOverlaps(playerToExamine) {
    _.each(allPlayerShifts, function (playerShifts, playa) {
        if (playa !== playerToExamine) {
            var overlap = _.intersection(allPlayerShifts[playerToExamine], playerShifts);
            console.log("Overlap for " + playerToExamine + " with " + playa + ": ", overlap);
        }
    });
}

// getOverlaps("Joe");

_.each(window.shiftdata, function(playerShifts, index) {
  getOverlaps(playerShifts.player);
});



// at every second of the game, get the defensive line & offensive line. if a D person switches out,
// add a new defensive line. if an offensive person switches out, add a new offensive line

