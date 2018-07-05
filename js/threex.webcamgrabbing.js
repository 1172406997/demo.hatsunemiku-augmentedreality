var THREEx = THREEx || {}

// shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

/**
 * Grab camera
 */
THREEx.WebcamGrabbing = function(){

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
        // create video element
        var domElement        = document.createElement('video')
        domElement.setAttribute('autoplay', true)

	// window.domElement = video
	domElement.style.zIndex = -1;
        domElement.style.position = 'absolute'

	// domElement.style.top = '50%'
	// domElement.style.left = '50%'
	// domElement.style.marginRight = '50%'
	// domElement.style.transform = 'translate(-50%, -50%)'
	// domElement.style.minWidth = '100%'

	domElement.style.top = '0px'
	domElement.style.left = '0px'
	domElement.style.width = '100%'
	domElement.style.height = '100%'

        /**
         * Resize video element.
         * - Made complex to handle the aspect change
         * - it is frequently when the mobile is changing orientation
         * - after a search on the internet, it seems hard/impossible to prevent browser from changing orientation
         */
        function onResize(){
                // is the size of the video available ?
                if( domElement.videoHeight === 0 )   return

                var videoAspect = domElement.videoWidth / domElement.videoHeight
                var windowAspect = window.innerWidth / window.innerHeight

                // var video = document.querySelector('video')
//                 if( videoAspect < windowAspect ){
//                         domElement.style.left        = '0%'
//                         domElement.style.width       = window.innerWidth + 'px'
//                         domElement.style.marginLeft  = '0px'
//
//                         domElement.style.top         = '50%'
//                         domElement.style.height      =  (window.innerWidth/videoAspect) + 'px'
//                         domElement.style.marginTop   = -(window.innerWidth/videoAspect) /2 + 'px'
// console.log('videoAspect <<<<< windowAspect')
//                 }else{
//                         domElement.style.top         = '0%'
//                         domElement.style.height      = window.innerHeight+'px'
//                         domElement.style.marginTop   =  '0px'
//
//                         domElement.style.left        = '50%'
//                         domElement.style.width       =  (window.innerHeight*videoAspect) + 'px'
//                         domElement.style.marginLeft  = -(window.innerHeight*videoAspect)/2 + 'px'
// console.log('videoAspect >>>> windowAspect')
//                 }
        }

        window.addEventListener('resize', function(event){
                onResize()
        })

        // just to be sure - resize on mobile is funky to say the least
        setInterval(function(){
                onResize()
        }, 500)

        // get the media sources
        
        navigator.mediaDevices.enumerateDevices().then(function(sourceInfos) {
//      MediaStreamTrack.getSources(function(sourceInfos) {
                // define getUserMedia() constraints
//              alert(1)
				var videoidx = 0
                var constraints = {
                        video: true,
                        audio: false,
                }
                // to mirror the video element when it isnt 'environment'
                // domElement.style.transform   = 'scaleX(-1)'
                console.log("sourceInfos",sourceInfos)
				
                // it it finds the videoSource 'environment', modify constraints.video
                for (var i = 0; i != sourceInfos.length; ++i) {
                        var sourceInfo = sourceInfos[i];
//                      alert(sourceInfo.kind)
                        if(sourceInfo.kind == "videoinput" && sourceInfo.facing == "environment") {
//                      	alert("里层",sourceInfo.kind)
                                constraints.video = {
                                        optional: [{sourceId: sourceInfo.id}]
                                }
                                // not to mirror the video element when it is 'environment'
                                // domElement.style.transform   = ''
                        }else if(sourceInfo.kind == "videoinput" && sourceInfo.facing != "environment"){
                        	++videoidx
                        }
                }
                if(videoidx>1){
                	constraints.video = { facingMode: { exact: "environment" } }
                }

                // try to get user media
                 
                navigator.mediaDevices.getUserMedia( constraints).then(function(stream){
                	var video=document.querySelector("video")
					video.src=URL.createObjectURL(stream);
                }).catch(function(error) {
                        console.error("Cant getUserMedia()! due to ", error);
                        alert("error",error)
                });
        });

	this.domElement = domElement
}
