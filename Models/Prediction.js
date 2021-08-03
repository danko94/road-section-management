var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


async function getPrediction(model,carType, start_section, end_section, time, weekday, special, callback) {
    const BIGML_AUTH = 'username=zohardaniel;api_key=40c0877933a33d9d60c3cfb6bce112fb6396ca84'
    var bod = `{"model": "${model}", "input_data": {"000002": "${time}", "000004":"${weekday}", "000005":${special}, "000006": "${carType}", "000007": ${start_section}}}`
    //console.log('BODBODBOD '+ bod)

    //"date_time","time","weekday","special","cType","start_section","end_section"
    const Http = new XMLHttpRequest();
    const url=`https://bigml.io/andromeda/prediction?${BIGML_AUTH}`;
    Http.open("POST", url);
    Http.setRequestHeader('Content-Type', 'application/json');


    Http.onreadystatechange = function() { // Call function when the state changes.
    if (Http.readyState === 4 && Http.status === 201) {
        var resp = Math.round(JSON.parse(Http.responseText)['prediction']['000008']) // 4 needs to be changed to correct number
        console.log(resp)
        callback(end_section, resp)
        return resp;
     }
    //  else{
    //     console.log(Http.responseText)
    //  }
    }
    Http.send(bod);
}


module.exports.getPrediction =  getPrediction;
