
$(document).ready(function() {
	$(window).trigger('resize');
  var index = 1;
  var recording = false;
  var duration;
  var h = window.innerHeight;
  var w = window.innerWidth;
 // var dial;
 // $('body').css('height', h-100);
 // $('.container').css({
 //   height: h,
 // });
 $('#recording').hide();
//     //$('#visualize').css('top',(h-400));

    $('.container').css({
   height: h,
   width: w,
 })
// $('html').css({
//    height: h,
//    width: w,
//  })

// $('body').css({
//    height: h,
//    width: w,
//  })

 $('#visualize').css('top',(h-400));

  $(window).resize(function(){
    console.log('resizing');
    h = window.innerHeight;
   w = window.innerWidth;
   $('.container').css({
   height: h,
   width: w,
 })
// $('html').css({
//    height: h,
//    width: w,
//  })

// $('body').css({
//    height: h,
//    width: w,
//  })

 $('#visualize').css('top',(h-400));
  })
  var canvas = document.getElementById('visualize');
  canvas.width = w;

  
  
  var knob_config = {
    'width' : 65,
    'fgColor' : ' #60604F',
    'bgColor' : '#B1B0A7',
    'displayInput' : false,
    'thickness' : .1,
    'readOnly' : true
  };

var source, gainnode, filter, analyser;
	function hasUserMedia(){
		return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
	}
		navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

                          function errorCallback(e){
                          	console.log('Erroneous Script!', e)
                          }

                         window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();


          if(hasUserMedia())
          {
          	navigator.getUserMedia({audio : true}, function(stream){
          		
          		source = context.createMediaStreamSource(stream);
              gainnode = context.createGainNode();
              analyser = context.createAnalyser();
              filter = context.createBiquadFilter();
              filter.type = filter.LOWSHELF;
              filter.frequency.value = 440;
filter.Q.value = 0;
filter.gain.value = 0;
              source.connect(filter);
              filter.connect(gainnode);
              gainnode.connect(analyser);
              gainnode.gain.value = 1.3;
              
             // source.connect(context.destination);

              recorder = new Recorder(gainnode,{workerPath : "recorderWorker.js"});
              setTimer();
          	}, errorCallback)
          }
          else
          	alert("getUserMedia() not supported");

          function updateDuration(){
            var sec = $('#second');
            var min = $('#minute');
            var secval = (parseInt(sec.text())+1)%60;
            var minval = parseInt(min.text());
            if(secval==0){
              minval++;
              if(minval<10)
                min.text('0'+minval);
              else
                min.text(minval);
              sec.text('00');
            }
            else if(secval<10)
              {sec.text('0'+secval)}
            else
              sec.text(secval);

          }


          function createDownloadFile(){
            recorder.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      var audio = document.createElement('audio');
      audio.controls = false;
      audio.src = url;
      audio.setAttribute('id',index);
      // var dumy = document.getElementById('dummy');
      // dumy.appendChild(audio);
      //document.body.appendChild(audio);
      // audio.play();
      var newfile = $('#dummy').clone(true, true).css('display', 'block').appendTo('.recordlist').attr('id', 'file'+index);
      var newfileDOM = document.getElementById('file'+index);
      newfileDOM.appendChild(audio);
      var filename = "Recording "+index;
      //var i = audio.getAttribute('id');
     var dial = newfile.find('.dial');
      dial.knob({
    'width' : 65,
    'fgColor' : ' #848271',
    'bgColor' : '#B1B0A7',
    'displayInput' : false,
    'thickness' : .1,
    change : function(v){console.log('value : '+v);},
    'max' : duration,
    'min' : 0,
    'readOnly' : true
  });

     audio.addEventListener('timeupdate', function(){
      var i = this.getAttribute('id');
      var x = "#file"+i;
      var dial = $(x).find('.dial');
        var time = Math.round((audio.currentTime));
        console.log(dial.val());
        dial.val(time).trigger('change');
      });
      newfile.find('.dload').attr('href',url).attr('download',filename+".wav").children('.index').text(index);
      newfile.animate({'left': '0px'},250 );
      
      index++;
      console.log('audio tag generated and its src is'+audio.src)
    })
          }

          function beginRecording(){
            recorder.record();
            $('#recording').show('slow');
             timer1 = setInterval(updateDuration, 1000);
          }

          function stopRecording(){
            recorder.stop();
             $('#recording').hide('slow');
             if(timer1)
              clearInterval(timer1);
            duration = parseInt($('#minute').text())*60+parseInt(  $('#second').text());
         
           $('#second').text('00');
           $('#minute').text('00');
           createDownloadFile();
             recorder.clear();
          }




         $('.button[data-active=false]').on('click',function(event) {
           recording = true;
           console.log('recording : '+recording);
           $(this).css('display','none');
           $(this).next().css('display','block');
           beginRecording();
         })

          $('.button[data-active=true]').on('click',function(event) {
           recording = false;
           console.log('recording : '+recording);
           $(this).css('display','none');
           $(this).prev().css('display','block');
           stopRecording();
         })


          $('.recordlist').delegate('.file > div > canvas', 'click', function(event) {
  console.log('player clicked');
  var controls = $(this).parent().parent().children('.controls');
  var play = controls.children('.play');
  var pause = controls.children('.pause');
  //var dial = controls.siblings('.dial');
  var sound = controls.siblings('audio').get(0);
  var playing = false;
  var knob_update;
  if(play.css('display') == 'none')
    playing = true;
  if(playing){
    sound.pause();

    play.css('display', 'block');
    pause.css('display', 'none');
  }
  else
  {
      sound.play();
     
    play.css('display', 'none');
    pause.css('display', 'block');
  }

  sound.addEventListener('ended', function(){
     play.css('display', 'block');
    pause.css('display', 'none');
    //dial.val(0).trigger('change');
    playing = false;
  })



 

})
          function setTimer(){
          var visual_time = setInterval(draw, 10);}
var canvas_context = canvas.getContext('2d');
  function draw(){
    var width, height, barWidth, barHeight, barSpacing, frequencyData, barCount, loopStep, i, hue;
   
    width = canvas.width;
    height = canvas.height;
    barWidth = 10;
    barSpacing = 2;
    canvas_context.clearRect(0,0,width, height);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    barCount = Math.round(width / (barWidth + barSpacing));
    loopStep = Math.floor(frequencyData.length / barCount);

    for (i = 0; i < barCount; i++) {
        barHeight = frequencyData[i * loopStep];
        //barHeight = (barHeight>0)?barHeight+60:barHeight;
                hue = parseInt(120 * (1 - (barHeight / 255)), 10);
                if(recording)
        canvas_context.fillStyle = 'hsl(' + hue + ',75%,50%)';
      else
        canvas_context.fillStyle = '#9E9C8D'
        canvas_context.fillRect(((barWidth + barSpacing) * i) + (barSpacing / 2), height, barWidth - barSpacing, -barHeight);
    }

  }

        });