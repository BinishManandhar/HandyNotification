var app = {
    initialize: function(){
        document.addEventListener('deviceready',this.onDeviceReady);
    },
    onDeviceReady: function(){
        var duration = 0.5, // animation time in seconds
                direction = "right"; // animation direction - left | right | top | bottom
        nativetransitions.flip(duration, direction, onComplete);
    }
}

function onComplete(){}

app.initialize();