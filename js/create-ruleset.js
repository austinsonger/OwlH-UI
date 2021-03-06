function loadRulesData(){
    var result = document.getElementById('new-ruleset-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/getAllRuleData';
    document.getElementById('progressBar-create').style.display = "none";
    document.getElementById('progressBar-create-div').style.display = "none";
    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000
    })
    .then(function (response) {
        result.innerHTML = generateAllRuleDataHTMLOutput(response.data);
        $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset();});
        for (source in response.data){
            if (response.data[source]["type"]){
                document.getElementById('checkbox-'+response.data[source]["sourceUUID"]).addEventListener("click", function(){addRulesetFilesToTable(response.data)} ); 
            }else{
                continue;
            }
        }         
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function generateAllRuleDataHTMLOutput(sources) {
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
    '<div class="form-check">';
    for (source in sources) {
        if(sources[source]["type"] == "source"){            
            if(!arrayRulesets.includes(sources[source]["name"])){
                arrayRulesets.push(sources[source]["name"]);
                html = html +'<ul class="checkbox-grid">'+
                ' <li style="display: block; float: left; width: 25%"><input type="checkbox" name="'+sources[source]["name"]+'" value="'+sources[source]["name"]+'" id="checkbox-'+sources[source]["sourceUUID"]+'" checked /><label for="'+sources[source]["name"]+'">&nbsp'+sources[source]["name"]+'</label></li>'+
                '</ul>';
                
            }
        }else{
            continue;
        }
    }
    html = html +'</div>'+
        
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

    '<button class="btn btn-primary float-right createNewRulesetLocal" type="button">Add</button>'+
    '<table class="table table-hover" style="table-layout: fixed" style="width:1px" id="create-ruleset-table">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th style="width: 10%"><input type="checkbox" id="select-all-create-ruleset" onchange="CheckAll(this)"></th>' +
        // '<th>Ruleset name <i class="fas fa-sort" style="cursor: pointer;" onclick="sortTable(1)"></i></th>                                          ' +
        '<th>Ruleset name</th>                                          ' +
        // '<th>File name <i class="fas fa-sort" style="cursor: pointer;" onclick="sortTable(1)"></i></th>                                          ' +
        '<th>File name</th>                                          ' +
        '<th>File path</th>                                          ' +
        '<th>Source</th>                                          ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody id="create-ruleset-table-body">' ;
    for (source in sources) {        
        if(sources[source]["type"]){
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
        }else{
            continue;
        }
    }
    html = html + '</tbody></table>'+
    '<br><button class="btn btn-primary float-right createNewRulesetLocal" type="button">Add</button><br><br>';     

    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function CheckAll(ele){
    if (ele.checked) {
        $('input:checkbox:not(checked)').each(function() {
            var value = $(this).prop("value");
            var id = $(this).prop("id");
            if (value == "table-elements" && document.getElementById("row-"+id).style.display != 'none'){                
                $(this).prop("checked", true);
            }
        });
    } else {
        $('input:checkbox:checked').each(function() {
            var value = $(this).prop("value");
            var id = $(this).prop("id");
            if (value == "table-elements" && document.getElementById("row-"+id).style.display != 'none'){
                $(this).prop("checked", false);
            }
        });
    }
}

function addRulesetFilesToTable(sources){
    $('input:checkbox:checked').each(function() {
        var checked = $(this).prop("value");
        for (source in sources){
            if (checked == sources[source]["name"]){
                document.getElementById("row-"+source).style.display = "";//in this case display is void, not none
                document.getElementById("row-"+source).value = "true"; //true == visible at table
            }
        }
    });
    $('input:checkbox:not(:checked)').each(function() {
        var checked = $(this).prop("value");
        for (source in sources){
            if (checked == sources[source]["name"]){
                document.getElementById("row-"+source).style.display = "none";
                document.getElementById("row-"+source).value = "false"; //false == hidden at table
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
    $(".createNewRulesetLocal").unbind("click");

    //show progress-bar
    document.getElementById('progressBar-create-div').style.display="block";
    document.getElementById('progressBar-create').style.display="block";    

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
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none";

        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Name or description fields are null.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset();});
            setTimeout(function() {$(".alert").alert('close')}, 5000);
    }else if (isDuplicated){      
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none";
        
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

        $('#modal-window').modal('show');
        $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset();});     
    } else {        
        $('#modal-window').modal('dispose');        
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
                document.getElementById('progressBar-create-div').style.display="none";
                document.getElementById('progressBar-create').style.display="none";
                document.location.href = 'https://' + ipmaster + '/rulesets.html';
            }else if (response.data.ack == "false"){
                $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset();});
                document.getElementById('progressBar-create-div').style.display="none";
                document.getElementById('progressBar-create').style.display="none";

                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset();});
                document.getElementById('progressBar-create-div').style.display="none";
                document.getElementById('progressBar-create').style.display="none";

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

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
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