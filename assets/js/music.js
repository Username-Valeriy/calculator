var audio = $('audio')[0],
    visualWidth = 318,
    visualHeight = 200,
    coverHolder = $('#cover-holder'),
    cover = $('.song-meta figure img'),
    audioContext = new window.AudioContext(),
    source = audioContext.createMediaElementSource(audio),
    analyser = audioContext.createAnalyser(),
    progressBar = $('#progress-bar'),
    fileInfo = '';

source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 2048;
analyser.minDecibels = -90;
analyser.maxDecibels = 0;

var bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(bufferLength);

var bars = [];

for (var i = 1; i <= 128; i++) {
  bars.push(document.getElementById('bar-' + i));
}

var ScaleBar = {
  min: 10,
  max: visualHeight,
  sum: 0,
  get: function(fromMin, fromMax, valueIn) {
    var toMin = ScaleBar.min,
        toMax = ScaleBar.max;
    //fromMin = (fromMin + (fromMax * .35)) / 2;
    var result = ((toMax - toMin) * (valueIn - fromMin)) / (fromMax - fromMin) + toMin;
    return result;
  }
};

var MusicVisuals = {
  call: null,
  start: function() {
    analyser.getByteFrequencyData(frequencyData);

    var barcc = 0;
    var numberOfBars = 128;
    var steps = numberOfBars;

    for (var increment = 0; increment < numberOfBars * 2; increment += 2) {
      var y = frequencyData[increment];

      barcc++;

      if (barcc > numberOfBars) {
        barcc = 0;
      }

      var bar = bars[barcc];

      if (bar) {
        bar.style.transform = 'translateY(-' + y + 'px)';
      }
    }

    MusicVisuals.call = requestAnimationFrame(MusicVisuals.start);
  },
  stop: function() {
    cancelAnimationFrame(MusicVisuals.call);
  }
};

$('#open-file').on('click', function() {
  $('#file-open').click();
});

$('#file-open').on('change', function(e) {
  var file = e.target.files[0];
  var url = URL.createObjectURL(file);
  audio.src = url;
  $('.box.title .intro').hide();

  ID3.clearAll();

  ID3.loadTags(url, function() {
    var tags = ID3.getAllTags(url);
    document.querySelector('#artist').innerHTML = tags.artist === undefined ? fileInfo.artist || '' : tags.artist;
    document.querySelector('#song').innerHTML = tags.title === undefined ? fileInfo.title || '' : tags.title ;
    var image = tags.picture;
    if (image) {
      var base64String = '';
      for (var i = 0; i < image.data.length; i++) {
        base64String += String.fromCharCode(image.data[i]);
    }
    var pic = new Image();
    pic.onload = function() {
      var colorThief = new ColorThief();
      var palette = colorThief.getPalette(pic, 2);
      $('.bar').css('background-color', 'rgb(' + palette[0].join(',') + ')');
      $('.controls').css('background-color', 'rgb(' + palette[0].join(',') + ')');
      $('.site').css('background-color', 'rgb(' + palette[1].join(',') + ')');
      $('.site').css('color', 'rgb(' + palette[0].join(',') + ')');
      $('#progress-bar').css('background-color', 'rgb(' + palette[1].join(',') + ')');
      $('#play-pause-button').css('color', 'rgb(' + palette[1].join(',') + ')');
      $('#open-file').css('background-color', 'rgb(' + palette[0].join(',') + ')');
      $('#open-file').css('color', 'rgb(' + palette[1].join(',') + ')');
    };
    pic.src = "data:" + image.format + ";base64," + window.btoa(base64String);
    $('#cover')[0].src = "data:" + image.format + ";base64," + window.btoa(base64String);
    }
  }, {
      dataReader: FileAPIReader(file),
      tags: ['artist', 'album', 'title', 'picture']
  });

  audio.play();
});

$('#play-pause-button').on('click', function() {
  audio.paused ? audio.play() : audio.pause();
});

$('audio').on('play', function() {
  $('#play-pause-button span').html('pause');
  MusicVisuals.start();
  cover.css('animation-play-state', 'running');
});

$('audio').on('pause', function() {
  $('#play-pause-button span').html('play_arrow');

  for (var i = 0; i < bars.length; i++) {
    bars[i].style.transform = null;
  }

  MusicVisuals.stop();
  cover.css('animation-play-state', 'paused');
});

$('audio').on('ended', function() {
  MusicVisuals.stop();
  cover.css('animation-play-state', 'paused');
});

var progressWidth = $('.progress').width();

$('audio').on('timeupdate', function() {
  var p = (audio.currentTime / audio.duration) * 100;
  progressBar.css('width', p + '%');
});

$('.progress').on('click', function(e) {
  var mouseX = e.pageX;
  var barX = $(this).position().left;
  var percent = $(this).width() / (e.pageX - barX);
  audio.currentTime = audio.duration / percent;
});
