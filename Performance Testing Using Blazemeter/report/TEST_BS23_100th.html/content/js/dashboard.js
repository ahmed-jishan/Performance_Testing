/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37454545454545457, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.94, 500, 1500, "https://brainstation-23.com/case-studies/"], "isController": false}, {"data": [0.33, 500, 1500, "https://brainstation-23.com/fintech-solutions/"], "isController": false}, {"data": [0.895, 500, 1500, "https://brainstation-23.com/automobile/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.605, 500, 1500, "https://brainstation-23.com/telecom/"], "isController": false}, {"data": [0.0, 500, 1500, "https://brainstation-23.com/"], "isController": false}, {"data": [0.0, 500, 1500, "https://elearning23.com/"], "isController": false}, {"data": [0.73, 500, 1500, "https://brainstation-23.com/software-ites/"], "isController": false}, {"data": [0.315, 500, 1500, "https://brainstation-23.com/-0"], "isController": false}, {"data": [0.02, 500, 1500, "https://brainstation-23.com/-1"], "isController": false}, {"data": [0.285, 500, 1500, "https://brainstation-23.com/blog/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 3418.0939999999987, 255, 23459, 1250.0, 10357.199999999999, 15096.199999999999, 20098.530000000002, 8.20196519085973, 1863.1566025563475, 5.349699756811733], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://brainstation-23.com/case-studies/", 100, 0, 0.0, 381.58000000000015, 255, 1328, 294.0, 568.7000000000002, 947.2999999999998, 1325.709999999999, 4.860267314702308, 838.2605558930742, 2.9142618469015797], "isController": false}, {"data": ["https://brainstation-23.com/fintech-solutions/", 100, 0, 0.0, 1636.06, 284, 4558, 1286.0, 3471.2000000000003, 3740.6999999999985, 4552.2199999999975, 6.960395350455906, 1439.9766500487226, 4.207504611261919], "isController": false}, {"data": ["https://brainstation-23.com/automobile/", 100, 0, 0.0, 416.34000000000026, 277, 1687, 312.5, 639.5000000000001, 951.6999999999995, 1681.5399999999972, 4.830451164138731, 859.0688512885228, 2.886949328567288], "isController": false}, {"data": ["Test", 100, 0, 0.0, 28135.2, 11846, 40845, 30226.0, 35055.1, 36430.44999999999, 40835.77, 2.4072023494294927, 4883.548412788563, 12.870539905396948], "isController": true}, {"data": ["https://brainstation-23.com/telecom/", 100, 0, 0.0, 768.4, 288, 2682, 565.0, 1515.3, 1682.2499999999986, 2675.1699999999964, 4.808385824878588, 835.7075520958551, 2.8596747728037695], "isController": false}, {"data": ["https://brainstation-23.com/", 100, 0, 0.0, 6047.370000000002, 2262, 12749, 5647.5, 8554.700000000004, 10820.15, 12738.669999999995, 7.42721330956625, 1803.8778322053251, 8.732778149138444], "isController": false}, {"data": ["https://elearning23.com/", 100, 0, 0.0, 14579.390000000001, 5104, 23459, 14958.0, 20076.300000000003, 20335.399999999998, 23458.67, 3.7020583444395085, 1155.337753533152, 2.1547136457870577], "isController": false}, {"data": ["https://brainstation-23.com/software-ites/", 100, 0, 0.0, 571.9300000000003, 282, 1713, 503.5, 1152.2000000000003, 1220.6499999999999, 1710.7399999999989, 4.85366208804543, 841.660270955686, 2.915041195456972], "isController": false}, {"data": ["https://brainstation-23.com/-0", 100, 0, 0.0, 1487.2000000000005, 741, 5833, 1367.0, 2218.2000000000007, 3024.9999999999977, 5813.96999999999, 16.131634134537826, 16.474273824407163, 9.467882924665268], "isController": false}, {"data": ["https://brainstation-23.com/-1", 100, 0, 0.0, 4558.540000000001, 1321, 11807, 4235.5, 6720.1, 9568.799999999997, 11791.569999999992, 8.327088017320342, 2013.930144839287, 4.903548900824382], "isController": false}, {"data": ["https://brainstation-23.com/blog/", 100, 0, 0.0, 3734.1300000000015, 351, 18310, 2263.0, 10093.1, 10838.199999999997, 18285.179999999986, 3.394317911815621, 1932.5969342944911, 2.00874673296901], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
