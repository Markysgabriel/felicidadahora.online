;(function(){
  let lagLevel = 0;
  let elm = new Image();
  let interval = setInterval(function(){
    let startTime = new Date().getTime();
    for(let i = 0; i < 1000; i++){
      console.log('%c', elm);
      console.clear();
    }
    let endTime = new Date().getTime();

    if(endTime - startTime > 200){
      lagLevel++;
      if(lagLevel >= 10){
        onDevToolsOpen();
      }
    }else{
    	lagLevel = 0;
    }
  }, 200);

  function onDevToolsOpen(){
    clearInterval(interval);
    console.log('The code for this website has self destructed in your browser for protection from hackers because you opened the console. Have a nice day :D');
    console.log('Please close the console, and go back to the previous page.');
    window.open('/404', '_self');
    let html = document.getElementsByTagName('html');
    for(let i = 0; i < html.length; i++){
      html.remove();
    }
  }

  if(window.devtools.isOpen){
    onDevToolsOpen();
  }

  window.addEventListener('devtoolschange', e => {
    if(e.detail.isOpen){
      onDevToolsOpen();
    }
  });

})();
