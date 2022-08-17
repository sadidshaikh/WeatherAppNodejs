const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let tempreture = tempVal.replace("{%tempval%}", s);
    tempreture = tempreture.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    tempreture = tempreture.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    tempreture = tempreture.replace("{%location%}", orgVal.name);
    tempreture = tempreture.replace("{%country%}", orgVal.sys.country);
    tempreture = tempreture.replace("{%tempStatus%}", orgVal.weather[0].main);
    return tempreture;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=f18932b22917c7dc91c39ca869bbf415")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                console.log(objdata.main.temp);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
    else {
        res.write("File Not Found");
        res.end();
    }
});

const port = 9090;
const hostname = "127.0.0.1";

server.listen(port, hostname);