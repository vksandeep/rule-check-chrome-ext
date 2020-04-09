function injectStyle(){
    //Not required generally - You may remove "web_accessible_resources": ["tooltip.css"] from manifest too if it works
    var ttip = document.getElementById('ttip');
    if(typeof(ttip) == 'undefined' || ttip == null){
        var style = document.createElement('link');
        style.id = 'ttip';
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = chrome.extension.getURL('tooltip.css');
        (document.head||document.documentElement).appendChild(style);
    }
}

injectStyle();

var tbl = document.getElementsByTagName("table")[0]; //Taking first table of page

//convert table to json
var tbljson = parseTable(tbl);
console.log(JSON.stringify(tbljson));
//Apply rules
applyRules(tbljson);

//First row as headers
function parseTable(tbl){
    var headers = [];
    var tbljson = [];
    var width = tbl.rows[0].cells.length;
    var height = tbl.rows.length;
    for (k=0; k< width; k++){
        headers[k] = tbl.rows[0].cells[k].innerText;
    }
    console.log(headers);
    //Rows starting from 1
    for (j=1; j < height; j++){
        tbljson[j-1] = {};
        //parse cells
        for (i=0; i < width; i++){
            tbljson[j-1][headers[i]] = tbl.rows[j].cells[i].innerText;
        }
    }
    return tbljson
}

function applyRules(data){
    var currentTime = (new Date()).getTime();
    var item;
    for (i=0; i<data.length; i++){
        item = data[i];
        var stDt = new Date(item.StartDate); //Use item.StartDate or item["Start Date"] if header has spaces
        var edDt = new Date(item.EndDate);
        var status = item.Status;
        //Rule check functions
        checkPlanned(i, item, status, stDt, edDt, currentTime);
    }
}


function checkPlanned(record, item, status,stDt,edDt,currentTime){
    if(status == "Planned"){            
        if(currentTime > stDt.getTime()){
            highlight(record+1, 1, "Start date should be future for planned tasks");
        }
        //TODO - Other checks for planned status
    }
}

function checkInProgress(record, item, status,stDt,edDt,currentTime){
    //TODO
}

function checkCompleted(record, item, status,stDt,edDt,currentTime){
    //TODO
}



function highlight(r,c, msg){
    var cell = tbl.rows[r].cells[c];
    cell.innerHTML = '<div class="tooltip">' + cell.innerText + '<span class="tooltiptext">' + msg + '</span></div>';
    cell.style.backgroundColor = nextColor(cell.style.backgroundColor);
}

var colors = ['lightsalmon', 'greenyellow', 'gold', 'aquamarine', 'lightpink','cornflowerblue']; //colors for highlight
function nextColor(currColor){
    let idx = colors.indexOf(currColor) + 1;
    idx = (idx==colors.length)?0:idx;
    return colors[idx];
}