const {Player, stringToDataUrl } = TextAliveApp;

//create the player object
const player = new Player ({
  
  app: {token: "JKw2Ez69oKugTaqU" }, 
  mediaElement: document.querySelector("#media"), 
  mediaBannerPosition: "bottom left"
  
});



//ADD LISTENER AND LOAD SONG INFORMATION
player.addListener({
  onAppReady,
  onAppMediaChange,
  onVideoReady,
  onTimerReady,
  onTimeUpdate,
  onPlay,
  onPause
});



const loading = document.querySelector("#loading");
const textContainer = document.querySelector("#text");


const len = document.querySelector('#len');
const mikustick = document.querySelector('#mikustick');
const rinstick = document.querySelector('#rinstick');
const lukastick = document.querySelector('#lukastick');
const meikostick = document.querySelector('#meikostick');
const kaitostick = document.querySelector('#kaitostick');

//seekbar info
const seekbar = document.querySelector("#seekbar");
const progressbar = seekbar.querySelector("div");

//scorebar info
const scorebar = document.querySelector("#scorebar");
const pointbar = scorebar.querySelector("div");

//beat and character
let b, c;
let count = 0;
let points = 0;
let stop = false;
let pause = false;




  
//when the app is ready, create the song
function onAppReady(app) {
      if (app.managed) {
        document.querySelector("#player").className = "disabled";
      }
    
      if (!app.songUrl) {
        //play song
        document.querySelector("#media").className = "disabled";
        
        player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
          video: {
            beatId: 4592293,
            chordId: 2727635,
            repetitiveSegmentId: 2824326,
            lyricId: 59415,
            lyricDiffId: 13962
          }
        });
        
      }  
}
  
//called when the song changes
function onAppMediaChange() {
      // Reset screen display
      loading.className = "";
      len.className = "";
      mikustick.className = "";
      rinstick.className = "";
      lukastick.className = "";
      meikostick.className = "";
      kaitostick.className = "";
      resetChars();
}
  
//called when the video is ready, displays artist and song name
function onVideoReady(video){
    document.querySelector("#artist span").textContent = player.data.song.artist.name;
    document.querySelector("#song span").textContent = player.data.song.name;  
    
    c = null;
}
  
  
//called when playback control is available
function onTimerReady() {
    loading.className = "disabled";
    len.className = "";
    mikustick.className = ""; 
    rinstick.className = "";
    lukastick.className = "";
    meikostick.className = "";
    kaitostick.className = "";
    document.querySelector("#player > a#play").className = "";
    document.querySelector("#player > a#stop").className = "";

    
    
}



  
//UPDATING THE SEEKBAR/PROGRESS BAR AND LYRICS
function onTimeUpdate(position) {
    progressbar.style.width = `${ parseInt((position * 1000) / player.video.duration) / 10 }%`;
 
    //Get current beat information
    let beat = player.findBeat(position);
    if (b !== beat) {
      if (beat) {
        
        
        //active makes len jump on beat
        requestAnimationFrame(() => {
          len.className = "active";
          mikustick.className = "active";
          rinstick.className = "active";
          lukastick.className = "active";
          meikostick.className = "active";
          kaitostick.className = "active";
          requestAnimationFrame(() => {
            len.className = "beat";
            mikustick.className = "beat";
            rinstick.className = "beat";
            lukastick.className = "beat";
            meikostick.className = "beat";
            kaitostick.className = "beat";
          });
        });

      }
      b = beat;
    }
  
  //display lyrics by char
  
    // if there are no lyrics, processing ends here
    if (!player.video.firstChar) {
      return;
    }

    // Reset the lyrics display if rewound
  
    if (c && c.startTime > position) {
      resetChars();
    }
    

    // Get the character that will be spoken
    let current = c || player.video.firstChar;
    while (current && current.startTime < position) {
      // New letter is about to be spoken
      if (c !== current) {
        newChar(current);
        c = current;
      }
      current = current.next;
    }
  
  
    //phrase informatoin
    let p = player.video.firstPhrase;
        while(p && p.next) {
            p = p.next;
        }
    
}


//PLAY
function onPlay() {
    const a = document.querySelector("#player > a#play");
    //console.log("play");
    while (a.firstChild) a.removeChild(a.firstChild); 
    a.appendChild(document.createTextNode("►"));
  pause = false;
}
    
//PAUSE
function onPause() {
  
    const a = document.querySelector("#player > a#play");
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(document.createTextNode("►"));
  pause = true;
  
}
  


//PLAY/PAUSE

document.querySelector("#player > a#play").addEventListener("click", (e) => {
  e.preventDefault();
  if(player) {
    if(player.isPlaying) {
      /*
      player.requestPause();
      len.className = "";
      mikustick.className = "";
      rinstick.className = "";
      lukastick.className = "";
      meikostick.className = "";
      kaitostick.className = "";
      */
    } else {
      player.requestPlay();
    }
  }
  return false;
});


//STOP
document.querySelector("#player > a#stop").addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    player.requestStop();
    len.className = "";
    mikustick.className = "";
    rinstick.className = "";
    lukastick.className = "";
    meikostick.className = "";
    kaitostick.className = "";
    points = 0;
    count = 0;
    pointbar.style.height = parseInt(0) + 'px';
    //progressbar.style.height = parseInt(0) + 'px';
    stop = true;
  }
  return false;
});


//when you click on text, points go up
//called when a new character is vocalized
function newChar(current) {
  let phrase = player.video.phrases[count];
  
  
  const container = document.createElement("span");
  container.appendChild(document.createTextNode(current.text));
  
  
  
  //if it gets too long, reset
  if(count == 0) {
    if(textContainer.textContent.length > 37 && !stop) {
      console.log(count);
      console.log(textContainer.textContent);
      console.log((phrase).toString());
      resetChars();
      count++;
      console.log("FIRST TRY");
    } else if (textContainer.textContent.length > 17 && stop) {
      console.log(count);
      console.log(textContainer.textContent);
      console.log((phrase).toString());
      resetChars();
      count++;
      console.log("FIRST TRY WITH STOP");      
    }
  } else if(textContainer.textContent.length == phrase.toString().length) {
    console.log(count);
    console.log(textContainer.textContent);
    console.log((phrase).toString());
    
    resetChars();
    count++;
    //Icanbea“SUPERHERO” - 18 char
  }
  
  
  textContainer.appendChild(container);

  
  
  container.addEventListener('click', function(e) {
    
  
  if(!pause) {
    if(e.target.innerHTML != '❤') {
      points += 5;
      if(pointbar.offsetHeight < 500) {
        pointbar.style.height = parseInt(points)/3 + 'px';
      }
      //console.log(points); 
      //pointbar.style.height = `${parseInt(points)}`;
    }
    //console.log(e.target);
    
    e.target.innerHTML = '❤';
  }
    
  
  /*
    //console.log(e.target.parentNode.firstChild);
    console.log(e.target.parentNode.firstChild.length);
  
  if(e.target.parentNode.firstChild.length === 3) {
    console.log(e.target.parentNode.removeChild(e.target));    
  } else {
    console.log("else");
  }

    //textContainer.removeChild(e.target);
*/    
    
 
}, false);
  
  
  
}



/* 
textContainer.querySelector("span").onclick = changeColor;
function changeColor() {
  textContainer.querySelector("span").body.style.color = "purple";
  return false;
}
*/ 

//reset lyrics view
function resetChars() {
  c = null;
  while (textContainer.firstChild)
    textContainer.removeChild(textContainer.firstChild);
}

