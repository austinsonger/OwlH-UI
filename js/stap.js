function showAddServerForm() {
    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');
    if (serverform.style.display == "none") {
        serverform.style.display = "block";
        addserver.innerHTML = "Close Add Server";
    } else {
        serverform.style.display = "none";
        addserver.innerHTML = "Add Server";
    }
}

function addServerToNode() {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');
    var nodeName = document.getElementById('nodenameform');
    var nodeIP = document.getElementById('nodeipform');
    serverform.style.display = "none";
    addserver.innerHTML = "Add Server";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/';
    var nodejson = {};
    nodejson["nodeName"] = nodeName.value;
    nodejson["nodeIP"] = nodeIP.value;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'post',
        url: urlServer,
        timeout: 3000,
        data: nodeJSON
    })
        .then(function (response) {
            GetAllServers();
            return true;
        })
        .catch(function (error) {
            return false;
        });
}

function GetAllServers() {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var node = urlWeb.searchParams.get("node");    
    var tableServer = document.getElementById('servers-table');
    var subtitleBanner = document.getElementById('subtitle-servers-list');
    subtitleBanner.innerHTML = 'Servers for node: '+node;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/'+uuid;
    axios({
        method: 'get',
        url: urlServer,
        timeout: 30000
    })
    .then(function (response) {
        tableServer.innerHTML = generateAllServerHTMLOutput(response);
        return true;
    })
    .catch(function (error) {
        tableServer.innerHTML = generateAllServerHTMLOutput(error);
        return false;
    }); 
}

function generateAllServerHTMLOutput(response) {
    var isEmptyStaps = true;
    var servers = response.data;
    var html =  
        '<div class="container" id="servers-detail" style="display:none;">           ' +                                                                         
        '</div>                                                    ' +                                                                          
            '<table class="table table-hover">                            ' +
                '<thead>                                                      ' +
                    '<tr>                                                         ' +
                        '<th scope="col"></th>                                        ' +
                        '<th scope="col">IP</th>                                      ' +
                        '<th scope="col">Name</th>                                    ' +
                        '<th scope="col">Status</th>                                  ' +
                        '<th scope="col">Actions</th>                                 ' +
                    '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody>                                                      ' ;
    for (server in servers) {
        isEmptyStaps = false;
        html = html + 
        '<tr>                                                                     '+
            '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
            '<td class="align-middle">' + servers[server]['ip'] +'</td>'+
            '<td class="align-middle">' + servers[server]['name'] + '</td>';
           if (servers[server]['status'] == "true"){
                html = html + '<td class="align-middle"> <span class="badge badge-pill bg-success align-text-bottom text-white">ON</span>              '+
                '<td class="align-middle">                                                                                                             ' +
                '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                 ' +
                '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                           ' +
                '       <i class="fas fa-stop-circle low-blue" title="Stop server" id="'+server+'-server-icon-stap" onclick="StopStapServer(\''+server+'\')"></i>  ' +
                '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                '  </span>                                                                                                                             ' +
                '</td>' ;
            } else if (servers[server]['status'] == "false"){
                html = html + '<td class="align-middle"> <span class="badge badge-pill bg-danger align-text-bottom text-white">OFF</span>              ' +
                '<td class="align-middle">                                                                                                             ' +
                '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                 ' +
                '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                           ' +
                '       <i class="fas fa-play-circle low-blue" id="'+server+'-server-icon-stap" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>         ' +
                '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                '  </span>                                                                                                                             ' +
                '</td>' ;
            }else if(servers[server]['status'] == "error"){
                html = html + 
                '<td class="align-middle"> '+
                '<span class="badge badge-pill bg-warning align-text-bottom text-white">ERROR</span>                                                         ' +
                '<td class="align-middle">                                                                                                              ' +
                '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                  ' +
                '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                            ' +
                '       <i class="fas fa-play-circle low-blue" id="'+server+'-server-icon-stap" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>          ' +
                '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                '  </span>                                                                                                                              ' +
                '</td>' ;
            } else {
                html = html + 
                '<td class="align-middle"> '+
                '<span class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>                                                         ' +
                '<td class="align-middle">                                                                                                              ' +
                '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                  ' +
                '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                            ' +
                '       <i class="fas fa-play-circle low-blue" id="'+server+'-server-icon-stap" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>      ' +
                '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                '  </span>                                                                                                                              ' +
                '</td>' ;
            }
        html = html + '</tr>' ;
    }
    html = html + '</tbody></table>';
    if (isEmptyStaps){
        return '<div style="text-align:center"><h3>No stap servers available...</h3></div>'; 
    }else{
        return html;
    }
}
  
  function loadServerDetails(server){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var addserver = document.getElementById('servers-detail');
    if (addserver.style.display == "none") {
        addserver.style.display = "block";
    } else {
        addserver.style.display = "none";
    }
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/server/'+uuid+"/"+server;
    axios({
        method: 'get',
        url: urlServer,
        timeout: 30000
    })
    .then(function (response) {
        var htmDetails =
        '<h3 class="mb-0 low-blue lh-100">'+response.data[server]['name']+' server details</h3>                '+
        '<table class="table table-hover">                                      ' +    
            '<thead>                                                            '+
                '<tr>                                                         ' +
                    '<th scope="col">Param</th>                                    ' +
                    '<th scope="col">Value</th>                                  ' +
                    '<th scope="col" colspan="15%">Actions</th>                                 ' +
                '</tr>                                                        ' +
            '</thead>                                                                           '+
            '</tbody>                                                                   ';
                for (nameDetail in response.data[server]){                                                                        
                    htmDetails = htmDetails +
                    '<tr>                                                                                                   ' +
                        '<td id class="align-middle">'+nameDetail+'</td>                                                    ' +
                        '<td id class="align-middle" >'+response.data[server][nameDetail]+'</td>                            ' +
                        '<td><i class="fas fa-sticky-note low-blue" title="Edit" data-toggle="modal" data-target="#modal-edit-stap-server" onclick="ModalEditStapServer(\''+server+'\',\''+nameDetail+'\',\''+response.data[server][nameDetail]+'\')"></i></td>                                  ' +
                    '</tr>                                                                                                  ' ;
                }
            htmDetails = htmDetails +
            '</tbody>                                                                                                   ' +
        '</table>                                                                                                       ' ;    
        addserver.innerHTML = htmDetails
        return true;   
    })
    .catch(function (error) {
        return false;
    }); 
  }

function ModalEditStapServer(server, param, value){
    var modalWindowEdit = document.getElementById('modal-edit-stap-server');
    modalWindowEdit.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="edit-ruleset-header">STAP server</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="edit-ruleset-footer-table">'+ 
                '<p>Enter the new value for <b>'+param+'</b></p>'+
                '<input class="form-control" id="input-edit-stap-server" type="text" placeholder="...">'+
            '</div>'+
    
            '<div class="modal-footer" id="edit-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="EditStapServer(\''+server+'\',\''+param+'\',\''+value+'\')">Edit</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
}

function ModalDeleteStapServer(server,name){
    var modalWindowDelete = document.getElementById('modal-delete-stap-server');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">STAP server</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>Do you want to delete <b>'+name+'</b>?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="DeleteStapServer(\''+server+'\')">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
}


function EditStapServer(server, param, value){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var newValue = document.getElementById('input-edit-stap-server').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/EditStapServer/';
    var nodejson = {};
    nodejson["server"] = server;
    nodejson["param"] = param;
    nodejson["value"] = newValue;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
    })
        .then(function (response) {
            GetAllServers();
        })
        .catch(function error() {
        });
}

function RunStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/RunStapServer/' + uuid + '/' + server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            GetAllServers();
        })
        .catch(function error() {
        });
}

//Stop stap system
function StopStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/StopStapServer/' + uuid + '/' + server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            GetAllServers();
        })
        .catch(function error() {
        });
}

//Stop stap system
function DeleteStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/DeleteStapServer/' + uuid + '/' + server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            GetAllServers();
        })
        .catch(function error() {
        });
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllServers();
    });
}

loadJSONdata();