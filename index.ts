import { O_DIRECT } from 'constants';
import express from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser'
import { get_channel } from './channel';
import { get_video } from './video';
//import { user } from 'users';

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    fs.readFile('./static/index.html', (err, data) => {
        if(err) { res.status(404); res.end(`<p>Lol error:</p>${err}`) } else {
            res.end(data)
        }
    })

})

app.get('/static/:file', function(req, res) {
    fs.readFile('./static/' + req.params.file, function(err, data) {
        if(err) {
            res.status(404);
            res.send('Y u here?');
        } else {
            res.contentType(req.params.file);
            res.send(data);
        }   
        res.end();
    }); 
});
app.get('/watch/:video', (req, res) => {
    fs.readFile('./static/watch.html', (err, data) => {
        res.contentType("html")
        if(err) {
            res.status(404)
            res.send('lul files missing :( (error on console)')
            console.log(`[${req.ip}|0/1] /watch failed to read static file. err:'${err}'`);
            console.log(`[${req.ip}|1/1] /watch ${req.params.video}`);
        } else {
            res.contentType("html");
            res.send(`${data}<script>\nconst vid = "${req.params.video}"\n</script>`);
        }   
        res.end();
    })
})

app.get('/channel-api/:channel', (req, res) => {get_channel(req, res)})
app.get('/video-api/:videoid', (req, res) => {get_video(req, res)})

app.get('/img/:file', (req, res) => {
    console.log(`[${req.ip}|0/0] img at: ./storadge/img/${req.params.file}.png`)
    fs.readFile(`./storadge/img/${req.params.file}.png`, function(err, data) {
        if(err) {
            res.status(404);
            fs.readFile('./static/404.jpeg', (err, data) => {
                if(err) {
                    res.end(`lul error in error .^. (${err})`)
                } else {
                    res.contentType("jpeg")
                    res.end(data)
                }
            })
        } else {
            res.contentType("png");
            res.send(data);
            res.end();
        }
    }); 
})
app.get('/lib/:file', function(req, res) {
    fs.readFile('./static/lib/' + req.params.file, function(err, data) {
        if(err) {
            res.status(404);
            res.send('Y u here?');
        } else {
            res.contentType(req.params.file);
            res.send(data);
            console.log(`[${req.ip}|0/0] Reading file: ${req.params.file}`);
            
        }   
        res.end();
    }); 
});

app.listen(PORT, () => { 
    console.log(`[SERVER]: running at http://localhost:${PORT}`)
})
