
document.body.innerHTML = '<style>div{color: grey;text-align:center;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;width:500px;height:100px;}</style><body><div id="loading"><h1>Dot and Slide</h1><p>This could take a while, please give it at least 5 minutes to render.</p><br><h3>Press <strong>?</strong> for shortcut keys</h3></div></body>';
paper.install(window);
window.onload = function() {

document.body.innerHTML = '<style>body {margin: 0px;text-align: center;}</style><canvas resize="true" style="display:block;width:100%;" id="myCanvas"></canvas>';

setquery("fxhash",fxhash);
var initialTime = new Date().getTime();

var canvas = document.getElementById("myCanvas");

paper.setup('myCanvas');
paper.activate();

console.log(tokenData.hash)
console.log($fx.iteration)

canvas.style.background = "white";

//Set a seed value for Perlin
var seed = Math.floor($fx.rand()*10000000000000000);

//initialize perlin noise 
var noise = new perlinNoise3d();
noise.noiseSeed(seed);

/*
//fxparams
$fx.params([
  {
    id: "number_ripples",
    name: "Dahlias",
    type: "number",
    default: R.random_int(1, 2),
    options: {
      min: 0,
      max: 5,
      step: 1,
    },
  },
  {
    id: "Style",
    name: "Style",
    type: "select",
    default: "Vertical Lines",
    options: {
      options: ["Vertical Lines", "Horizontal Lines", "Hex", "Rings", "Diamonds", "Triangles", "Waves"],
    },
  },
  {
    id: "density",
    name: "Density",
    type: "number",
    default: R.random_int(2, 8),
    options: {
      min: 1,
      max: 15,
      step: 1,
    },
  },
  
])
*/





//read in query strings
var qh = new URLSearchParams(window.location.search).get('h'); //high
var qw = new URLSearchParams(window.location.search).get('w'); //wide
var qs = new URLSearchParams(window.location.search).get('scale'); //scale
var qfw = new URLSearchParams(window.location.search).get('framewidth'); //Framewidth
var ql = new URLSearchParams(window.location.search).get('layers'); //layers
var qpw  = new URLSearchParams(window.location.search).get('lw'); //read explode width query string
var qph  = new URLSearchParams(window.location.search).get('lh'); //read explode height query string
var qo = new URLSearchParams(window.location.search).get('orientation'); //change orientation
var qm = new URLSearchParams(window.location.search).get('cutmarks'); //any value turns on cutmarks and hangers
var qc = new URLSearchParams(window.location.search).get('colors'); // number of colors
var qb = new URLSearchParams(window.location.search).get('pattern');// background style
var qf = new URLSearchParams(window.location.search).get('flowers');// Number of dahlias
var testingGo = new URLSearchParams(window.location.search).get('testing');// Run generative tests

var frC = R.random_int(1, 3); //random frame color white, mocha, or rainbow
var orient=R.random_int(1, 4); // decide on orientation 
//orient=2;
var halfsize = R.random_int(1, 5);

//Set the properties for the artwork where 100 = 1 inch
var wide = 800; 
if (halfsize == 1 && orient != 2){wide=400;}
    //if($fx.getParam("aspect_ratio") == "2:5"){wide=400};
    //if($fx.getParam("aspect_ratio") == "1:1"){wide=1000};
    if (qw){wide=qw*100};
var high = 1000; 
    if (qh){high=qh*100};

var scale = 2; 
    if (qs){scale=qs};

var ratio = 1/scale;//use 1/4 for 32x40 - 1/3 for 24x30 - 1/2 for 16x20 - 1/1 for 8x10

var minOffset = ~~(7*ratio); //this is aproximatly .125"
var framewidth = ~~(R.random_int(25, 50)*scale); 
//var framewidth = 50; 
    if (qfw){framewidth=qfw};

var framradius = 0;
var stacks = R.random_int(8, 12);
    //stacks = $fx.getParam("number_layers"); 
    if (ql){stacks=parseInt(ql)};
console.log(stacks+" layers");

// Set a canvas size for when layers are exploded where 100=1in
var panelWide = 1600; if (qpw){panelWide=parseInt(qpw)};  
var panelHigh = 2000; if (qph){panelHigh=parseInt(qph)}; 
 
paper.view.viewSize.width = 2400;
paper.view.viewSize.height = 2400;


var colors = []; var palette = []; 
var petalspiky = R.random_int(5, 15);


numofcolors = R.random_int(2, stacks);; //Sets the number of colors to pick for the pallete
//numofcolors = $fx.getParam("number_colors");
if (qc){numofcolors = qc};
console.log(numofcolors+" colors");

//adjust the canvas dimensions
w=wide;h=high;
//if ($fx.getParam("orientation")=="Landscape"){wide = h;high = w;orientation="Landscape";}
//else if ($fx.getParam("orientation")=="Square"){wide = w;high = w;orientation="Square";}
var orientation="Portrait";

if (orient==1){wide = h;high = w;orientation="Landscape";};
if (orient==2){wide = w;high = w;orientation="Square";};
if (orient==3){wide = w;high = h;orientation="Portrait";};

if (qo=="w"){wide = h;high = w;orientation="Landscape";};
if (qo=="s"){wide = w;high = w;orientation="Square";};
if (qo=="t"){wide = w;high = h;orientation="Portrait";};
console.log(orientation+': '+~~(wide/100/ratio)+' x '+~~(high/100/ratio))   


//setup the project variables


//Pick layer colors from a random pallete based on tint library
for (var c=0; c<numofcolors; c=c+1){palette[c] = tints[R.random_int(0, tints.length-1)];};    

//randomly assign colors to layers
for (var c=0; c<stacks; c=c+1){colors[c] = palette[R.random_int(0, palette.length)];};

//or alternate colors
p=0;for (var c=0; c<stacks; c=c+1){colors[c] = palette[p];p=p+1;if(p==palette.length){p=0};}

//Pick frame color

if (frC==1){colors[stacks-1]={"Hex":"#FFFFFF", "Name":"Smooth White"}};
if (frC==2){colors[stacks-1]={"Hex":"#4C4638", "Name":"Mocha"}};
    
//Set the line color
linecolor={"Hex":"#4C4638", "Name":"Mocha"};

//colors[stacks-2]={"Hex":"#FFFFFF", "Name":"Smooth White"};


//************* Draw the layers ************* 


sheet = []; //This will hold each layer
var punchX =[];


var px=0;var py=0;var pz=0;var prange=.1; 

var center = new Point(wide/2,high/2)

var punchRadius = R.random_int(20, 75);
var wgrid = ~~((wide-framewidth*2)/((wide-framewidth*2)/(punchRadius+minOffset*3)))
var hgrid = ~~((high-framewidth*2)/((high-framewidth*2)/(punchRadius+minOffset*3)))

    console.log(wide-framewidth*2,punchRadius, wgrid,hgrid);
var xshift = (wide-framewidth*2)%wgrid;
var yshift = (high-framewidth*2)%hgrid;
console.log(xshift,yshift)    
var xstart = ~~(framewidth+wgrid/2)+xshift/2
var ystart = ~~(framewidth+hgrid/2)+yshift/2
var segments =[]
var punchDepth = R.random_num(.3, .6);
var slideChance = R.random_num(.3, .6);
console.log(punchDepth, slideChance)
//---- Draw the Layers

//var lineswidth= 5+fxrand()*10
for (z = 0; z < stacks; z++) {
    pz=z*prange;
    drawFrame(z); // Draw the initial frame
    solid(z)
    var punchOffset = ~~(punchRadius/(stacks-1))
    pR = ~~(punchRadius-(punchOffset*(stacks-z-1)));
   
       if (z > 0 ) {
        
        for (xg=xstart; xg<wide-framewidth; xg=xg+wgrid){
            punchX[xg]=[];
            px=xg*prange;
            for (yg=ystart; yg<high-framewidth; yg=yg+hgrid){
                py=yg*prange;
            
                if (punchX[xg][yg] == null ){
                    if (noise.get(px,py,pz)<punchDepth){punchX[xg][yg]=1;}
                }
                
                if (punchX[xg][yg] != 1 ){
                    if (pR>2){punchout(xg,yg,pR,pR,z)}
                };
                
                if (noise.get(xg,yg,z)>slideChance && z==stacks-1 ){
                    if (noise.get(px,py,z)<.5 && xg<wide-framewidth*2-wgrid){
                        hslide(xg,yg,pR,pR,z,R.random_int(2, 2))
                        };
                        if (noise.get(px,py,z)>.5 && yg<high-framewidth*2-hgrid){
                            vslide(xg,yg,pR,pR,z,R.random_int(2, 2))
                        };
                    
                }
                


        }
        }
     }

         //-----Draw each layer
        if(z<stacks-1 && z!=-1 ){
            if (z==stacks-2){oset = minOffset}else{oset = ~~(minOffset*(stacks-z-1))}
            
            
            
            
            

        }
        
    frameIt(z);// finish the layer with a final frame cleanup 

    cutMarks(z);
    hanger(z);// add cut marks and hanger holes
    if (z == stacks-1) {signature(z);}// sign the top layer
    sheet[z].scale(2.3);
    sheet[z].position = new Point(paper.view.viewSize.width/2, paper.view.viewSize.height/2);
   
    var group = new Group(sheet[z]);
    
    console.log(z)//Show layer completed in console


    

    
    
}//end z loop

//--------- Finish up the preview ----------------------- 

    // Build the features and trigger an fxhash preview
    var features = {};
    features.Size =  ~~(wide/100/ratio)+" x "+~~(high/100/ratio)+" inches";
    //features.Orientation = orientation;
    //features.Dahlias = numberofcircles;
    //features.Background = backgrounds;
    for (l=stacks;l>0;l--){
    var key = "layer: "+(stacks-l+1)
    features[key] = colors[l-1].Name
    }
    console.log(features);
    $fx.features(features);
    //$fx.preview();

    
    upspirestudio(features); //#render and send features to upspire.studio


      var finalTime = new Date().getTime();
    var renderTime = (finalTime - initialTime)/1000
    console.log ('this took : ' +  renderTime.toFixed(2) + ' seconds' );


        if (testingGo == 'true'){refreshit();}

        async function refreshit() {
        //setquery("fxhash",null);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        canvas.toBlob(function(blob) {saveAs(blob, tokenData.hash+' - '+renderTime.toFixed(0)+'secs.png');});
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        window.open('file:///Users/shawnkemp/dev/dotandslide/DotandSlide/index.html?testing=true', '_blank');
        }

//vvvvvvvvvvvvvvv PROJECT FUNCTIONS vvvvvvvvvvvvvvv 
 
function punchout(x,y,w,h,z){
    //var hole = new Path.Circle(new Point(x, y),r);
    
    if (w==h) {cr = w};
    if (w > h) {cr = h/2};
    if (w < h) {cr = w/2};
    var hole = new Path.Rectangle(new Point(x, y),new Size(w,h),cr )
    hole.position = new Point(x,y);
    cut(z,hole)

    
}

function vslide(x,y,w,h,z,s){
    //var hole = new Path.Circle(new Point(x, y),r);
    
    cr=w/2;
    var hole = new Path.Rectangle(new Point(x, y),new Size(w,h*s+minOffset*2-2),cr )
    hole.position = new Point(x,y+hgrid/2);
    if (s==3){hole.position = new Point(x,y+hgrid);}
    cut(z,hole)
 
}

function hslide(x,y,w,h,z,s){
    //var hole = new Path.Circle(new Point(x, y),r);
    
    cr=h/2;
    var hole = new Path.Rectangle(new Point(x, y),new Size(w*s+minOffset*2-2,h),cr )
    hole.position = new Point(x+wgrid/2,y);
    if (s==3){hole.position = new Point(x+wgrid,y);}
    cut(z,hole)
 
}


//^^^^^^^^^^^^^ END PROJECT FUNCTIONS ^^^^^^^^^^^^^ 




//--------- Helper functions ----------------------- 



function rangeInt(range,x,y,z){
    var v = ~~(range-(noise.get(x,y,z)*range*2));
    return (v);
}

// Add shape s to sheet z
function join(z,s){
    sheet[z] = (s.unite(sheet[z]));
    s.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

// Subtract shape s from sheet z
function cut(z,s){
    sheet[z] = sheet[z].subtract(s);
    s.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}

function drawFrame(z){
    var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
    var insideframe = new Path.Rectangle(new Point(framewidth, framewidth),new Size(wide-framewidth*2, high-framewidth*2)) 
    //var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2);
    //var insideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2-framewidth);


    sheet[z] = outsideframe.subtract(insideframe);
    outsideframe.remove();insideframe.remove();
}


function solid(z){ 
    outsideframe = new Path.Rectangle(new Point(1,1),new Size(wide-1, high-1), framradius)
    //outsideframe = new Path.Circle(new Point(wide/2),wide/2)
    sheet[z] = sheet[z].unite(outsideframe);
    outsideframe.remove();
    project.activeLayer.children[project.activeLayer.children.length-2].remove();
}



function frameIt(z){
        //Trim to size
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
        //var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2);
        sheet[z] = outsideframe.intersect(sheet[z]);
        outsideframe.remove();
        project.activeLayer.children[project.activeLayer.children.length-2].remove();

        //Make sure there is still a solid frame
        var outsideframe = new Path.Rectangle(new Point(0, 0),new Size(wide, high), framradius)
        var insideframe = new Path.Rectangle(new Point(framewidth, framewidth),new Size(wide-framewidth*2, high-framewidth*2)) 
        //var outsideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2);
        //var insideframe = new Path.Circle(new Point(wide/2, wide/2),wide/2-framewidth);

        var frame = outsideframe.subtract(insideframe);
        outsideframe.remove();insideframe.remove();
        sheet[z] = sheet[z].unite(frame);
        frame.remove();
        project.activeLayer.children[project.activeLayer.children.length-2].remove();
         
        
        sheet[z].style = {fillColor: colors[z].Hex, strokeColor: linecolor.Hex, strokeWidth: 1*ratio,shadowColor: new Color(0,0,0,[0.3]),shadowBlur: 20,shadowOffset: new Point((stacks-z)*2.3, (stacks-z)*2.3)};
}

function cutMarks(z){
    if (z<stacks-1 && z!=0) {
          for (etch=0;etch<stacks-z;etch++){
                var layerEtch = new Path.Circle(new Point(50+etch*10,25),2)
                cut(z,layerEtch)
            } 
        }
}

function signature(z){
    shawn = new CompoundPath(sig);
    shawn.strokeColor = 'green';
    shawn.fillColor = 'green';
    shawn.strokeWidth = 1;
    shawn.scale(ratio*.9)
    shawn.position = new Point(wide-framewidth-~~(shawn.bounds.width/2), high-framewidth+~~(shawn.bounds.height));
    cut(z,shawn)
}

function hanger (z){
    if (z < stacks-2 && scale>0){
        var r = 30*ratio;
        if (z<3){r = 19*ratio}
        var layerEtch = new Path.Circle(new Point(wide/2,framewidth/2),r)
        cut(z,layerEtch)
        //var layerEtch = new Path.Circle(new Point(wide/2,high-framewidth/2),r)
        //cut(z,layerEtch)
        if (scale>0){var layerEtch = new Path.Circle(new Point(framewidth/2,high/2),r)
        cut(z,layerEtch)
        var layerEtch = new Path.Circle(new Point(wide-framewidth/2,high/2),r)
        cut(z,layerEtch)}
    }
}




//--------- Interaction functions -----------------------
var interactiontext = "Interactions\nB = Blueprint mode\nV = Export SVG\nP = Export PNG\nC = Export colors as TXT\nE = Show layers\n"

view.onDoubleClick = function(event) {
    console.log("png")
    canvas.toBlob(function(blob) {saveAs(blob, tokenData.hash+'.png');});
};

document.addEventListener('keypress', (event) => {

       //Save as SVG 
       if(event.key == "v") {
            fileName = tokenData.hash;
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
            var key = [];for (l=stacks;l>0;l--){key[stacks-l] = colors[l-1].Name;}; 
            var svg1 = "<!--"+key+"-->" + paper.project.exportSVG({asString:true})
            var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg1);
            var link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();
            }


       //Format for Lightburn
       if(event.key == "b") {
            for (z=0;z<stacks;z++){
                sheet[z].style = {fillColor: null,strokeWidth: .1,strokeColor: lightburn[stacks-z-1].Hex,shadowColor: null,shadowBlur: null,shadowOffset: null}
                sheet[z].selected = true;}
            }

        //new hash
       if(event.key == " ") {
            setquery("fxhash",null);
            location.reload();
            }

            //toggle half vs full width
            if(event.key == "0") {
            if(w){setquery("w",null);}
            if(wide==800) {setquery("w","4");}
            location.reload();
            }

        //scale
       if(event.key == "1" || event.key =="2" ||event.key =="3" || event.key =="4") {
            setquery("scale",event.key);
            setquery("w",5.6);
            setquery("h",7);
            setquery("cutmarks",1);
            location.reload();
            }

        //oriantation
       if(event.key == "w" || event.key =="t" ||event.key =="s" ) {
            setquery("orientation",event.key);
            location.reload();
            }

        //help
       if(event.key == "h" || event.key == "/") {
            alert(interactiontext);
            }

  

            //layers
       if(event.key == "l") {
            var l = prompt("How many layers", stacks);
            setquery("layers",l);
            location.reload();
            }
        
        
        //Save as PNG
        if(event.key == "p") {
            canvas.toBlob(function(blob) {saveAs(blob, tokenData.hash+'.png');});
            }

        //Export colors as txt
        if(event.key == "c") {
            var key = [];
            for (l=stacks;l>0;l--){
                key[stacks-l] =  colors[l-1].Name;
            }; 
            console.log(key.reverse())
            var content = JSON.stringify(key.reverse())
            var filename = tokenData.hash + ".txt";
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            saveAs(blob, filename);
            }


       //Explode the layers     
       if(event.key == "e") {     
            h=0;t=0;maxwidth=3000;
               for (z=0; z<sheet.length; z++) { 
               sheet[z].scale(1000/2300)   
               sheet[z].position = new Point(wide/2,high/2);        
                    sheet[z].position.x += wide*h;
                    sheet[z].position.y += high*t;
                    sheet[z].selected = true;
                    if (wide*(h+2) > panelWide) {maxwidth=wide*(h+1);h=0;t++;} else{h++};
                    }  
            paper.view.viewSize.width = maxwidth;
            paper.view.viewSize.height = high*(t+1);
           }
 
}, false); 
}