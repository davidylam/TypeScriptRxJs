import {Observable} from "rxjs/Observable";
//import * as $ from 'jquery';


import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

//import {Observable} from "rxjs/Observable";

//let output = document.getElementById("output");
//let button = document.getElementById("button");
//let output: JQuery = $("#output");

//let output: JQuery = $("output").get(0);
let output: any = $("#output");
let button: any = $("#button");

let click = Observable.fromEvent(button, "click");

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if(xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open("GET", url);
        xhr.send();
    }).retryWhen(retryStrategy({attempts: 3, delay: 1500}));
}

function loadWithFetch(url: string) {
    return Observable.defer(() => 
    {
        return Observable.fromPromise(
            fetch(url).then(r => r.json()));
    });    
}

function retryStrategy({attempts = 4, delay = 1000}) {
    return function(errors) {
        return errors
                .scan((acc, value) => {
                    console.log(acc, value);
                    return acc + 1;
                }, 0)
                .takeWhile(acc => acc < attempts)
                .delay(delay);
    }
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        //output.appendChild(div); //original
        output.append(div);

    });
}

loadWithFetch("movies.json").subscribe(renderMovies);

click.flatMap(e => loadWithFetch("movies.json"))
     .subscribe(
        renderMovies,
        e => console.log(`error: ${e}`),
        () => console.log("complete")
    );
function newFunction() {
    $;
}
