
function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+location.hostname+'/login.html';
        }

        var ipmaster = document.getElementById('ip-master');
        ipmaster.value = data.master.ip;
        var portmaster = document.getElementById('port-master');
        portmaster.value = data.master.port;
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();

function LoadNodes() {
    var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.hostname+'/login.html';
    }else{
        document.location.href='https://'+ipmaster+'/nodes.html';
    }
}
function LoadGroups(){
    var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.hostname+'/login.html';
    }else{
        document.location.href='https://'+ipmaster+'/groups.html';
    }
}
function LoadOpenrules(){
    var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.hostname+'/login.html';
    }else{
        document.location.href='https://'+ipmaster+'/rulesets.html';
    }
}
function LoadMaster(){
    var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.hostname+'/login.html';
    }else{
        document.location.href='https://'+ipmaster+'/master.html';
    }
}
function LoadConfig(){
    var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.hostname+'/login.html';
    }else{
        document.location.href='https://'+ipmaster+'/config.html';
    }
}