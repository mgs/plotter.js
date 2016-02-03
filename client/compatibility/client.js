// Plotter Object
var plotter = {
  buffer: "",
  status: 0,
  error: 0,
  pageWidth: 0,
  pageHeight: 0,
  maxWidth: 0,
  maxHeight: 0,
  p1: 0,
  p2: 0,
  x:  0,
  y:  0,
  penState:  0,
  selectedPen: 0
};

// Serial Functions
function serialWrite(string, callback){
  if(callback){
    Meteor.call("write", string + ";", callback);
  } else {
    Meteor.call("write", string + ";");
  };
};

function serialRead(){
  Meteor.call("read", function(err, data){
    if(err){
      console.log(err);
    } else {
      if(data) {
        plotter.buffer = data;
      };
    };
  });
};

// Maintenance Functions
function initialize(){
  serialWrite("IN");
  outputWindow();
}

function defaults(){
  serialWrite("DF");
  outputWindow();
}

// Helper Functions
function setPageHeight(pageWidth, pageHeight){
  plotter.pageWidth = pageWidth;
  plotter.pageHeight = pageHeight;
};

// Output Functions

function outputError(){
  serialWrite("OE");
  setTimeout(function(){
    serialRead();
  }, 100);
  setTimeout(function(){
    if(plotter.buffer[0]){
      plotter.error = plotter.buffer[0];
    };
  }, 150);
}

function outputStatus(){
  serialWrite("OS");
  setTimeout(function(){
    serialRead();
  }, 100);
  setTimeout(function(){
    plotter.status = plotter.buffer[0];
  }, 150);
}

function outputP1AndP2(){
  serialWrite("OP");
  setTimeout(function(){
    serialRead();
  }, 100);
  setTimeout(function(){
    plotter.p1 = plotter.buffer[0];
    plotter.p2 = plotter.buffer[1];
  }, 150);
};

function outputActual(){
  serialWrite("OA");
  setTimeout(function(){
    serialRead();
  }, 100);
  setTimeout(function(){
    plotter.x = plotter.buffer[0];
    plotter.y = plotter.buffer[1];
    plotter.penState = plotter.buffer[2];
  }, 150);
};

function outputWindow(){
  serialWrite("OW");
  setTimeout(function(){
    serialRead();
  }, 100);
  setTimeout(function(){
    plotter.maxWidth = plotter.buffer[2];
    plotter.maxHeight = plotter.buffer[3];
  }, 150);
};

// Drawing Functions
function penUp(x, y){
  serialWrite("PU" + x + "," + y);
  outputActual();
};

function penDown(x, y){
  serialWrite("PD" + x + "," + y);
  outputActual();
};

function selectPen(penNumber){
  serialWrite("SP" + penNumber);
  plotter.selectedPen = penNumber;
}

// Text Functions
function text(string, x, y, moveArmWhenDone){
  if(x && y){
    penUp(x, y);
  };
  serialWrite("LB" + string + String.fromCharCode(3));
  outputActual();
  if(moveArmWhenDone){
    penUp(plotter.maxWidth, plotter.maxHeight);
  };
};
