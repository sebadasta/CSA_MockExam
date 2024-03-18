function startTimer(duration, display) {
    var start = Date.now(),
      diff,
      hours,
      minutes,
      seconds;
      

    function timer() {
      diff = duration - (((Date.now() - start) / 1000) | 0);
  
      hours = (diff / 3600) | 0;
      minutes = (diff / 60) % 60 | 0;
      seconds = (diff % 60) | 0;
  
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
  
      display.textContent = hours + ":" + minutes + ":" + seconds;
  
      if (diff <= 0) {
        //Something here when timer finishes...
        //start = Date.now() + 1000;
      }
    };
    

    timer();
    setInterval(timer, 1000);
  }

  