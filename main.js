const ladybirdCanvas=document.getElementById("ladybirdCanvas");
ladybirdCanvas.width=600;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const ladybirdCtx = ladybirdCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(ladybirdCanvas.width/2,ladybirdCanvas.width*0.9);

const N=100;
const ladybugs=generateLadybugs(N);
let bestLadybird=ladybugs[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<ladybugs.length;i++){
        ladybugs[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(ladybugs[i].brain,0.1);
        }
    }
}

const traffic=[
    new Ladybird(road.getLaneCenter(1),-100,60,60,"DUMMY",2,getRandomColor()),
    new Ladybird(road.getLaneCenter(0),-300,60,60,"DUMMY",2,getRandomColor()),
    new Ladybird(road.getLaneCenter(2),-300,60,60,"DUMMY",2,getRandomColor()),
    new Ladybird(road.getLaneCenter(0),-500,60,60,"DUMMY",2,getRandomColor()),
    new Ladybird(road.getLaneCenter(1),-500,60,60,"DUMMY",2,getRandomColor()),
    new Ladybird(road.getLaneCenter(1),-700,60,60,"DUMMY",2,getRandomColor()),
    new Ladybird(road.getLaneCenter(2),-700,60,60,"DUMMY",2,getRandomColor()),
];

animate();



function generateLadybugs(N){
    const ladybugs=[];
    for(let i=1;i<=N;i++){
        ladybugs.push(new Ladybird(road.getLaneCenter(1),100,60,60,"AI"));
    }
    return ladybugs;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<ladybugs.length;i++){
        ladybugs[i].update(road.borders,traffic);
    }
    bestLadybird=ladybugs.find(
        c=>c.y==Math.min(
            ...ladybugs.map(c=>c.y)
        ));

    ladybirdCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    ladybirdCtx.save();
    ladybirdCtx.translate(0,-bestLadybird.y+ladybirdCanvas.height*0.7);

    road.draw(ladybirdCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ladybirdCtx);
    }
    ladybirdCtx.globalAlpha=0.2;
    for(let i=0;i<ladybugs.length;i++){
        ladybugs[i].draw(ladybirdCtx);
    }
    ladybirdCtx.globalAlpha=1;
    bestLadybird.draw(ladybirdCtx,true);

    ladybirdCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestLadybird.brain);
    requestAnimationFrame(animate);
}