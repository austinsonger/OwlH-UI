function loadRulesData(){
    var result = document.getElementById('new-ruleset-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/getAllRuleData';

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000
    })
    .then(function (response) {
        result.innerHTML = generateAllRuleDataHTMLOutput(response.data);
        for (source in response.data){
            document.getElementById('checkbox-'+response.data[source]["sourceUUID"]).addEventListener("click", function(){addRulesetFilesToTable(response.data)} ); 
        }
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
}

function generateAllRuleDataHTMLOutput(sources) {
    console.log(sources);

    var html = "";
    var isEmpty = true;
    var arrayRulesets = new Array();

    if (sources.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error creating ruleset</h3></div>';
    }
    html = html + 
    '<div>'+
        '<div class="input-group col-md-6">'+
        '<div class="input-group-prepend">'+
            '<span class="input-group-text">New Name</span>'+
        '</div>'+
        '<input type="text" class="form-control" placeholder="Ruleset name" id="new-ruleset-name-input">'+
    '</div>'+
    '<br>'+
    '<div class="input-group col-md-6">'+
        '<div class="input-group-prepend">'+
            '<span class="input-group-text">New Description</span>'+
        '</div>'+
        '<input type="text" class="form-control" placeholder="Ruleset description" id="new-ruleset-description-input">'+
    '</div>'+
    '<br>'+
    '</div>'+
    '<br><br><br>'+

    '<h5>Select rulesets</h5>'+
    '<div class="form-check">'+
        '<ul class="checkbox-grid">';
        for (source in sources) {
            if(!arrayRulesets.includes(sources[source]["name"])){
                arrayRulesets.push(sources[source]["name"]);
                html = html + ' <li style="display: block; float: left; width: 25%"><input type="checkbox" name="'+sources[source]["name"]+'" value="'+sources[source]["name"]+'" id="checkbox-'+sources[source]["sourceUUID"]+'" checked /><label for="'+sources[source]["name"]+'">&nbsp'+sources[source]["name"]+'</label></li>';    
            }
        }
        html = html + '</ul>'+
    '</div>'+
        
    '<br><br>'+
    '<br><br><br>'+
    '<div>'+
        '<div class="input-group col-md-6">'+
            '<div class="input-group-prepend">'+
                '<span class="input-group-text">Search rule file</span>'+
            '</div>'+
            '<input class="form-control" type="text" id="ruleset-search-input" onkeyup="searchRuleset()"'+
                'placeholder="Search for rulesets..." title="Insert a ruleset name for search">'+
        '</div>'+
    '</div>'+

    '<a class="btn btn-primary float-right" style="color: white;" onclick="modalAddNewRuleset()">Add</a>'+
    '<table class="table table-hover" style="table-layout: fixed" style="width:1px" id="create-ruleset-table">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th style="width: 10%">Select</th>                                                  ' +
        // '<th>Ruleset name <i class="fas fa-sort" style="cursor: pointer;" onclick="sortTable(1)"></i></th>                                          ' +
        '<th>Ruleset name</th>                                          ' +
        // '<th>File name <i class="fas fa-sort" style="cursor: pointer;" onclick="sortTable(1)"></i></th>                                          ' +
        '<th>File name</th>                                          ' +
        '<th>File path</th>                                          ' +
        '<th>Source</th>                                          ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      ' ;
    for (source in sources) {        
        if(sources[source]["exists"]=="true"){
            isEmpty = false;
            html = html + '<tr id="row-'+source+'"><td style="width: 100%; word-wrap: break-word;" align="center">'+
                    '<input class="form-check-input" type="checkbox" value="table-elements" id="'+source+'"></input>'+
                '</td>'+
                '<td style="word-wrap: break-word;" id="nameNewRuleset-'+source+'" value="'+sources[source]["sourceType"]+'">'+                 
                    sources[source]["name"]+
                '</td><td style="word-wrap: break-word;" id="fileNewRuleset-'+source+'">'+
                    sources[source]["file"]+
                '</td><td style="word-wrap: break-word;" id="pathNewRuleset-'+source+'">'+
                    sources[source]["path"]+
                '</td><td style="word-wrap: break-word;" style="display:none;" id="source-type-'+source+'">';
                    if (sources[source]["sourceType"]){
                        html = html + sources[source]["sourceType"];
                    }else{
                        html = html + sources[source]["type"];
                    }
                html = html + '</td></tr>';
        }
    }
    html = html + '</tbody></table>'+
    '<br><a class="btn btn-primary float-right" style="color: white;" onclick="modalAddNewRuleset()">Add</a><br><br>';
    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function addRulesetFilesToTable(sources){
    $('input:checkbox:checked').each(function() {
        var checked = $(this).prop("value");
        for (source in sources){
            if (checked == sources[source]["name"]){
                document.getElementById("row-"+source).style.display = "";//in this case display is void, not none
            }
        }
    });
    $('input:checkbox:not(:checked)').each(function() {
        var checked = $(this).prop("value");
        for (source in sources){
            if (checked == sources[source]["name"]){
                document.getElementById("row-"+source).style.display = "none";
            }
        }
    });
}

function searchRuleset(){
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("ruleset-search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("create-ruleset-table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function modalAddNewRuleset(){    
    var newRuleset = new Map();
    $('input:checkbox:checked').each(function() {
        var uuid = $(this).prop("id");
        var value = $(this).prop("value");
        if (value == "table-elements"){
            newRuleset[uuid] = new Map();
            newRuleset[uuid]["sourceName"] = document.getElementById('nameNewRuleset-'+uuid+'').innerHTML;
            newRuleset[uuid]["fileName"] = document.getElementById('fileNewRuleset-'+uuid+'').innerHTML;
            newRuleset[uuid]["filePath"] = document.getElementById('pathNewRuleset-'+uuid+'').innerHTML;
            newRuleset[uuid]["rulesetName"] = document.getElementById('new-ruleset-name-input').value;
            newRuleset[uuid]["rulesetDesc"] = document.getElementById('new-ruleset-description-input').value;
            newRuleset[uuid]["sourceType"] = document.getElementById('source-type-'+uuid).innerHTML;
        }
    });

    var isDuplicated = false;
    for (uuid in newRuleset){
        for (uuidCheck in newRuleset){
            if ((uuid != uuidCheck) && (newRuleset[uuid]["fileName"] == newRuleset[uuidCheck]["fileName"]) ){
                isDuplicated = true;
            }
        }
    }

    if(document.getElementById('new-ruleset-name-input').value == "" || document.getElementById('new-ruleset-description-input').value == "") {
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Name or description fields are null.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
    }else if (isDuplicated){        
        document.getElementById('modal-window').innerHTML = 
        '<div class="modal-dialog">'+
            '<div class="modal-content">'+
        
                '<div class="modal-header">'+
                    '<h4 class="modal-title">Files duplicated</h4>'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
        
                '<div class="modal-body">'+ 
                    '<p>You have selected duplicate files.</p>'+
                '</div>'+
        
                '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                    '<button id="modalDuplicate" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '</div>'+
        
            '</div>'+
        '</div>';

        $('#modal-window').modal('show')     
    } else {
        $('#modal-window').modal('dispose')
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/addNewRuleset';
        var nodeJSON = JSON.stringify(newRuleset);
        axios({
            method: 'put',
            url: sourceurl,
            timeout: 30000,
            data: nodeJSON
        })
        .then(function (response) {
            if (response.data.ack == "true"){
                document.location.href = 'https://' + ipmaster + '/rulesets.html';
            }else if (response.data.ack == "false"){
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
            }else{
                lines = JSON.parse(response.data)
                var html =
                '<div class="modal-dialog modal-lg">'+
                    '<div class="modal-content">'+
                
                        '<div class="modal-header">'+
                            '<h4 class="modal-title">Lines duplicated</h4>'+
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                        '</div>'+
                
                        '<div class="modal-body">'+
                            '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                                '<thead>                                                      ' +
                                    '<tr>                                                         ' +
                                    '<th>SID</th>                                                ' +
                                    '<th>Files</th>                                         ' +
                                    '</tr>                                                        ' +
                                '</thead>                                                     ' +
                                '<tbody>                                                     '
                                    for (sid in lines){
                                        for(values in lines[sid]){
                                            var cont = true;
                                            for(data in lines[sid][values]){
                                                html = html + '<tr>'
                                                if (cont){
                                                    html = html + 
                                                    '<th rowspan="'+lines[sid]["counter"]+'">' +
                                                        sid +
                                                    '</th>'
                                                    cont = false;
                                                }
                                                html = html + 
                                                '<td style="word-wrap: break-word;">'+
                                                    lines[sid][values][data]["fileName"] +
                                                '</td></tr>'
                                            }
                                        }
                                    }
                                html = html + '</tbody></table>'+
                        '</div>'+
                
                        '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                            '<button id="modalDuplicate" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                        '</div>'+
                
                    '</div>'+
                '</div>';
        
                document.getElementById('modal-window').innerHTML = html;
                $('#modal-window').modal('show')     
            }
        })
        .catch(function (error) {
        });
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("new-ruleset-table");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}



function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;      
      loadRulesData();
      loadTitleJSONdata();
    });
  }
  loadJSONdata();