
    $(document).ready(function(){
        $(".close-info").on("click",function(){
          $(".infopanel-wrapper").css("display","none");
          $(".infopanel-overlay").css("display","none");
        })
      })
  
      //******************
      // Responsive setup
      //******************
  
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  
      var mobile = false;
      var medium = false;
      var small = false;
      var iphone = false;
      var safari = false;
  
      $(window).resize(function () {
        if (windowWidth != $(window).width() || windowHeight != $(window).height()) {
          location.reload();
          return;
        }
      });
  
  
      if (viewportWidth < 800 && viewportWidth >= 600) {
        medium = true;
      }
  
      if (viewportWidth < 600) {
        small = true;
      }
  
      if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || viewportWidth < 600) {
        mobile = true;
      }
  
  
      if (/iPhone/i.test(navigator.userAgent)) {
        iphone = true;
      }
  
      //if Safari
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) { // Chrome
        } else { // Safari
          safari = true;
        }
      }
  
      if (viewportWidth < 700) {
        $("#instruction").css("display", "none");
      } else {
        $("#instruction").css("display", "inherit");
      }
  
      var legendShow = false;
  
      //**********
      // Map setup
      //**********
  
      mapboxgl.accessToken = 'pk.eyJ1IjoiamhqYW5pY2tpIiwiYSI6Il9vb1ZlWnMifQ.zJie3Sr8zh3h5rR8IBMB2A';
  
      var map;
      var popup;
  
      // status
      var geoJsonData = {
        'type': 'FeatureCollection',
        'features': []
      };
  
      if (mobile) {
  
        map = new mapboxgl.Map({
          container: 'map', // container element id
          style: 'mapbox://styles/jhjanicki/ckkpmqel915iq17s1fkmhgyby',
          center: [78.217997, 24.403233], // initial map center in [lon, lat]
          zoom: 2,
          minZoom: 2
        });
  
      } else {
  
        map = new mapboxgl.Map({
          container: 'map', // container element id
          style: 'mapbox://styles/jhjanicki/ckkpmqel915iq17s1fkmhgyby',
          center: [78.217997, 24.403233], // initial map center in [lon, lat]
          zoom: 3,
          minZoom: 2
        });
  
      }
  
  
      function addLayer(layer1, layer2, layercolor, source) {
  
        map.addSource(layer1, {
          type: 'geojson',
          data: source
        });
  
        map.addLayer({
          'id': layer1,
          'type': 'line',
          'source': layer1,
          'paint': {
            'line-color': layercolor,
            'line-opacity': 0,
            'line-width': 1
          }
        });
  
        map.addLayer({
          'id': layer2,
          'type': 'fill',
          'source': layer1,
          'paint': {
            'fill-color': layercolor,
            'fill-opacity': 0
          }
        });
  
  
      }
  
      map.on('load', function () {
  
        init(); // test google sheet
        $("#toggleConsole").click(function () {
          $("#console").toggleClass("active");
          $("#toggleConsole img").toggleClass("flip");
        });
  
        $("#toggleConsole2").click(function () {
          $("#chart").toggleClass("active2");
          $("#toggleConsole2 img").toggleClass("flip");
        });
  
        $("#toggleConsole").css("top", 210);
        $("#toggleConsole2").css("top", 110);
  
        if (medium) {
          $("#toggleConsole").css("top", 220);
          $("#profile").css("left", 260);
        }
  
        if(small){
          $("#profile").css("left", 260);
        }
        if (mobile) {
          $("#toggleConsole").css("top", 210);
          $("#profile").css("left", '50%');
          $("#profile").css("top", '50%');
          $("#profile").css("transform", 'translateX(-50%) translateY(-50%)');
        }
  
        addLayer('aonyx', 'aonyx2', '#80BA5A', './data/aonyx.geojson');
        addLayer('lutra', 'lutra2', '#008695', './data/lutra.geojson');
        addLayer('lutra3', 'lutra4', '#3969AC', './data/lutra2.geojson');
        addLayer('lutrogale', 'lutrogale2', '#F2B701', './data/lutrogale.geojson');
  
      });
  
  
      if (!mobile) {
        map.addControl(new mapboxgl.NavigationControl());
      }
  
      //*****************
      // Global variables
      //*****************
  
      var activeSpecies = ['Aonyx cinereus', 'Lutra lutra', 'Lutra sumatrana', 'Lutrogale perspicillata', 'Multiple', 'Unsure', 'Not identified']
      var activeUse = ['Skin', 'Tail', 'Pet', 'Piece', 'Carcass', 'Unknown', 'Many']
  
      var allSpecies = ['Aonyx cinereus', 'Lutra lutra', 'Lutra sumatrana', 'Lutrogale perspicillata', 'Multiple', 'Unsure', 'Not identified']
      var allUse = ['Skin', 'Tail', 'Pet', 'Piece', 'Carcass', 'Unknown', 'Many']
  
      var min = 10;
      var max = 10;
      var yearMin = 2000;
      var yearMax = 2000;
      var minCircleSize = 5;
      var maxCircleSize = 30;
  
      var tab1 = true;
  
  
  
      //**********
      // Read data
      //**********
  
      function init() {
  
        $('#loading').hide();
  
        data.forEach(function (row) {
  
          // to deal with null lat lon values
          var lat;
          var lon;
          var sum;
  
          if (row.Longitude == null || row.Longitude == '' || row.Latitude == null || row.Latitude == '') {
            //console.log(row)
            lon = null;
            lat = null;
          } else {
            lon = +row.Longitude;
            lat = +row.Latitude;
          }
  
          // to deal with null lat lon values
  
          if (row.Sum == '' || row.Sum == null || row.Sum == '') {
  
          } else {
            if (+row.Sum < min) {
              min = +row.Sum;
            }
            if (+row.Sum > max) {
              max = +row.Sum;
            }
          }
  
          if (row.Year == '' || row.Year == null || row.Year == '') {
  
          } else {
            if (+row.Year < yearMin) {
              yearMin = +row.Year;
            }
            if (+row.Year > yearMax) {
              yearMax = +row.Year;
            }
          }
  
          if (isNaN(+row.Sum)) {
            sum = null;
          } else {
            sum = +row.Sum;
          }
  
  
          var feature = {
            'type': 'Feature',
            'properties': {
              'longitude': lon,
              'latitude': lat,
              'year': +row.Year,
              'country': row.Seizure_Country,
              'location': row.Seizure_Location,
              'countryCentroidBool': +row.Country_centroid,
              'dead': +row.Dead,
              'live': +row.Live,
              'sum': sum,
              'species': row.Species,
              'species1': row.Species1,
              'speciesDetail': row.Species_Detail,
              'use': row.Use,
              'useDetail': row.use_Detail,
              'source': row.Source,
              'Lutra_lutra': +row.Lutra_lutra,
              'Not_identified': +row.Not_identified,
              'Unsure': +row.Unsure,
              'Multiple': +row.Multiple,
              'Aonyx_cinereus': +row.Aonyx_cinereus,
              'Lutrogale_perspicillata': +row.Lutrogale_perspicillata,
              'Skin': +row.Skin,
              'Tail': +row.Tail,
              'Pet': +row.Pet,
              'Unknown': +row.Unknown,
              'Piece': +row.Piece,
              'Many': +row.Many,
              'Carcass': +row.Carcass
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [+row.Longitude, +row.Latitude],
            }
          };
  
  
          if (lon != null && lat != null && !isNaN(lon) && !isNaN(lat)) {
            geoJsonData['features'].push(feature);
          }
  
        });
  
        //*****************************
        // Map related global variables
        //*****************************
  
        var speciesFilter = ["in", ["get", "species"], ["literal", activeSpecies]];
        var useFilter = ["in", ["get", "use"], ["literal", activeUse]];
        var yearFilter = ["<=", ["get", "year"], yearMax];
  
        $("#minCircleVal").html(`${min}`);
        $("#maxCircleVal").html(`${max}`);
  
        $("#start").html(yearMin);
        $("#end").html(yearMax);
  
        $('#slider').prop('min', yearMin);
        $('#slider').prop('max', yearMax);
        $('#slider').prop('value', yearMax);
  
        var sliderValG = $("#slider").val();
        sliderValG = parseInt(sliderValG)
  
        var cumulative = true;
        var speciesMode = true;
  
        //*************
        // Draw circles
        //*************
  
  
        map.addLayer({
          id: 'otters',
          type: 'circle',
          source: {
            type: 'geojson',
            data: geoJsonData
          },
          paint: {
            "circle-color": [
              "case",
              ["==", ["get", "species"], 'Aonyx cinereus'],
              "#80BA5A",
              ["==", ["get", "species"], 'Lutra lutra'],
              "#008695",
              ["==", ["get", "species"], 'Lutra sumatrana'],
              '#3969AC',
              ["==", ["get", "species"], 'Lutrogale perspicillata'],
              '#F2B701',
              ["==", ["get", "species"], 'Multiple'],
              '#CF1C90',
              ["==", ["get", "species"], 'Unsure'],
              "#A5AA99",
              "#f97b72"
            ],
            'circle-radius': [
              'interpolate',
              ["linear"],
              ['get', 'sum'],
              min,
              minCircleSize,
              max,
              maxCircleSize
            ],
            'circle-opacity': 0.7,
            'circle-stroke-color': '#000',
            'circle-stroke-width': 0.5
          }
        });
  
        map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
  
        //***********
        // SVG setup
        //***********
  
        var width = 750,
          height = 230,
          margin = {
            top: 50,
            right: 40,
            bottom: 20,
            left: 40
          };
  
        if (medium){
          width = 600;
        }
  
  
        if(!small && !mobile){
          var svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);
        } else{
          $("#reset3").css("display","none");
          $("#reset3Text").css("display","none");
          $("#toggleConsole2").css("display","none");
        }
        
  
  
        //*****************************
        // Prepare data for stacked bar
        //*****************************
  
        var parser = d3.timeParse("%Y")
  
        data.forEach(function (d) {
          d.Sum = +d.Sum;
          d.Year = +d.Year;
          d.Lutra_lutra = +d.Lutra_lutra;
          d.Not_identified = +d.Not_identified;
          d.Unsure = +d.Unsure;
          d.Multiple = +d.Multiple;
          d.Aonyx_cinereus = +d.Aonyx_cinereus;
          d.Lutrogale_perspicillata = +d.Lutrogale_perspicillata;
          d.Lutra_sumatrana = +d.Lutra_sumatrana;
          d.Skin = +d.Skin,
            d.Tail = +d.Tail,
            d.Pet = +d.Pet,
            d.Unknown = +d.Unknown,
            d.Piece = +d.Piece,
            d.Many = +d.Many,
            d.Carcass = +d.Carcass,
            d.Latitude = +d.Latitude;
          d.Longitude = +d.Longitude;
          d['date'] = parser(d.Year)
        })
  
        var dataGrouped = _.chain(data)
          .groupBy("Year")
          // `key` is group's name (color), `value` is the array of objects
          .map((value, key) => ({
            id: key, //year
            total: _.sumBy(value, "Sum"),
            array: value
          }))
          .value()
  
        data.sort(function (a, b) {
          return a.Year - b.Year;
        });
  
  
  
  
        //*********************************************************
        // function to draw rects. called by slider and filter year
        //*********************************************************
  
        function drawRects(year, cumul) {
  
          if (tab1) { // if spp tab
  
            if (cumul) {
              d3.selectAll('rect').attr('fill', function (el) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(color(el.data.Species1));
                svg.call(texture);
                if (el.data.Year <= year) {
                  return texture.url()
                } else {
                  return color(el.data.Species1)
                }
              });
  
            } else {
  
              d3.selectAll('rect').attr('fill', el => color(el.data.Species1)); //reset all rect colors
              d3.selectAll('rect').attr('fill', function (el) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(color(el.data.Species1));
                svg.call(texture);
                if (el.data.Year == year) {
                  return texture.url()
                } else {
                  return color(el.data.Species1)
                }
              });
            }
  
          } else { // if use tab
  
            if (cumul) {
              d3.selectAll('rect').attr('fill', function (el) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(colorUse(el.data.Use));
                svg.call(texture);
                if (el.data.Year <= year) {
                  return texture.url()
                } else {
                  return colorUse(el.data.Use)
                }
              });
  
            } else {
  
              d3.selectAll('rect').attr('fill', el => colorUse(el.data.Use)); //reset all rect colors
              d3.selectAll('rect').attr('fill', function (el) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(colorUse(el.data.Use));
                svg.call(texture);
                if (el.data.Year == year) {
                  return texture.url()
                } else {
                  return colorUse(el.data.Use)
                }
              });
            }
  
  
          }
  
        }
  
  
        //*************
        // Timer setup
        //*************
  
        var myTimer;
        d3.select("#play").on("click", function () {
  
          clearInterval(myTimer);
          myTimer = setInterval(function () {
            var b = d3.select("#slider");
            var t = (+b.property("value") + 1) % (+b.property("max") + 1);
            if (t == 0) { t = +b.property("min"); }
            b.property("value", t);
            $("#slider").val(t);
            $("#slider").trigger('change');
            sliderValG = t;
  
            if (cumulative) {
              yearFilter = ['<=', ['get', 'year'], t];
              if(!small && !mobile){drawRects(t, true);}
  
            } else {
              yearFilter = ["==", ["get", "year"], t];
              d3.selectAll('rect').attr('fill', el => color(el.data.Species1));//reset all rect colors
              if(!small && !mobile){drawRects(t, false);}
  
            }
            map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
            document.getElementById('selectedYear').innerText = t;
          }, 200);
        });
  
        d3.select("#stop").on("click", function () {
          clearInterval(myTimer);
        });
  
        //******************
        // Filter year setup
        //******************
  
  
        document.getElementById("filterYear").addEventListener('change', function (e) {
          if (e.target.value == "cumulative_on") {
            cumulative = true;
            //d3.select("#clickInstruction").style("opacity",1);
            yearFilter = ['<=', ['get', 'year'], sliderValG];
            d3.selectAll('rect').attr('fill', el => color(el.data.Species1));//reset all rect colors
            if(!small && !mobile){drawRects(sliderValG, true);}
  
          } else {
            cumulative = false;
            //d3.select("#clickInstruction").style("opacity",0);
            yearFilter = ["==", ["get", "year"], sliderValG];
            d3.selectAll('rect').attr('fill', el => color(el.data.Species1));//reset all rect colors
            if(!small && !mobile){drawRects(sliderValG, false);}
  
          }
          map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
        });
  
  
        //**************
        // Slider setup
        //**************
  
        document.getElementById('slider').addEventListener('input', function (e) {
          d3.selectAll('rect').attr('fill', el => color(el.data.Species1));
          //reset all rect colors
  
          var sliderVal = +e.target.value;
          sliderValG = sliderVal;
  
          //below is redundant in many parts, put in own function
          if (cumulative) {
            yearFilter = ['<=', ['get', 'year'], sliderVal];
            if(!small && !mobile){drawRects(sliderValG, true);}
          } else {
            yearFilter = ["==", ["get", "year"], sliderVal];
            d3.selectAll('rect').attr('fill', el => color(el.data.Species1));//reset all rect colors
            if(!small && !mobile){drawRects(sliderValG, false);}
          }
          document.getElementById('selectedYear').innerText = sliderVal;
  
          map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
        }); //end slider input
  
        if(!small && !mobile){
  
         //******************
        // Prepare D3 scales
        //******************
  
  
        var xScale = d3.scaleTime().domain([parser(1980), parser(2020)]).range([margin.left, width - margin.right]);
        //d3.extent(sppData, d => d.date)
        var yScale = d3.scaleLinear().domain([0, 778]).range([height - margin.bottom, margin.top])
        //d3.max(dataGrouped, d=>d.total)
  
  
  
        //**************
        // Setup D3 axes
        //**************
  
        var xAxis = svg.append("g").attr("class", "x-axis")
          .attr("transform", `translate(0, ${height - margin.bottom} )`)
          .call(d3.axisBottom(xScale))
  
        var yAxis = svg.append("g").attr("class", "y-axis")
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(yScale));
  
        //**************
        // Setup D3 rect
        //**************
            var stack = d3.stack()
              .keys(["Lutra_lutra", "Not_identified", "Unsure", "Multiple", "Aonyx_cinereus", "Lutrogale_perspicillata", "Lutra_sumatrana"])
  
            var stackUse = d3.stack()
              .keys(["Pet", "Tail", "Many", "Unknown", "Carcass", "Skin", "Piece"]);
  
            var series = stack(data);
            var seriesUse = stackUse(data);
  
            var arr1 = series[0];
  
            arr1.filter(function (d) {
              return (d[0] != 0) && (d[1] != 0)
            });
            // WHY IS THIS NOT WORKING????
  
  
            var xScaleBar = d3.scaleBand().domain(data.map(function (d) {
              return d.date;
            }))
              .range([margin.left, width - margin.right])
              .padding(0.1);
  
            var color = d3.scaleOrdinal().domain(["Lutra_lutra", "Not_identified", "Unsure", "Multiple", "Aonyx_cinereus", "Lutrogale_perspicillata", "Lutra_sumatrana"])
              .range(["#008695", "#f97b72", "#A5AA99", "#CF1C90", "#80BA5A", "#F2B701", "#3969AC"]);
  
            var colorUse = d3.scaleOrdinal().domain(["Tail", "Many", "Unknown", "Carcass", "Skin", "Piece", "Pet"])
              .range(["#008695", "#f97b72", "#A5AA99", "#CF1C90", "#80BA5A", "#F2B701", "#3969AC"]);
  
            // Create groups for each series, rects for each segment
            var groups = svg.selectAll("g.spp")
              .data(series)
              .join("g")
              .attr("class", "spp")
  
            var rect = groups.selectAll("rect")
              .data(d => d)
              .join("rect")
              .attr("class", d => `${d.data.Species1} year${d.data.Year}`)
              .attr("y", d => yScale(d[1]))
              .attr("x", (d, i) => xScale(d.data.date))
              .attr("width", medium?10:15)
              .attr("stroke", "black")
              .attr("stroke-width", 0.4)
              .attr("fill", function (d) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(color(d.data.Species1));
                svg.call(texture);
                return texture.url();
              })
              .attr("id", function (d, i) {
                return d.data.Species1 + "_" + i + "_" + d.data.Year
              })
              .attr("height", d => yScale(d[0]) - yScale(d[1]))
        }
  
  
        function updateStackedBar() {
          if (tab1) { //if species
  
            groups = svg.selectAll("g.spp")
              .data(series)
              .join("g")
              .attr("class", "spp")
  
            rect = groups.selectAll("rect")
              .data(d => d)
              .join("rect")
              .attr("class", d => `${d.data.Species1} year${d.data.Year}`)
              .attr("y", d => yScale(d[1]))
              .attr("x", (d, i) => xScale(d.data.date))
              .attr("width", 15)
              .attr("stroke", "black")
              .attr("stroke-width", 0.3)
              .attr("fill", function (d) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(color(d.data.Species1));
                svg.call(texture);
                return texture.url();
              })
              .attr("id", function (d, i) {
                return d.data.Species1 + "_" + i + "_" + d.data.Year
              })
              .attr("height", d => yScale(d[0]) - yScale(d[1]));
  
          } else { //if use
  
            groups = svg.selectAll("g.spp").data(seriesUse).join("g").attr("class", "spp")
  
            rect = groups.selectAll("rect")
              .data(d => d)
              .join("rect")
              .attr("class", d => `${d.data.Use} year${d.data.Year}`)
              .attr("y", d => yScale(d[1]))
              .attr("x", (d, i) => xScale(d.data.date))
              .attr("width", 15)
              .attr("stroke", "black")
              .attr("stroke-width", 0.3)
              .attr("fill", function (d) {
                var texture = textures
                  .lines()
                  .size(4)
                  .strokeWidth(1.5)
                  .stroke(colorUse(d.data.Use));
                svg.call(texture);
                return texture.url();
              })
              .attr("id", function (d, i) {
                return d.data.Use + "_" + i + "_" + d.data.Year
              })
              .attr("height", d => yScale(d[0]) - yScale(d[1]));
          }
        }
  
  
  
        //redraw doesn't work across modes (species vs use)
        function redraw(newdata) {
          // update the y scale
          yScale.domain([0, d3.max(newdata, d => d.Sum)]);
          svg.select(".y-axis")
            .transition().duration(1000)
            .call(d3.axisLeft(yScale));
  
          groups = d3.selectAll("g.spp")
            .data(stack(newdata))
            .join("g")
            .attr("class", "spp");
  
          //below have not been updated
  
          if (tab1) {
  
            rect = groups.selectAll("rect")
              .data(d => d)
              .join('rect')
              .attr("height", d => yScale(d[0]) - yScale(d[1]))
              .attr("class", d => `${d.data.Species1} year${d.data.Year}`)
              .attr("y", d => yScale(d[1]))
              .attr("x", (d, i) => xScale(d.data.date))
              .attr("width", 15)
              .attr("stroke", "black")
              .attr("stroke-width", 0.3)
              .attr("fill", function (d) {
                if (cumulative) {
                  var texture = textures
                    .lines()
                    .size(4)
                    .strokeWidth(1.5)
                    .stroke(color(d.data.Species1));
                  svg.call(texture);
                  if (d.data.Year <= sliderValG) { return texture.url() }
                  else {
                    return color(d.data.Species1)
                  }
                } else {
                  var texture = textures
                    .lines()
                    .size(4)
                    .strokeWidth(1.5)
                    .stroke(color(d.data.Species1));
                  svg.call(texture);
                  if (d.data.Year == sliderValG) { return texture.url() }
                  else {
                    return color(d.data.Species1)
                  }
                }
              })
              .attr("id", function (d, i) {
                return d.data.Species1 + "_" + i + "_" + d.data.Year
              })
              // .on('mouseover', function (d) {
              //   var id = this.id;
              //   var year = id.substr(id.length - 4);
              //   if (cumulative) {
              //     $(`*[id$=${year}]`).css("cursor", "pointer");
              //     $(`*[id$=${year}]`).css("stroke-width", 1.2);
              //   }
              // })
              // .on('mouseout', function (d) {
              //   $(".spp rect").css("stroke-width", 0.3);
              // })
              // .on('click', clicked); //clicked on working
  
          } else {
  
            rect = groups.selectAll("rect")
              .data(d => d)
              .join('rect')
              .attr("height", d => yScale(d[0]) - yScale(d[1]))
              .attr("class", d => `${d.data.Use} year${d.data.Year}`)
              .attr("y", d => yScale(d[1]))
              .attr("x", (d, i) => xScale(d.data.date))
              .attr("width", 15)
              .attr("stroke", "black")
              .attr("stroke-width", 0.3)
              .attr("fill", function (d) {
                if (cumulative) {
                  var texture = textures
                    .lines()
                    .size(4)
                    .strokeWidth(1.5)
                    .stroke(colorUse(d.data.Use));
                  svg.call(texture);
                  if (d.data.Year <= sliderValG) { return texture.url() }
                  else {
                    return colorUse(d.data.Use)
                  }
                } else {
                  var texture = textures
                    .lines()
                    .size(4)
                    .strokeWidth(1.5)
                    .stroke(colorUse(d.data.Use));
                  svg.call(texture);
                  if (d.data.Year == sliderValG) { return texture.url() }
                  else {
                    return colorUse(d.data.Use)
                  }
                }
              })
              .attr("id", function (d, i) {
                return d.data.Use + "_" + i + "_" + d.data.Year
              })
          }
  
        }
  
  
        //******************
        //setup spp profiles
        //*******************
  
        function openSppProfile(profileid) {
  
          $(profileid).click(function () {
            var lastChar = parseInt(profileid.substr(profileid.length - 1));
            var obj = profilesData.filter(d => d.id === lastChar);
            $("#profileSpp").html(obj[0].name);
            $("#profileSpp2").html(obj[0].species);
            $("#profileImg").attr("src", obj[0].img);
            $("#profileCredit").html(obj[0].credit);
            $("#profileStatus").html(obj[0].status);
            $("#profileTrade").html(obj[0].trade);
            d3.select("#profile").transition().duration(200).style("display", "inherit").style("opacity", 1);
          });
        }
  
        $("#close").click(function () {
          d3.select("#profile").style("display", "none").style("opacity", 0);
        })
  
        openSppProfile("#open1");
        openSppProfile("#open2");
        openSppProfile("#open3");
        openSppProfile("#open4");
  
  
        //*********************
        //setup spp range maps
        //*********************
  
        var pathsClose = [`M10.2,10.8c1.7,0,3-1.3,3-3c0,0,0,0,0,0L10.2,10.8C10.2,10.8,10.2,10.8,10.2,10.8z`,
          `M3.8,11.9l1.4-1.4C4.1,9.8,3.1,8.9,2.3,7.8c1.8-2.5,4.8-4,7.9-4c0.5,0,1,0.1,1.6,0.1l1.7-1.7c-1-0.3-2.1-0.5-3.2-0.5
                  c-4.1,0-7.9,2.1-9.9,5.5c-0.2,0.3-0.2,0.7,0,1C1.2,9.8,2.4,11,3.8,11.9z`,
          `M20.1,7.3C19.3,6,18.2,4.9,17,4l-1.4,1.4C16.5,6,17.3,6.8,18,7.8c-1.7,2.5-4.6,4-7.8,4c-0.3,0-0.6,0-1-0.1l-1.7,1.7
                    c0.9,0.2,1.8,0.3,2.7,0.3c4.1,0,7.8-2.1,9.9-5.5C20.3,8,20.3,7.6,20.1,7.3z`,
          `M10.2,4.8c-0.6,0-1,0.4-1,1c0,0.2,0.1,0.4,0.2,0.5l1.5-1.5C10.6,4.8,10.4,4.8,10.2,4.8z`,
          `M8.2,6.8c-0.6,0-1,0.4-1,1c0,0.2,0,0.4,0.1,0.6l1.5-1.5C8.6,6.9,8.4,6.8,8.2,6.8z`];
  
        var pathClose = `M3.8,15.7c-0.3,0-0.6-0.1-0.8-0.3c-0.2-0.2-0.4-0.5-0.3-0.9c0-0.3,0.1-0.6,0.4-0.8l13-13c0.2-0.2,0.5-0.3,0.8-0.3
                  s0.6,0.1,0.8,0.3c0.5,0.5,0.5,1.2,0,1.7l-13,13C4.4,15.6,4.1,15.7,3.8,15.7z`;
  
        var pathOpen = `M0.3,7.3c2-3.4,5.8-5.5,9.9-5.5s7.8,2.1,9.9,5.5c0.2,0.3,0.2,0.7,0,1c-2.1,3.4-5.8,5.5-9.9,5.5s-7.9-2.1-9.9-5.5
                    C0.1,8,0.1,7.6,0.3,7.3z M10.2,11.8c3.2,0,6.1-1.5,7.8-4c-1.8-2.5-4.7-4-7.8-4s-6.1,1.5-7.9,4C4.1,10.3,7,11.8,10.2,11.8z M7.2,7.8
                    c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1s0.4,1,1,1s1-0.4,1-1s-0.4-1-1-1s-1-0.4-1-1s0.4-1,1-1c1.7,0,3,1.3,3,3s-1.3,3-3,3S7.2,9.5,7.2,7.8
                    z`;
  
        var aonyx = false;
        var lutra = false;
        var lutra2 = false;
        var lutrogale = false;
  
        function addRangeToggle(pathId, layer1, layer2, idcount, onOff) {
  
          var pathCloseG = d3.select(pathId).append("g");
  
          d3.select(`svg${pathId}`).append("path").attr("id", `single${idcount}`).attr("d", pathClose)
          pathCloseG.selectAll(`path.grouped${idcount}`).data(pathsClose).join("path").attr("class", `grouped${idcount}`).attr("d", d => d);
  
          $(pathId).click(function () {
            if (onOff) {
              onOff = false;
              map.setPaintProperty(layer1, 'line-opacity', 0);
              map.setPaintProperty(layer2, 'fill-opacity', 0);
              //d3.select("#add1 path").remove();
              pathCloseG.selectAll(`path.grouped${idcount}`).data(pathsClose).join("path").attr("class", `grouped${idcount}`).attr("d", d => d);
              d3.select(`${pathId} path#single${idcount}`).join().transition().duration(300).attr("d", pathClose);
  
  
            } else {
              onOff = true;
              map.setPaintProperty(layer1, 'line-opacity', 0.7);
              map.setPaintProperty(layer2, 'fill-opacity', 0.3);
              pathCloseG.selectAll(`path.grouped${idcount}`).remove();
              d3.select(`${pathId} path#single${idcount}`).join().transition().duration(300).attr("d", pathOpen);
  
            }
          });
        }
  
        addRangeToggle('#add1', 'aonyx', 'aonyx2', 1, aonyx);
        addRangeToggle('#add2', 'lutra', 'lutra2', 2, lutra);
        addRangeToggle('#add3', 'lutra3', 'lutra4', 3, lutra2);
        addRangeToggle('#add4', 'lutrogale', 'lutrogale2', 4, lutrogale);
  
  
  
  
  
        function createFilterSpecies(filterName, layerOnName, speciesString) {
          document.getElementById(filterName).addEventListener('change', function (e) {
            // update the map filter
            if (e.target.value === layerOnName) {
              //if layer doesn't exist then push
  
              if (activeSpecies.indexOf(speciesString) == -1) {
  
                activeSpecies.push(speciesString)
              }
  
              var newdata = data.filter(function (d) {
                // d.Speices not in array
                return activeSpecies.indexOf(d.Species) > -1 && activeUse.indexOf(d.Use) > -1;
              });
  
              if(!small && !mobile){redraw(newdata)}
  
              speciesFilter = ["in", ["get", "species"], ["literal", activeSpecies]];
              useFilter = ["in", ["get", "use"], ["literal", activeUse]];
              if (cumulative) {
                yearFilter = ['<=', ['get', 'year'], sliderValG];
              } else {
                yearFilter = ["==", ["get", "year"], sliderValG];
              }
  
              map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
            } else { //if turn layer off
  
              //if layer exists then remove it
              if (activeSpecies.indexOf(speciesString) !== -1) {
                var index = activeSpecies.indexOf(speciesString);
                activeSpecies.splice(index, 1);
              }
  
              //filter out all data where the d.Species isn't in the activeSpecies array
  
              var newdata = data.filter(function (d) {
                // d.Speices not in array
                return activeSpecies.indexOf(d.Species) > -1 && activeUse.indexOf(d.Use) > -1;
              });
  
              if(!small && !mobile){redraw(newdata);}
  
              speciesFilter = ["in", ["get", "species"], ["literal", activeSpecies]];
              useFilter = ["in", ["get", "use"], ["literal", activeUse]];
              if (cumulative) {
                yearFilter = ['<=', ['get', 'year'], sliderValG];
              } else {
                yearFilter = ["==", ["get", "year"], sliderValG];
              }
              map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
            }
          });
  
        }
  
        createFilterSpecies('filter1', 'Aonyx_cinereus_on', 'Aonyx cinereus')
        createFilterSpecies('filter2', 'Lutra_lutra_on', 'Lutra lutra')
        createFilterSpecies('filter3', 'Lutra_sumatrana_on', 'Lutra sumatrana')
        createFilterSpecies('filter4', 'Lutrogale_perspicillata_on', 'Lutrogale perspicillata')
        createFilterSpecies('filter5', 'Multiple_on', 'Multiple')
        createFilterSpecies('filter6', 'Unsure_on', 'Unsure')
        createFilterSpecies('filter7', 'Not_identified_on', 'Not identified')
  
        function createFilterUse(filterName, layerOnName, useString) {
          document.getElementById(filterName).addEventListener('change', function (e) {
            // update the map filter
            if (e.target.value === layerOnName) {
              //if layer doesn't exist then push
  
              if (activeUse.indexOf(useString) == -1) {
                activeUse.push(useString)
              }
  
              var newdata = data.filter(function (d) {
                return activeSpecies.indexOf(d.Species) > -1 && activeUse.indexOf(d.Use) > -1;
              });
  
              if(!small && !mobile){redraw(newdata)}
  
              useFilter = ["in", ["get", "use"], ["literal", activeUse]];
  
              if (cumulative) {
                yearFilter = ['<=', ['get', 'year'], sliderValG];
              } else {
                yearFilter = ["==", ["get", "year"], sliderValG];
              }
  
              map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
            } else { //if turn layer off
  
              //if layer exists then remove it
              if (activeUse.indexOf(useString) !== -1) {
                var index = activeUse.indexOf(useString);
                activeUse.splice(index, 1);
              }
  
              var newdata = data.filter(function (d) {
                return activeSpecies.indexOf(d.Species) > -1 && activeUse.indexOf(d.Use) > -1;
              });
  
              if(!small && !mobile){redraw(newdata);}
  
              useFilter = ["in", ["get", "use"], ["literal", activeUse]];
              if (cumulative) {
                yearFilter = ['<=', ['get', 'year'], sliderValG];
              } else {
                yearFilter = ["==", ["get", "year"], sliderValG];
              }
              map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
            }
  
          });
        }
  
        createFilterUse('filter8', 'Skin_on', 'Skin')
        createFilterUse('filter9', 'Tail_on', 'Tail')
        createFilterUse('filter10', 'Pet_on', 'Pet')
        createFilterUse('filter11', 'Piece_on', 'Piece')
        createFilterUse('filter12', 'Carcass_on', 'Carcass')
        createFilterUse('filter13', 'Unknown_on', 'Unknown')
        createFilterUse('filter14', 'Multiple2_on', 'Many')
  
  
  
      $("#reset").click(function () {
  
          for (var i = 0; i < allSpecies.length; i++) {
            if (activeSpecies.indexOf(allSpecies[i]) == -1) {
              activeSpecies.push(allSpecies[i]);
            }
          }
  
          var newdata = data.filter(function (d) {
                // d.Speices not in array
                return activeSpecies.indexOf(d.Species) > -1;
          });
        
          redraw(newdata)
        
          speciesFilter = ["in", ["get", "species"], ["literal", activeSpecies]];
          map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
          $("#Aonyx_cinereus_on").prop('checked', true);
          $("#Aonyx_cinereus_off").prop('checked', false);
          $("#Lutra_lutra_on").prop('checked', true);
          $("#Lutra_lutra_off").prop('checked', false);
          $("#Lutra_sumatrana_on").prop('checked', true);
          $("#Lutra_sumatrana_off").prop('checked', false);
          $("Lutrogale_perspicillata_on").prop('checked', true);
          $("#Lutrogale_perspicillata_off").prop('checked', false);
          $("#Multiple_on").prop('checked', true);
          $("#Multiple_off").prop('checked', false);
          $("#Unsure_on").prop('checked', true);
          $("#Unsure_off").prop('checked', false);
          $("#Not_identified_on").prop('checked', true);
          $("#Not_identified_off").prop('checked', false);
  
          });
  
          // //RESET USE
        $("#reset2").click(function() {
        
          for (var i = 0; i < allUse.length; i++) {
            if (activeUse.indexOf(allUse[i]) == -1) {
              activeUse.push(allUse[i]);
            }
          }
  
          var newdata = data.filter(function (d) {
                // d.Speices not in array
                return activeUse.indexOf(d.Use) > -1;
          });
        
          redraw(newdata)
        
          useFilter = ["in", ["get", "use"], ["literal", activeUse]];
          map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
        
          $("#Skin_on").prop('checked', true);
          $("#Skin_off").prop('checked', false);
          $("#Tail_on").prop('checked', true);
          $("#Tail_off").prop('checked', false);
          $("#Pet_on").prop('checked', true);
          $("#Pet_off").prop('checked', false);
          $("#Piece_on").prop('checked', true);
          $("#Piece_off").prop('checked', false);
          $("#Carcass_on").prop('checked', true);
          $("#Carcass_off").prop('checked', false);
          $("#Unknown_on").prop('checked', true);
          $("#Unknown_off").prop('checked', false);
          $("#Multiple2_on").prop('checked', true);
          $("#Multiple2_off").prop('checked', false);
        
        });
  
  
        $("#reset3").click(function () {
  
          $("#cumulative_on").prop('checked', true);
          $("#cumulative_off").prop('checked', false);
  
          d3.selectAll('rect').attr('fill', function (el) {
            var texture = textures
              .lines()
              .size(4)
              .strokeWidth(1.5)
              .stroke(color(el.data.Species1));
            svg.call(texture);
            return texture.url()
          });
          //reset all rect colors
  
          speciesFilter = ["in", ["get", "species"], ["literal", activeSpecies]];
          yearFilter = ['<=', ['get', 'year'], 2019];
          document.getElementById('selectedYear').innerText = 2019;
          $("#slider").val(2019);
          $("#slider").trigger('change');
          sliderValG = 2019;
          map.setFilter('otters', ['all', speciesFilter, useFilter, yearFilter]);
  
        });
  
  
        $("document").ready(function () {
          $(".tab-slider--body").hide();
          $(".tab-slider--body:first").show();
        });
  
        $(".tab-slider--nav li").click(function () {
          $(".tab-slider--body").hide();
          $('.mapboxgl-popup').remove();
  
          var activeTab;
  
          tab1 = !tab1;
  
          if (tab1) {
            activeTab = "tab1"
          } else {
            activeTab = "tab2"
          }
  
          if (tab1) {
  
            if(!small && !mobile){updateStackedBar();}
  
            var newdata = data.filter(function (d) {
              // d.Speices not in array
              return activeSpecies.indexOf(d.Species) > -1 && activeUse.indexOf(d.Use) > -1;
            });
  
            if(!small && !mobile){redraw(newdata)}
  
            map.setPaintProperty('otters', "circle-color", [
              "case",
              ["==", ["get", "species"], 'Aonyx cinereus'],
              "#80BA5A",
              ["==", ["get", "species"], 'Lutra lutra'],
              "#008695",
              ["==", ["get", "species"], 'Lutra sumatrana'],
              '#3969AC',
              ["==", ["get", "species"], 'Lutrogale perspicillata'],
              '#F2B701',
              ["==", ["get", "species"], 'Multiple'],
              '#CF1C90',
              ["==", ["get", "species"], 'Unsure'],
              "#A5AA99",
              "#f97b72"
            ])
  
  
          } else {
  
            if(!small && !mobile){updateStackedBar();}
  
            var newdata = data.filter(function (d) {
              // d.Speices not in array
              return activeSpecies.indexOf(d.Species) > -1 && activeUse.indexOf(d.Use) > -1;
            });
  
            if(!small && !mobile){redraw(newdata);}
  
  
            map.setPaintProperty('otters', "circle-color", [
              "case",
              ["==", ["get", "use"], 'Skin'],
              "#80BA5A",
              ["==", ["get", "use"], 'Tail'],
              "#008695",
              ["==", ["get", "use"], 'Pet'],
              '#3969AC',
              ["==", ["get", "use"], 'Piece'],
              '#F2B701',
              ["==", ["get", "use"], 'Carcass'],
              '#CF1C90',
              ["==", ["get", "use"], 'Unknown'],
              "#A5AA99",
              "#f97b72"
            ])
  
          }
  
          $("#" + activeTab).fadeIn();
          if (!tab1) {
            $('.tab-slider--tabs').addClass('slide');
          } else {
            $('.tab-slider--tabs').removeClass('slide');
          }
          $(".tab-slider--nav li").removeClass("activeTab");
          $('[rel="' + activeTab + '"]').addClass("activeTab");
        });
  
  
  
  
        map.on('mouseleave', function () {
          map.getCanvas().style.cursor = '';
        });
  
  
        map.on('click', 'otters', function (e) {
  
          map.getCanvas().style.cursor = 'pointer';
  
          var latitude = e.features[0].properties.latitude;
          var longitude = e.features[0].properties.longitude;
          var year = e.features[0].properties.year;
          var country = e.features[0].properties.country;
          var location = e.features[0].properties.location;
          var sum = e.features[0].properties.sum;
          var species = e.features[0].properties.species;
          var speciesDetail = e.features[0].properties.speciesDetail;
          var use = e.features[0].properties.use;
          var useDetail = e.features[0].properties.useDetail;
  
  
          while (Math.abs(e.lngLat.lng - latitude) > 180) {
            latitude += e.lngLat.lng > latitude ? 360 : -360;
          }
  
          var popupClass = "color1";
          var color = "#80BA5A";
  
  
          if (tab1) {
            if (species == 'Aonyx cinereus') {
              color = "#80BA5A";
              popupClass = "color1"
            } else if (species == 'Lutra lutra') {
              color = "#008695";
              popupClass = "color2"
            } else if (species == 'Lutra sumatrana') {
              color = "#3969AC";
              popupClass = "color3"
            } else if (species == 'Lutrogale perspicillata') {
              color = "#F2B701";
              popupClass = "color4"
            } else if (species == 'Multiple') {
              color = "#CF1C90";
              popupClass = "color5"
            } else if (species == 'Unsure') {
              color = "#A5AA99";
              popupClass = "color6"
            } else {
              color = "#f97b72";
              popupClass = "color7"
            }
          } else {
            if (use == 'Skin') {
              color = "#80BA5A";
              popupClass = "color1"
            } else if (use == 'Tail') {
              color = "#008695";
              popupClass = "color2"
            } else if (use == 'Pet') {
              color = "#3969AC";
              popupClass = "color3"
            } else if (use == 'Piece') {
              color = "#F2B701";
              popupClass = "color4"
            } else if (use == 'Carcass') {
              color = "#CF1C90";
              popupClass = "color5"
            } else if (use == 'Unknown') {
              color = "#A5AA99";
              popupClass = "color6"
            } else {
              color = "#f97b72";
              popupClass = "color7"
            }
          }
  
  
          popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            className: popupClass
          })
            .setHTML('<h3 class="popupClass"><b>' + location + ', ' + country + '</b></h3>'
              + '<h4><b>Year</b>: ' + year + '<br>'
              + '<b>Number of otters</b>: ' + sum + '<br>'
              + '<b>Species</b>: ' + speciesDetail + '<br>'
              + '<b>Use</b>: ' + use + '</h4>')
            .setLngLat([longitude, latitude])
            .addTo(map);
  
  
  
          $(`.button.${popupClass}`).hover(function () {
            $(".button a").css("color", "white");
            $(this).css("background-color", color);
          }, function () {
            $(".button a").css("color", color);
            $(this).css("background-color", "white");
          });
          $(".mapboxgl-popup-tip").css("border-bottom-color", color);
  
          $(".mapboxgl-popup-tip").css("border-bottom-color", color);
  
        });
  
        //mobile
  
        map.on('touchstart', 'otters', function (e) {
  
          map.getCanvas().style.cursor = 'pointer';
  
          var latitude = e.features[0].properties.latitude;
          var longitude = e.features[0].properties.longitude;
          var year = e.features[0].properties.year;
          var country = e.features[0].properties.country;
          var location = e.features[0].properties.location;
          var sum = e.features[0].properties.sum;
          var species = e.features[0].properties.species;
          var speciesDetail = e.features[0].properties.speciesDetail;
          var use = e.features[0].properties.use;
          var useDetail = e.features[0].properties.useDetail;
  
  
          while (Math.abs(e.lngLat.lng - latitude) > 180) {
            latitude += e.lngLat.lng > latitude ? 360 : -360;
          }
  
          var popupClass = "color1";
          var color = "#80BA5A";
  
  
          if (tab1) {
            if (species == 'Aonyx cinereus') {
              color = "#80BA5A";
              popupClass = "color1"
            } else if (species == 'Lutra lutra') {
              color = "#008695";
              popupClass = "color2"
            } else if (species == 'Lutra sumatrana') {
              color = "#3969AC";
              popupClass = "color3"
            } else if (species == 'Lutrogale perspicillata') {
              color = "#F2B701";
              popupClass = "color4"
            } else if (species == 'Multiple') {
              color = "#CF1C90";
              popupClass = "color5"
            } else if (species == 'Unsure') {
              color = "#A5AA99";
              popupClass = "color6"
            } else {
              color = "#f97b72";
              popupClass = "color7"
            }
          } else {
            if (use == 'Skin') {
              color = "#80BA5A";
              popupClass = "color1"
            } else if (use == 'Tail') {
              color = "#008695";
              popupClass = "color2"
            } else if (use == 'Pet') {
              color = "#3969AC";
              popupClass = "color3"
            } else if (use == 'Piece') {
              color = "#F2B701";
              popupClass = "color4"
            } else if (use == 'Carcass') {
              color = "#CF1C90";
              popupClass = "color5"
            } else if (use == 'Unknown') {
              color = "#A5AA99";
              popupClass = "color6"
            } else {
              color = "#f97b72";
              popupClass = "color7"
            }
          }
  
  
          popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            className: popupClass
          })
            .setHTML('<h3 class="popupClass"><b>' + location + ', ' + country + '</b></h3>'
              + '<h4><b>Year</b>: ' + year + '<br>'
              + '<b>Number of otters</b>: ' + sum + '<br>'
              + '<b>Species</b>: ' + speciesDetail + '<br>'
              + '<b>Use</b>: ' + use + '</h4>')
            .setLngLat([longitude, latitude])
            .addTo(map);
  
  
  
          $(`.button.${popupClass}`).hover(function () {
            $(".button a").css("color", "white");
            $(this).css("background-color", color);
          }, function () {
            $(".button a").css("color", color);
            $(this).css("background-color", "white");
          });
          $(".mapboxgl-popup-tip").css("border-bottom-color", color);
  
          $(".mapboxgl-popup-tip").css("border-bottom-color", color);
  
          });
  
      }