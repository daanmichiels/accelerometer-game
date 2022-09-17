function drawFrame() {

    window.requestAnimationFrame(drawFrame);
}

function go() {
    console.log('hello');

    let canvas = document.getElementById('game');
    let context = canvas.getContext('2d');

    let wrapper = canvas.parentNode;
    canvas.setAttribute("width", document.body.clientWidth.toString());
    canvas.setAttribute("height", document.body.clientHeight.toString());

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 20;
    console.log(centerX, centerY);
    console.log('radius', radius);

    let t0 = 0;
    let ax = 0;
    let ay = 0;
    let vx = 0;
    let vy = 0;
    let px = 0;
    let py = 0;

    function drawFrame(t1) {
        let dt = t1 - t0;
        dt = Math.min(dt, 100);  // below 10fps, game slows down
        t0 = t1;
        
        context.beginPath();
        context.fillStyle = "rgb(116,158,194)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.stroke();

        vx += dt * ax * 0.01;
        vy += dt * ay * 0.01;
        px += dt * vx * 0.05;
        py += dt * vy * 0.05;
        if (px <= (-canvas.width / 2 + radius)) {
            px = -canvas.width / 2 + radius;
            vx *= -0.4;
        }
        if (px >= (+canvas.width / 2 - radius)) {
            px = +canvas.width / 2 - radius;
            vx *= -0.4;
        }
        if (py <= (-canvas.height / 2 + radius)) {
            py = -canvas.height / 2 + radius;
            vy *= -0.4;
        }
        if (py >= (+canvas.height / 2 - radius)) {
            py = +canvas.height / 2 - radius;
            vy *= -0.4;
        }
        let centerX = canvas.width / 2 + px;
        let centerY = canvas.height / 2 + py;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#e7e8e8';
        context.fill();

        window.requestAnimationFrame(drawFrame);
    }

    function handleMotion(event) {
        let a = event.accelerationIncludingGravity;
        ax = -a.x;
        ay = a.y;
        // console.log(event);
    }

    document.getElementById('btn-start').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('clicked');
        console.log('orientation:', window.screen.orientation);
        if (typeof( window.screen.orientation ) !== "undefined") {
            document.getElementById('debug').innerHTML = window.screen.orientation.type + ' ' + window.screen.orientation.angle;
        } else {
            document.getElementById('debug').innerHTML = window.orientation;
        }

        document.getElementById('menu-wrapper').style.display = 'none';

        // Request permission for iOS 13+ devices
        if (
            typeof( DeviceMotionEvent ) !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function"
        ) {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("devicemotion", handleMotion);
                } else {
                    console.log('permission denied');
                }
            })
                .catch((x) => {console.log('error');});
        } else {
            console.log('assuming permission');
            window.addEventListener("devicemotion", handleMotion);
            console.log('running');
        }
    });

    window.requestAnimationFrame(drawFrame);
}