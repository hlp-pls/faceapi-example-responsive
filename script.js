

let is_model_loaded = false;
let webcam;

var landmark_points;
var offset;

let cam_width;
let cam_height;
let scale;

console.log(faceapi.nets);

function setup(){
	createCanvas(windowWidth,windowHeight);
	noFill();
	strokeWeight(2);
	//frameRate(30);
	Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('models/'),
	faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/'),
	//faceapi.nets.faceRecognition.loadFromUri('/models'),
	//faceapi.nets.faceExpressionNet.loadFromUri('/models')
	]).then(modelLoaded);
	webcam = createCapture(VIDEO);
	webcam.hide();
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function modelLoaded(){
	console.log("model loaded");
	is_model_loaded = true;

	setInterval(async () => {
		predict();
	},100);
}

function draw(){
	clear();
	if(width>height){
		cam_width = height * webcam.width/webcam.height;
		cam_height = height;

	}else{
		cam_width = width;
		cam_height = width * webcam.height/webcam.width;

	}

	if(width>cam_width){
		scale = width/cam_width;
		cam_width *= scale;
		cam_height *= scale;
	}else if(height>cam_height){
		scale = height/cam_height;
		cam_width *= scale;
		cam_height *= scale;
	}

	if(is_model_loaded){

		image(	webcam,
			width/2-cam_width/2,
			height/2-cam_height/2,
			cam_width,cam_height);

		//if(webcam.changed()){
			
		//}
		
		if(landmark_points){
			beginShape();
			for(let i=0; i<landmark_points.length; i++){
				let x = width/2-cam_width/2+landmark_points[i]._x;
				let y = height/2-cam_height/2+landmark_points[i]._y;
				ellipse(x,y,4,4);
				vertex(x,y);
			}
			endShape();

			//ellipse(offset._x,offset._y,20,20);
		}
	}
	
	//console.log(landmark_points);
}

async function predict(){
	const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 64 })
	const video = document.getElementsByTagName('video')[0];
	const displaySize = { width: cam_width, height: cam_height};
	const detections = await faceapi.detectAllFaces(
			video,
			new faceapi.TinyFaceDetectorOptions(options)
		).withFaceLandmarks(true)
		//console.log(detections)
		//console.log(detections[0].landmarks)
		const resizedDetections = faceapi.resizeResults(detections,displaySize);
	if(resizedDetections&&resizedDetections[0]){
		landmark_points = resizedDetections[0].landmarks._positions;
		offset = resizedDetections[0].landmarks._shift;
			//console.log(resizedDetections[0].landmarks._shift);
	}
} 
