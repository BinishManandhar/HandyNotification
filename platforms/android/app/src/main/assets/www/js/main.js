var picturePlus = true;
var optionalPlus = true;

var app = {
    initialize: function(){
        document.addEventListener('deviceready',this.onDeviceReady);
        document.addEventListener('backbutton',onBackPressed);
    },
    onDeviceReady: function(){
        $('input#topic').val("/topics/");
        $("#priorityButton").val("0");
        $("#priorityButton").text("0");
    }
}

function toMainSection(authorizationId){
    inMain = true;

    if(authorizationId!=undefined){
        $('button#saveMain').removeClass('hide');
        db.transaction(function(tx){
                tx.executeSql('SELECT * FROM authorizationKey WHERE key_id='+authorizationId,[],
                function success(tx,rs){
                    auth = rs.rows.item(0).keys;
                });
        },function (error){ console.log("db Error "+error);}, function success(){fillValues();});
    }
    else{

        db.transaction(function(tx){

            tx.executeSql('CREATE TABLE IF NOT EXISTS authorizationValues(id INTEGER,keys,topic,channelID,notificationTitle,notificationMessage,image,icon,soundName,style,picture,summaryText,notID,priority,vibration1,vibration2,vibration3,vibration4,ledA,ledR,ledG,ledB)');
            tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS idx_key_values ON authorizationValues(keys)');
        },function (error){ console.log("db Error "+error);}, function success(){});
        clearValues();
    }
}

function fillValues(){
    db.transaction(function(tx){
                tx.executeSql('SELECT * FROM authorizationValues WHERE keys="'+auth+'"',[],
                function success(tx,rs){
                    $('input#topic').val(rs.rows.item(0).topic);
                    $('input#title').val(rs.rows.item(0).notificationTitle);
                    $('input#message').val(rs.rows.item(0).notificationMessage);
                    $('input#channelID').val(rs.rows.item(0).channelID);
                    $('input#image').val(rs.rows.item(0).image);
                    $('input#icon').val(rs.rows.item(0).icon);
                    $('input#soundName').val(rs.rows.item(0).soundName);

                    $('input#style').val(rs.rows.item(0).style);
                    $('input#picture').val(rs.rows.item(0).picture);
                    $('input#summaryText').val(rs.rows.item(0).summaryText);

                    $('input#notID').val(rs.rows.item(0).notID);
                    $('#priorityButton').val(rs.rows.item(0).priority);
                    $('#priorityButton').text(rs.rows.item(0).priority);

                    $('input#vibration1').val(rs.rows.item(0).vibration1);
                    $('input#vibration2').val(rs.rows.item(0).vibration2);
                    $('input#vibration3').val(rs.rows.item(0).vibration3);
                    $('input#vibration4').val(rs.rows.item(0).vibration4);

                    $('input#ledA').val(rs.rows.item(0).ledA);
                    $('input#ledR').val(rs.rows.item(0).ledR);
                    $('input#ledG').val(rs.rows.item(0).ledG);
                    $('input#ledB').val(rs.rows.item(0).ledB);
                });
    },function (error){ console.log("db Error "+JSON.stringify(error));}, function success(){});
}

function clearValues(){
    $('input#topic').val("/topics/");
    $('input#title').val("");
    $('input#message').val("");
    $('input#channelID').val("");
    $('input#image').val("");
    $('input#icon').val("");
    $('input#soundName').val("default");

    $('input#style').val("picture");

    $('input#notID').val("");

    $("#priorityButton").val("0");
    $("#priorityButton").text("0");
}

function onBackPressed(){
//        window.location.href='index.html';
    if(!inMain){
        navigator.app.exitApp();
        return false;
    }
    inMain=false;
    $('section#homePage').addClass("hide");
    $('section#keyPage').removeClass("hide");
        var options = {
                        "direction"        : "right", // 'left|right|up|down', default 'left' (which is like 'next')
                        "duration"         :  250, // in milliseconds (ms), default 400
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
//                            window.location.href='index.html';
                        },
                        function (error) {
                          alert(msg);
                        }
                      );
}

function sendRequest(where){
    var topic = $('input#topic').val();
    var title = $('input#title').val();
    var message = $('input#message').val();
    var androidChannelID = $('input#channelID').val();
    var image = $('input#image').val();
    var icon = $('input#icon').val();
    var soundName = $('input#soundName').val();

    var style = $('input#style').val();
    var picture = $('input#picture').val();
    var summaryText = $('input#summaryText').val();

    var notID = $('input#notID').val();
    var priority = $("#priorityButton").val();
    var vibrationPattern = [$('#vibration1').val(),$('#vibration2').val(),$('#vibration3').val(),$('#vibration4').val()];

    var ledColor = [$('#ledA').val(),$('#ledR').val(),$('#ledG').val(),$('#ledB').val()];

    insertValues(auth,topic,title,message,androidChannelID,image,icon,soundName,style,picture,summaryText,notID,priority,vibrationPattern,ledColor);

    if(where=="send"){
        if(auth != "0"){
            callPlugin(auth,topic,title,message,androidChannelID,image,icon,soundName,style,picture,summaryText,notID,priority,vibrationPattern,ledColor);
        }
    }
}

function callPlugin(finalKey,topic,title,message,androidChannelID,image,icon,soundName,style,picture,summaryText,notID,priority,vibrationPattern,ledColor){
    console.log("Auth: "+finalKey);
    Cordova.exec(handySuccess,handyError,'HandyNotificationAndroid', 'pushNotification', [finalKey,topic,title,message,androidChannelID,image,icon,soundName,style,picture,summaryText,notID,priority,vibrationPattern,ledColor]);
}

function insertValues(finalKey,topic,title,message,androidChannelID,image,icon,soundName,style,picture,summaryText,notID,priority,vibrationPattern,ledColor){
    var authorizationId;
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM authorizationKey WHERE keys="'+finalKey+'"',[],
            function success(tx,rs){
                authorizationId = rs.rows.item(0).key_id;
                console.log("Not ID: "+notID);
                tx.executeSql('REPLACE INTO authorizationValues VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[authorizationId,finalKey,topic,androidChannelID,title,message,image,icon,soundName,style,picture,summaryText,notID,priority,vibrationPattern[0],vibrationPattern[1],vibrationPattern[2],vibrationPattern[3],ledColor[0],ledColor[1],ledColor[2],ledColor[3]]);
        },function(error){console.log("db Error "+JSON.stringify(error));});
    },function (error){ console.log("db Error "+JSON.stringify(error));}, function success(){});
}


function collapseListener(where){
    if(where == "picture"){
        if(picturePlus){
            picturePlus = false;
            $('i#picturePlus').removeClass('glyphicon-plus-sign');
            $('i#picturePlus').addClass('glyphicon-minus-sign');
        }
        else{
            picturePlus = true;
            $('i#picturePlus').removeClass('glyphicon-minus-sign');
            $('i#picturePlus').addClass('glyphicon-plus-sign');
        }
    }
    else{
        if(optionalPlus){
            optionalPlus = false;
            $('i#optionalPlus').removeClass('glyphicon-plus-sign');
            $('i#optionalPlus').addClass('glyphicon-minus-sign');
        }
        else{
            optionalPlus = true;
            $('i#optionalPlus').removeClass('glyphicon-minus-sign');
            $('i#optionalPlus').addClass('glyphicon-plus-sign');
        }
    }
}

function handySuccess(){}
function handyError(error){
    if(error=="Invalid notID")
        window.plugins.toast.showShortBottom('Please enter a valid notification ID');
}
app.initialize();