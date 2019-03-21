var auth = "0";
var inMain= false;
var removedId;
var app = {
    initialize: function(){
        document.addEventListener('deviceready',this.onDeviceReady);
    },
    onDeviceReady: function(){
        createKeyTable();
    }
}
function toMain(where){

    if($('input#authorization').val()==""){
        window.plugins.toast.showShortBottom('Invalid Authorization Key');
        return false;
    }
    if(where=="next")
        nextKey();
    else
        $('.modal').modal('toggle');
}

function createKeyTable(){
    db.transaction(function(tx){
//        tx.executeSql('DROP TABLE IF EXISTS authorizationKey');
//        tx.executeSql('DROP TABLE IF EXISTS authorizationValues');
        tx.executeSql('CREATE TABLE IF NOT EXISTS authorizationKey(key_id INTEGER PRIMARY KEY,name,keys)');
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS idx_key ON authorizationKey(keys)');
    },function (error){ console.log("db Error "+error);}, function success(){});
    displayKeyTable();
}

function saveKey(){
    var authSave = $('input#authorization').val();
    var authName = $('input#projectName').val();
    if(authName==""){
        window.plugins.toast.showShortBottom('Invalid Authorization Key');
        return false;
    }
    db.transaction(function(tx){
        tx.executeSql('REPLACE INTO authorizationKey(name,keys) VALUES("'+authName+'","'+authSave+'")');
    },function (error){ console.log("db Error "+JSON.stringify(error));}, function success(){auth=authSave;});
    transition();
    displayKeyTable();
}

function nextKey(){
    auth = $('input#authorization').val();
    transition();
}

function displayKeyTable(){
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM authorizationKey',[],function(tx,rs){
            $('#authTable').html('');
            for(i=0;i<rs.rows.length;i++){
                $('#authTable').append(
                    '<tr>'+
                        '<td>'+rs.rows.item(i).name+'</td>'+
                        '<td class="mainSpan">'+
                            '<i class="glyphicon glyphicon-ok" onclick="transition('+rs.rows.item(i).key_id+');"></i>'+
                            '<i class="icon-space glyphicon glyphicon-pencil"></i>'+
                            '<i class="icon-space glyphicon glyphicon-trash" onclick="showConfirm('+rs.rows.item(i).key_id+');"></i>'+
                        '</td>'+
                    '<tr>'
                );
            }
        });
    },function (error){ console.log("db Error "+error);}, function success(){});
}


function showConfirm(authorizationId) {
    removedId = authorizationId
    navigator.notification.confirm(
        'Are you sure you want to delete ?',  // message
        deleteAllData,              // callback to invoke with index of button pressed
        'Delete',            // title
        ['Yes','No']          // buttonLabels
    );
}

function deleteAllData(button){
    if(button==1){
        db.transaction(function(tx){
            tx.executeSql('DELETE FROM authorizationValues WHERE id='+removedId);
            tx.executeSql('DELETE FROM authorizationKey WHERE key_id='+removedId);
        },function (error){ console.log("db Error "+JSON.stringify(error));}, function success(){});
        displayKeyTable();
    }
}

function transition(authorizationId){
//    window.location.href='main.html';
    $('section#keyPage').addClass("hide");
    $('section#homePage').removeClass("hide");
        var options = {
                        "direction"        : "left", // 'left|right|up|down', default 'left' (which is like 'next')
                        "duration"         :  300, // in milliseconds (ms), default 400
                        "slowdownfactor"   :    4, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
                        "slidePixels"      :   -1, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
                        "iosdelay"         :  100, // ms to wait for the iOS webview to update before animation kicks in, default 60
                        "androiddelay"     :  0, // same as above but for Android, default 70
                        "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
                        "fixedPixelsTop"   :    55, // the number of pixels of your fixed header, default 0 (iOS and Android)
                        "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
                      };
                      window.plugins.nativepagetransitions.slide(
                        options,
                        function (msg) {
//                            window.location.href='main.html';
                        },
                        function (error) {
                          alert(msg);
                        }
                      );

    console.log("ID:"+authorizationId);
    if(authorizationId==undefined)
        toMainSection();
    else
        toMainSection(authorizationId);

}

app.initialize();