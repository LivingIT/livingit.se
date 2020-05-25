/* 
    Everything made in plain vanilla javascript just for the hell of it
    This file loads the css needed to style divs and the json file needed for content
    Note that the json objects propertys becomes divs with the content from the prop
    So its a bit dynamic and you can add properties as you wish. just remember to add styling in the CSS
*/
function load(){
    //Add the correct styling 
    let fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", 'meet.css');

    //Add responsive stuff
    let viewport = document.createElement('meta')
    viewport.setAttribute("content","width=device-width,initial-scale=1");

    let head = document.getElementsByTagName("head")[0];
    head.appendChild(fileref);
    head.appendChild(viewport);

    //Build up the base page structure
    let body = document.getElementsByTagName("BODY")[0];
    let header = document.createElement("header");
    header.setAttribute("id","header");
    let headerLink = document.createElement("a");
    let headerText = document.createTextNode("Living IT");

    headerLink.appendChild(headerText);
    headerLink.setAttribute("href","http://livingit.se");
    
    header.appendChild(headerLink);
    body.appendChild(header);

    let main = document.createElement("main");
    body.appendChild(main);

    //create the content area 
    let el = getNode('div','contentArea',null,"profile");
    main.appendChild(el);

    //Get all needed data from the URL
    let fullUrl = window.location.href;
    let idx = fullUrl.lastIndexOf("/");
    let who = fullUrl.substring(idx+1).replace(".html","");
    let folderPath = './people/' + who + '/';   

    document.title ="Meet " + who;

    //Make a request for the correct json file to show
    var request = new XMLHttpRequest();
    request.open('GET', folderPath + who +'.xml', true);

    request.onload = function() {
    if (request.status >= 200 && request.status < 400) {

        var text, parser, xmlDoc;
        text = request.responseText;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text,"text/xml");

        let x = xmlDoc.documentElement.children;
        let elRoot = document.getElementById('contentArea');

        //Get the Nodes
        let xNameNode = xmlDoc.getElementsByTagName("name")[0];
        let xBioNode = xmlDoc.getElementsByTagName("bio")[0];
        let xPhotoNode = xmlDoc.getElementsByTagName("photos")[0];

        if(xNameNode){
            let hNameNode = getNode('h1','n1',xNameNode.childNodes[0].nodeValue,'name');
            elRoot.appendChild(hNameNode);
        }
       
        if(xBioNode){
            let hBioNode = getNode('div','b1',null,'bio');

            if(xPhotoNode){
                let hBioPhotoNode = getImageNode('p1',folderPath+ xPhotoNode.children[0].childNodes[0].nodeValue,'m-photo');
                hBioNode.appendChild(hBioPhotoNode);
            }

            let hBioText = getNode('p',null,xBioNode.childNodes[0].nodeValue,null);
            hBioNode.appendChild(hBioText);
            
            elRoot.appendChild(hBioNode);
        }

        if(xPhotoNode){
            elChild = getPhotos(xPhotoNode,folderPath);
            elRoot.appendChild(elChild);
        }

    } else {
        console.log("oh oooh something went wrong");
    }
    };

    request.onerror = function() {
        console.log("oh oooh something went wrong with the connection");
    };

    request.send();
}
/**/
function getPhotos(pObj,folderPath){

    let pGalleryNode = getNode('div','photoGallery',null,'photos')

    for (let i = 0; i < pObj.children.length ;i++) {
        let pNode = getImageNode('p'+i, folderPath + pObj.children[i].childNodes[0].nodeValue);
        pGalleryNode.appendChild(pNode);
    }

    return pGalleryNode;
}

function getNode(tagName,id,text,classList){
    let elChild = document.createElement(tagName);

    if(id){
      elChild.setAttribute('id',id);     
    }
 
    if(text){
        elChild.innerText = text;
    }

    if(classList){
        elChild.setAttribute("class",classList)
    }

    return elChild;
}

function getImageNode(id,path,classList){
    let elChild = document.createElement('img');
    elChild.setAttribute('id',id);
    elChild.setAttribute('src',path);

    if(classList){
        elChild.setAttribute("class",classList)
    }

    return elChild;    
}

window.onload = function(){load();};
